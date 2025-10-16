"use server"

import { createServerClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function getUserDashboardData() {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      return { error: "Database not available" }
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: "Unauthorized" }
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (profileError) {
      console.error("[v0] Error fetching profile:", profileError)
    }

    let subscription = null
    let hasActiveSubscription = false
    let currentPlan = "Free"

    if (user.email) {
      try {
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        })

        if (customers.data.length > 0) {
          const subscriptions = await stripe.subscriptions.list({
            customer: customers.data[0].id,
            status: "active",
            limit: 1,
          })

          if (subscriptions.data.length > 0) {
            subscription = subscriptions.data[0]
            hasActiveSubscription = true
            // Extract plan name from subscription metadata or price nickname
            const priceId = subscription.items.data[0]?.price.id
            if (priceId) {
              const price = await stripe.prices.retrieve(priceId)
              currentPlan = price.nickname || "Paid Plan"
            }
          }
        }
      } catch (stripeError) {
        console.error("[v0] Error checking Stripe subscription:", stripeError)
      }
    }

    // Fetch user's witness sessions with agent details
    const { data: sessions, error: sessionsError } = await supabase
      .from("witness_sessions")
      .select(`
        *,
        cmra_agent:cmra_agents(
          id,
          full_name,
          cmra_name,
          email
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (sessionsError) {
      console.error("[v0] Error fetching sessions:", sessionsError)
    }

    // Fetch recent session events for activity timeline
    const sessionIds = sessions?.map((s) => s.id) || []
    const { data: events, error: eventsError } = await supabase
      .from("session_events")
      .select("*")
      .in("session_id", sessionIds)
      .order("timestamp", { ascending: false })
      .limit(20)

    if (eventsError) {
      console.error("[v0] Error fetching events:", eventsError)
    }

    // Calculate compliance status
    const completedSessions = sessions?.filter((s) => s.status === "completed") || []
    const inProgressSessions = sessions?.filter((s) => s.status === "in_progress") || []
    const scheduledSessions = sessions?.filter((s) => s.status === "scheduled") || []

    const complianceStatus =
      completedSessions.length > 0 ? "compliant" : inProgressSessions.length > 0 ? "in_progress" : "pending"

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name || "User",
        phone: profile?.phone,
      },
      sessions: sessions || [],
      events: events || [],
      stats: {
        totalSessions: sessions?.length || 0,
        completedSessions: completedSessions.length,
        inProgressSessions: inProgressSessions.length,
        scheduledSessions: scheduledSessions.length,
        complianceStatus,
      },
      subscription: {
        hasActiveSubscription,
        currentPlan,
        stripeSubscription: subscription,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching dashboard data:", error)
    return { error: "Failed to fetch dashboard data" }
  }
}

export async function getSessionDocuments(sessionId: string) {
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

    const { data: session, error } = await supabase
      .from("witness_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      return { error: "Session not found" }
    }

    const documents = []

    if (session.form_1583_url) {
      documents.push({
        name: "Form 1583",
        type: "pdf",
        url: session.form_1583_url,
        status: "valid",
      })
    }

    if (session.witness_certificate_url) {
      documents.push({
        name: "Witness Certificate",
        type: "pdf",
        url: session.witness_certificate_url,
        status: "valid",
      })
    }

    if (session.customer_id_document_url) {
      documents.push({
        name: "ID Document",
        type: "image",
        url: session.customer_id_document_url,
        status: "valid",
      })
    }

    if (session.video_recording_url) {
      documents.push({
        name: "Session Recording",
        type: "video",
        url: session.video_recording_url,
        status: "valid",
      })
    }

    return { documents, session }
  } catch (error) {
    console.error("[v0] Error fetching documents:", error)
    return { error: "Failed to fetch documents" }
  }
}
