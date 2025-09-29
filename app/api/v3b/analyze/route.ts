import { type NextRequest, NextResponse } from "next/server"
import { analyzeWitnessSession, scoreVideoFrame, analyzeVerbalAcknowledgment } from "@/lib/ai/confidence-scorer"

// POST /api/v3b/analyze - Analyze witness session with AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, analysisType, data } = body

    console.log("[v0] Starting AI analysis:", { sessionId, analysisType })

    let result

    switch (analysisType) {
      case "full_session":
        result = await analyzeWitnessSession({
          videoFrameData: data.videoFrame,
          audioTranscript: data.transcript,
          documentImageData: data.documentImage,
          sessionContext: {
            customerName: data.customerName,
            sessionDuration: data.duration,
            verbalAcknowledgment: data.verbalAcknowledgment,
          },
        })
        break

      case "video_frame":
        const score = await scoreVideoFrame(data.frameData, data.previousScore)
        result = { score }
        break

      case "verbal_acknowledgment":
        result = await analyzeVerbalAcknowledgment(data.transcript)
        break

      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    // TODO: Store analysis results in database
    // TODO: Update witness_sessions table with scores

    return NextResponse.json({
      success: true,
      sessionId,
      analysisType,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in AI analysis:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
