import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// GET /api/v3b/sessions - Get all sessions for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch sessions with CMRA agent details
    const { data: sessions, error } = await supabase
      .from("witness_sessions")
      .select(`
        *,
        cmra_agent:cmra_agents(
          id,
          full_name,
          cmra_name
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

// POST /api/v3b/sessions - Create new witness session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scheduledAt, cmraAgentId } = body

    const supabase = createServerClient()

    // Validate user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create video room ID
    const videoRoomId = `room_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`

    // Insert into database
    const { data: session, error } = await supabase
      .from("witness_sessions")
      .insert({
        user_id: user.id,
        cmra_agent_id: cmraAgentId,
        status: "scheduled",
        scheduled_at: scheduledAt,
        video_room_id: videoRoomId,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    console.log("[v0] Created new V3b session:", session.id)

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
