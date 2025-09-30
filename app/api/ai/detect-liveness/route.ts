import { type NextRequest, NextResponse } from "next/server"
import { detectLiveness } from "@/lib/ai/liveness-detection"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, videoUrl } = await req.json()

    if (!sessionId || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Detect liveness
    const result = await detectLiveness(videoUrl)

    // Update session
    const supabase = await createServerClient()
    await supabase
      .from("witness_sessions")
      .update({
        liveness_score: result.livenessScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    // Log event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "ai_liveness_detection",
      event_data: { result },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Liveness detection error:", error)
    return NextResponse.json({ error: "Failed to detect liveness" }, { status: 500 })
  }
}
