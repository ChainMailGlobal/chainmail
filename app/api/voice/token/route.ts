import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"
    const body = await request.json().catch(() => ({}))

    console.log("[v0] Voice token proxy - Backend URL:", backendUrl)
    console.log("[v0] Voice token proxy - Request body:", body)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const response = await fetch(`${backendUrl}/api/voice/token`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    console.log("[v0] Voice token proxy - Response status:", response.status)
    console.log("[v0] Voice token proxy - Response content-type:", response.headers.get("content-type"))

    const responseText = await response.text()

    // Check if response is JSON
    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      console.error("[v0] Voice token proxy - Backend returned non-JSON:", responseText.substring(0, 200))
      return NextResponse.json(
        { error: "Backend returned invalid response", detail: "Expected JSON but got HTML" },
        { status: 502 },
      )
    }

    // Parse and return the JSON response
    const data = JSON.parse(responseText)
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Voice token proxy error:", error)
    return NextResponse.json({ error: "Failed to get voice token", detail: error.message }, { status: 500 })
  }
}
