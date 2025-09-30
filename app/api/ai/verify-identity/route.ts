import { type NextRequest, NextResponse } from "next/server"
import { verifyIdentity } from "@/lib/ai/identity-verification"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, faceVideoUrl, idDocumentUrl, verbalAcknowledgment } = await req.json()

    if (!sessionId || !faceVideoUrl || !idDocumentUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify identity using AI
    const result = await verifyIdentity({
      faceVideoUrl,
      idDocumentUrl,
      verbalAcknowledgment,
    })

    // Update session with AI analysis
    const supabase = await createServerClient()
    const { error: updateError } = await supabase
      .from("witness_sessions")
      .update({
        confidence_score: result.confidenceScore,
        liveness_score: result.livenessScore,
        fraud_flags: result.fraudFlags,
        ai_analysis: result,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    if (updateError) {
      console.error("Failed to update session:", updateError)
    }

    // Log event
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "ai_identity_verification",
      event_data: { result },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Identity verification error:", error)
    return NextResponse.json({ error: "Failed to verify identity" }, { status: 500 })
  }
}
