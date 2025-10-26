import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, cmraName } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Creating test invitation in backend for:", email)

    const backendUrl = process.env.AGENT_BACKEND_BASE || "https://app.mailboxhero.pro"

    // Create invitation via backend's bulk invite endpoint with single customer
    const csvData = `first_name,last_name,email\n${firstName},${lastName},${email}`

    const formData = new FormData()
    const blob = new Blob([csvData], { type: "text/csv" })
    formData.append("file", blob, "test-invite.csv")
    formData.append("cmra_name", cmraName || "Test CMRA Location")
    formData.append("cmra_address", "123 Test Street, Test City, TS 12345")

    const backendResponse = await fetch(`${backendUrl}/api/form1583/bulk-invite`, {
      method: "POST",
      body: formData,
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("[v0] Backend error:", errorText)
      throw new Error(`Backend returned ${backendResponse.status}: ${errorText}`)
    }

    const result = await backendResponse.json()
    console.log("[v0] Backend response:", result)

    // Backend should have sent the email and returned the invitation details
    const inviteLink = result.invitations?.[0]?.invite_link || result.invite_link
    const token = result.invitations?.[0]?.token || result.token

    console.log("[v0] Invitation created successfully")
    console.log("[v0] Invite link:", inviteLink)

    return NextResponse.json({
      success: true,
      inviteLink,
      token,
      message: "Test invitation created and email sent by backend",
    })
  } catch (error) {
    console.error("[v0] Error creating test invitation:", error)
    return NextResponse.json(
      {
        error: "Failed to create invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
