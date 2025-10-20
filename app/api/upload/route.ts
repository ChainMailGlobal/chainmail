import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const backendUrl = process.env.AGENT_BACKEND_BASE || ""

  console.log("[v0] Upload proxy called")
  console.log("[v0] Backend URL:", backendUrl || "(empty - will fail)")

  if (!backendUrl) {
    console.error("[v0] AGENT_BACKEND_BASE not configured")
    return NextResponse.json(
      { error: "Backend not configured. Set AGENT_BACKEND_BASE environment variable." },
      { status: 500 },
    )
  }

  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file")

    console.log("[v0] File received:", file ? `${(file as File).name} (${(file as File).size} bytes)` : "none")

    // Forward the form data to the backend
    const uploadUrl = `${backendUrl}/api/upload`
    console.log("[v0] Forwarding to:", uploadUrl)

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let fetch set it with the boundary
    })

    console.log("[v0] Backend response status:", response.status)
    console.log("[v0] Backend response content-type:", response.headers.get("content-type"))

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      const data = await response.json()
      console.log("[v0] Upload response:", data)
      return NextResponse.json(data, { status: response.status })
    } else {
      const text = await response.text()
      console.error("[v0] Backend returned non-JSON response:", text.substring(0, 200))
      return NextResponse.json(
        { error: "Backend returned invalid response", details: text.substring(0, 200) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Upload proxy error:", error)
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
