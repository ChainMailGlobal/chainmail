import { type NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/lib/ai/document-processor"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, documentUrl } = await req.json()

    if (!sessionId || !documentUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process document
    const result = await processDocument(documentUrl)

    // Log event
    const supabase = await createServerClient()
    await supabase.from("session_events").insert({
      session_id: sessionId,
      event_type: "ai_document_processing",
      event_data: { result },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Document processing error:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}
