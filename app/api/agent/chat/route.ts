import { type NextRequest, NextResponse } from "next/server"

const AGENT_BACKEND_BASE = process.env.AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()

    // Get cookies from the incoming request
    const cookies = request.cookies
    const mhSid = cookies.get("mh_sid")?.value

    // Forward the request to the live backend
    const response = await fetch(`${AGENT_BACKEND_BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the mh_sid cookie if it exists
        ...(mhSid ? { Cookie: `mh_sid=${mhSid}` } : {}),
      },
      body: JSON.stringify(body),
    })

    // Get the response data
    const data = await response.json()

    // Create the response
    const nextResponse = NextResponse.json(data, { status: response.status })

    // Forward any Set-Cookie headers from the backend (including mh_sid)
    const setCookieHeader = response.headers.get("set-cookie")
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader)
    }

    return nextResponse
  } catch (error) {
    console.error("[v0] Agent chat proxy error:", error)
    return NextResponse.json({ error: "Failed to connect to chat agent" }, { status: 500 })
  }
}
