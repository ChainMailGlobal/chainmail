import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// GET /api/v3b/sessions/[sessionId] - Get session details
export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch session with CMRA agent details
    const { data: session, error } = await supabase
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
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("[v0] Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

// PATCH /api/v3b/sessions/[sessionId] - Update session
export async function PATCH(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params
    const body = await request.json()

    console.log("[v0] Updating session:", sessionId, body)

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update database
    const { data: session, error } = await supabase
      .from("witness_sessions")
      .update(body)
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error("[v0] Error updating session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}
