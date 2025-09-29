import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// POST /api/v3b/events - Log session event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, eventType, eventData } = body

    console.log("[v0] Logging session event:", { sessionId, eventType })

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insert event into database
    const { data: event, error } = await supabase
      .from("session_events")
      .insert({
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData,
        user_id: user.id,
        ip_address: request.headers.get("x-forwarded-for") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error logging event:", error)
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
  }
}
