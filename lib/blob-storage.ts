// Utilities for uploading files to Vercel Blob storage

export async function uploadVideoToBlob(videoBlob: Blob, sessionId: string): Promise<string> {
  try {
    console.log("[v0] Uploading video to Blob storage:", sessionId)

    // Create FormData
    const formData = new FormData()
    formData.append("file", videoBlob, `session_${sessionId}_video.webm`)
    formData.append("sessionId", sessionId)

    // Upload to API route
    const response = await fetch("/api/v3b/upload-video", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload video")
    }

    const data = await response.json()
    console.log("[v0] Video uploaded successfully:", data.url)

    return data.url
  } catch (error) {
    console.error("[v0] Error uploading video:", error)
    throw error
  }
}

export async function uploadImageToBlob(imageBlob: Blob, sessionId: string, type: "signature" | "id"): Promise<string> {
  try {
    console.log("[v0] Uploading image to Blob storage:", sessionId, type)

    const formData = new FormData()
    formData.append("file", imageBlob, `session_${sessionId}_${type}.png`)
    formData.append("sessionId", sessionId)
    formData.append("type", type)

    const response = await fetch("/api/v3b/upload-image", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    console.log("[v0] Image uploaded successfully:", data.url)

    return data.url
  } catch (error) {
    console.error("[v0] Error uploading image:", error)
    throw error
  }
}
