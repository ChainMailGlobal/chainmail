import type { NextRequest } from "next/server"

export const maxDuration = 30

const MCP_BACKEND_URL = process.env.AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Chat API called - proxying to MCP backend")
    const body = await req.json()

    console.log("[v0] Received message:", body.message)
    console.log("[v0] Session ID:", body.session_id)
    console.log("[v0] MCP Backend URL:", MCP_BACKEND_URL)

    // Forward request to MCP orchestrator backend
    const response = await fetch(`${MCP_BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: req.signal,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] MCP backend error:", response.status, errorText)
      throw new Error(`MCP backend returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] MCP backend response received:", JSON.stringify(data, null, 2))

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Chat API proxy error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
