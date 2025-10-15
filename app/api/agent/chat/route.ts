import { type NextRequest, NextResponse } from "next/server"

const MCP_GATEWAY_URL =
  process.env.MCP_GATEWAY_URL || "https://mcp-gateway-303378319285.us-central1.run.app/mcp/orchestrate"
const MCP_API_KEY = process.env.MCP_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Forwarding chat request to:", MCP_GATEWAY_URL)
    console.log("[v0] Request body:", JSON.stringify(body))

    const cookies = request.headers.get("cookie") || ""
    const match = cookies.match(/(?:^|; )mcp_sess=([^;]+)/)
    const cookieId = match?.[1]

    const sessionId = body?.session_id || cookieId || `sess_${crypto.randomUUID()}`
    const setCookie = sessionId !== cookieId

    const response = await fetch(MCP_GATEWAY_URL, {
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
    console.log("[v0] Backend response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error response:", errorText)

      return NextResponse.json(
        {
          error: `MCP Gateway returned ${response.status}`,
          details: errorText || "No error message",
          endpoint: MCP_GATEWAY_URL,
          hint:
            response.status === 405
              ? "Method not allowed - check if endpoint accepts POST"
              : response.status === 404
                ? "Endpoint not found - verify MCP_GATEWAY_URL is correct"
                : undefined,
        },
        { status: response.status },
      )
    }

    // Get the response data
    const data = await response.json()
    console.log("[v0] Backend response data:", JSON.stringify(data))

    const nextResponse = NextResponse.json(data, { status: response.status })

    if (setCookie) {
      nextResponse.headers.append("Set-Cookie", `mcp_sess=${sessionId}; Path=/; SameSite=Lax; HttpOnly; Max-Age=86400`)
    }

    return nextResponse
  } catch (error) {
    console.error("[v0] Agent chat proxy error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to connect to chat agent",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
