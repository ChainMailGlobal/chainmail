"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function terminateClient(userId: string, reason: string) {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      return { error: "Database not available" }
    }

    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !currentUser) {
      return { error: "Unauthorized" }
    }

    // Update user status to terminated
    const { error: updateError } = await supabase
      .from("users")
      .update({
        status: "terminated",
        terminated_at: new Date().toISOString(),
        termination_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("[v0] Error terminating client:", updateError)
      return { error: "Failed to terminate client" }
    }

    // Cancel any scheduled sessions
    await supabase
      .from("witness_sessions")
      .update({ status: "cancelled" })
      .eq("user_id", userId)
      .eq("status", "scheduled")

    // Log termination event
    await supabase.from("session_events").insert({
      session_id: null,
      event_type: "client_terminated",
      event_data: {
        userId,
        reason,
        terminatedBy: currentUser.id,
        timestamp: new Date().toISOString(),
      },
      created_by: currentUser.id,
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error terminating client:", error)
    return { error: "Failed to terminate client" }
  }
}

export async function getCMRADashboardData() {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      return { error: "Database not available" }
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: "Unauthorized" }
    }

    const { data: agent, error: agentError } = await supabase.from("cmra_agents").select("*").eq("id", user.id).single()

    if (agentError || !agent) {
      return { error: "Not authorized as CMRA agent" }
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from("witness_sessions")
      .select(`
        *,
        user:users(
          id,
          full_name,
          email,
          phone,
          status,
          terminated_at,
          termination_reason
        )
      `)
      .eq("agent_id", agent.id)
      .order("created_at", { ascending: false })

    if (sessionsError) {
      console.error("[v0] Error fetching agent sessions:", sessionsError)
    }

    const allSessions = sessions || []
    const completedSessions = allSessions.filter((s) => s.status === "completed")
    const inProgressSessions = allSessions.filter((s) => s.status === "in_progress")
    const scheduledSessions = allSessions.filter((s) => s.status === "scheduled")

    const revenuePerSession = 50
    const totalRevenue = completedSessions.length * revenuePerSession

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newCustomersThisMonth = allSessions.filter((s) => new Date(s.created_at) >= firstDayOfMonth).length

    const terminatedThisMonth = allSessions.filter(
      (s) =>
        s.user?.status === "terminated" && s.user.terminated_at && new Date(s.user.terminated_at) >= firstDayOfMonth,
    ).length

    const sessionsWithHighConfidence = completedSessions.filter((s) => s.confidence_score && s.confidence_score >= 90)
    const complianceRate =
      completedSessions.length > 0 ? (sessionsWithHighConfidence.length / completedSessions.length) * 100 : 0

    const uniqueCustomers = new Map()
    allSessions.forEach((session) => {
      if (session.user && !uniqueCustomers.has(session.user.id)) {
        const customerSessions = allSessions.filter((s) => s.user_id === session.user.id)
        const completedCount = customerSessions.filter((s) => s.status === "completed").length
        const totalCount = customerSessions.length

        uniqueCustomers.set(session.user.id, {
          ...session.user,
          sessionCount: totalCount,
          completedSessionCount: completedCount,
          completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
          lastSession: customerSessions.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )[0],
        })
      }
    })

    const alerts = []

    if (newCustomersThisMonth > 0) {
      alerts.push({
        type: "new_customers",
        severity: "info",
        message: `${newCustomersThisMonth} new customer${newCustomersThisMonth > 1 ? "s" : ""} this month`,
        count: newCustomersThisMonth,
      })
    }

    if (terminatedThisMonth > 0) {
      alerts.push({
        type: "terminated_clients",
        severity: "warning",
        message: `${terminatedThisMonth} client${terminatedThisMonth > 1 ? "s" : ""} terminated this month`,
        count: terminatedThisMonth,
      })
    }

    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    scheduledSessions.forEach((session) => {
      if (session.scheduled_at) {
        const scheduledDate = new Date(session.scheduled_at)
        if (scheduledDate <= sevenDaysFromNow && scheduledDate >= now) {
          alerts.push({
            type: "upcoming_session",
            severity: "info",
            message: `Session with ${session.user?.full_name} scheduled in ${Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`,
            sessionId: session.id,
          })
        }
      }
    })

    inProgressSessions.forEach((session) => {
      alerts.push({
        type: "in_progress",
        severity: "warning",
        message: `Session with ${session.user?.full_name} is in progress`,
        sessionId: session.id,
      })
    })

    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    allSessions.forEach((session) => {
      if (session.metadata?.idExpirationDate) {
        const expirationDate = new Date(session.metadata.idExpirationDate)
        if (expirationDate <= thirtyDaysFromNow && expirationDate >= now) {
          alerts.push({
            type: "expiring_id",
            severity: "warning",
            message: `${session.user?.full_name}'s ID expires in ${Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`,
            userId: session.user_id,
          })
        }
      }
    })

    const sessionIds = allSessions.map((s) => s.id)
    const { data: events, error: eventsError } = await supabase
      .from("session_events")
      .select("*")
      .in("session_id", sessionIds)
      .order("timestamp", { ascending: false })
      .limit(10)

    if (eventsError) {
      console.error("[v0] Error fetching events:", eventsError)
    }

    return {
      agent: {
        id: agent.id,
        businessName: agent.business_name,
        licenseNumber: agent.license_number,
        isVerified: agent.is_verified,
      },
      metrics: {
        totalRevenue,
        totalCustomers: uniqueCustomers.size,
        newCustomersThisMonth,
        terminatedThisMonth,
        complianceRate: Math.round(complianceRate * 10) / 10,
        totalSessions: allSessions.length,
        completedSessions: completedSessions.length,
        inProgressSessions: inProgressSessions.length,
        scheduledSessions: scheduledSessions.length,
      },
      customers: Array.from(uniqueCustomers.values()),
      sessions: allSessions,
      alerts,
      recentEvents: events || [],
    }
  } catch (error) {
    console.error("[v0] Error fetching CMRA dashboard data:", error)
    return { error: "Failed to fetch dashboard data" }
  }
}

export async function getCMRAAnalytics(agentId: string, timeRange: "week" | "month" | "year" = "month") {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      return { error: "Database not available" }
    }

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Fetch sessions in date range
    const { data: sessions, error } = await supabase
      .from("witness_sessions")
      .select("*")
      .eq("agent_id", agentId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching analytics:", error)
      return { error: "Failed to fetch analytics" }
    }

    // Group sessions by date
    const sessionsByDate = new Map()
    sessions?.forEach((session) => {
      const date = new Date(session.created_at).toLocaleDateString()
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, [])
      }
      sessionsByDate.get(date).push(session)
    })

    // Calculate daily metrics
    const dailyMetrics = Array.from(sessionsByDate.entries()).map(([date, sessions]) => ({
      date,
      totalSessions: sessions.length,
      completedSessions: sessions.filter((s: any) => s.status === "completed").length,
      averageConfidence:
        sessions.filter((s: any) => s.confidence_score).reduce((sum: number, s: any) => sum + s.confidence_score, 0) /
          sessions.length || 0,
    }))

    return {
      dailyMetrics,
      totalSessions: sessions?.length || 0,
      completedSessions: sessions?.filter((s) => s.status === "completed").length || 0,
      averageProcessingTime: 0, // TODO: Calculate from session timestamps
    }
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return { error: "Failed to fetch analytics" }
  }
}
