import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// GET /api/v3b/availability - Get available time slots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    // Query database for agent availability on the specified date
    const { data: availabilitySlots, error } = await supabase
      .from("agent_availability")
      .select(`
        *,
        cmra_agent:cmra_agents(
          id,
          full_name,
          cmra_name
        )
      `)
      .eq("date", date)
      .eq("is_available", true)
      .order("start_time", { ascending: true })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
    }

    // Check for existing bookings on this date
    const { data: bookedSessions, error: bookingError } = await supabase
      .from("witness_sessions")
      .select("scheduled_at, cmra_agent_id")
      .gte("scheduled_at", `${date}T00:00:00`)
      .lte("scheduled_at", `${date}T23:59:59`)
      .in("status", ["scheduled", "in_progress"])

    if (bookingError) {
      console.error("[v0] Booking query error:", bookingError)
    }

    // Create a set of booked time slots
    const bookedSlots = new Set(
      (bookedSessions || []).map((session) => `${session.cmra_agent_id}_${session.scheduled_at}`),
    )

    // Format slots and filter out booked ones
    const slots = availabilitySlots.map((slot) => {
      const slotKey = `${slot.cmra_agent_id}_${date}T${slot.start_time}`
      return {
        time: slot.start_time,
        endTime: slot.end_time,
        available: !bookedSlots.has(slotKey),
        agentId: slot.cmra_agent_id,
        agentName: slot.cmra_agent?.full_name || "Unknown Agent",
        cmraName: slot.cmra_agent?.cmra_name || "Unknown CMRA",
      }
    })

    return NextResponse.json({ date, slots })
  } catch (error) {
    console.error("[v0] Error fetching availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}
