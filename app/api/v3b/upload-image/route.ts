import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const sessionId = formData.get("sessionId") as string
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading image for session:", sessionId, type)

    // TODO: When Blob integration is added, use this:
    // const blob = await put(`v3b/sessions/${sessionId}/${type}.png`, file, {
    //   access: "public",
    //   addRandomSuffix: false,
    // })

    // Mock response for now
    const mockUrl = `/api/v3b/images/${sessionId}_${type}.png`

    // TODO: Update database with image URL
    // if (type === "signature") {
    //   await updateSession(sessionId, { customerSignatureUrl: blob.url })
    // } else if (type === "id") {
    //   await updateSession(sessionId, { customerIdDocumentUrl: blob.url })
    // }

    return NextResponse.json({
      success: true,
      url: mockUrl,
      size: file.size,
      sessionId,
      type,
    })
  } catch (error) {
    console.error("[v0] Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
