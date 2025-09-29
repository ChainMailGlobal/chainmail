import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const sessionId = formData.get("sessionId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading video for session:", sessionId)

    // TODO: When Blob integration is added, use this:
    // const blob = await put(`v3b/sessions/${sessionId}/video.webm`, file, {
    //   access: "public",
    //   addRandomSuffix: false,
    // })

    // Mock response for now
    const mockUrl = `/api/v3b/videos/${sessionId}.webm`

    // TODO: Update database with video URL
    // await updateSession(sessionId, { videoRecordingUrl: blob.url })

    return NextResponse.json({
      success: true,
      url: mockUrl,
      size: file.size,
      sessionId,
    })
  } catch (error) {
    console.error("[v0] Error uploading video:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}
