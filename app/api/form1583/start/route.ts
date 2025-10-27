import { type NextRequest, NextResponse } from "next/server"

const AGENT_BACKEND_BASE = process.env.AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    console.log("[v0] Validating Form 1583 invitation token:", token)

    // Call backend to validate token and create Supabase account
    const response = await fetch(`${AGENT_BACKEND_BASE}/api/form1583/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Backend validation failed:", errorData)
      return NextResponse.json(
        { error: errorData.error || "Invalid or expired invitation" },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("[v0] Token validated successfully:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error validating invitation:", error)
    return NextResponse.json({ error: "Failed to validate invitation" }, { status: 500 })
  }
}
