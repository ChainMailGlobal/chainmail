import { type NextRequest, NextResponse } from "next/server"

const AGENT_BACKEND_BASE = process.env.AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"
const MCP_API_KEY = process.env.MCP_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = `${AGENT_BACKEND_BASE}/api/agent/chat`

    console.log("[v0] Forwarding chat request to:", backendUrl)
    console.log("[v0] Request body:", JSON.stringify(body).substring(0, 100))

    const cookies = request.headers.get("cookie") || ""
    const match = cookies.match(/(?:^|; )mcp_sess=([^;]+)/)
    const cookieId = match?.[1]

    const sessionId = body?.session_id || cookieId || `sess_${crypto.randomUUID()}`
    const setCookie = sessionId !== cookieId

    // Forward the request to the live backend
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(MCP_API_KEY ? { "x-mcp-api-key": MCP_API_KEY } : {}),
      },
      body: JSON.stringify({
        ...body,
        session_id: sessionId,
      }),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error response:", errorText)
      return NextResponse.json(
        { error: `Backend returned ${response.status}: ${errorText || "No error message"}` },
        { status: response.status },
      )
    }

    // Get the response data
    const data = await response.json()
    console.log("[v0] Backend response data:", JSON.stringify(data).substring(0, 200))

    const nextResponse = NextResponse.json(data, { status: response.status })

    if (setCookie) {
      nextResponse.headers.append("Set-Cookie", `mcp_sess=${sessionId}; Path=/; SameSite=Lax; HttpOnly; Max-Age=86400`)
    }

    return nextResponse
  } catch (error) {
    console.error("[v0] Agent chat proxy error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to connect to chat agent" },
      { status: 500 },
    )
  }
}
