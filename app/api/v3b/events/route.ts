import { type NextRequest, NextResponse } from "next/server"

// POST /api/v3b/events - Log session event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, eventType, eventData } = body

    console.log("[v0] Logging session event:", { sessionId, eventType })

    // TODO: Insert into session_events table
    // TODO: Get user info from auth

    const event = {
      id: crypto.randomUUID(),
      sessionId,
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error logging event:", error)
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
  }
}
