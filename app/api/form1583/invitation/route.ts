import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 })
    }

    const backendUrl = process.env.AGENT_BACKEND_BASE || ""

    if (!backendUrl) {
      console.error("[v0] AGENT_BACKEND_BASE not configured")
      return NextResponse.json({ success: false, error: "Backend not configured" }, { status: 500 })
    }

    const response = await fetch(`${backendUrl}/api/form1583/invitation?token=${token}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Invalid or expired token" }))
      return NextResponse.json({ success: false, error: errorData.error }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching invitation:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch invitation" }, { status: 500 })
  }
}
