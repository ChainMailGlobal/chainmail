import { type NextRequest, NextResponse } from "next/server"
import { analyzeSignature } from "@/lib/ai/signature-analysis"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, signatureUrl, referenceSignatureUrl } = await req.json()

    if (!sessionId || !signatureUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Analyze signature
    const result = await analyzeSignature({
      signatureUrl,
      referenceSignatureUrl,
    })

    // Log event
    const supabase = await createServerClient()
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "ai_signature_analysis",
      event_data: { result },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Signature analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze signature" }, { status: 500 })
  }
}
