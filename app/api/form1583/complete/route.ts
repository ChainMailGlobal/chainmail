import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = process.env.AGENT_BACKEND_BASE || ""

    if (!backendUrl) {
      console.error("[v0] AGENT_BACKEND_BASE not configured")
      return NextResponse.json({ success: false, error: "Backend not configured" }, { status: 500 })
    }

    const response = await fetch(`${backendUrl}/api/form1583/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Submission failed" }))
      return NextResponse.json({ success: false, error: errorData.error }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error completing form:", error)
    return NextResponse.json({ success: false, error: "Failed to complete form" }, { status: 500 })
  }
}
