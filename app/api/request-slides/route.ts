import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log(`[v0] Slide deck requested by: ${email}`)

    // TODO: Integrate with email service (SendGrid, Resend, etc.) to send actual slide deck
    // For now, we'll just simulate success

    return NextResponse.json({
      success: true,
      message: "Slide deck request received successfully",
    })
  } catch (error) {
    console.error("Error processing slide deck request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
