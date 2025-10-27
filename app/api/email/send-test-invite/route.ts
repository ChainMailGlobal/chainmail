import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { getCustomerInviteEmail } from "@/lib/email/templates"

const resend = new Resend(process.env.RESEND_API_KEY)
const backendUrl = process.env.AGENT_BACKEND_BASE || "https://mailboxhero.pro"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, cmraName, cmraId, cmraOwnerId } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Creating test invitation via backend for:", email)

    const backendResponse = await fetch(`${backendUrl}/api/form1583/bulk-invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cmra_id: cmraId || "test-cmra-id",
        cmra_owner_id: cmraOwnerId || "test-owner-id",
        clients: [
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            client_type: "individual",
          },
        ],
      }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("[v0] Backend error:", backendResponse.status, errorText)
      throw new Error(`Backend returned ${backendResponse.status}: ${errorText}`)
    }

    const backendData = await backendResponse.json()
    console.log("[v0] Backend response:", backendData)

    if (!backendData.success || !backendData.invitations || backendData.invitations.length === 0) {
      throw new Error("Backend did not return invitation data")
    }

    const invitation = backendData.invitations[0]

    const emailHtml = getCustomerInviteEmail({
      customerName: `${invitation.client_first_name} ${invitation.client_last_name}`,
      cmraName: invitation.cmra_name || cmraName || "Test CMRA Location",
      inviteLink: invitation.invite_link,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    })

    const { error: emailError } = await resend.emails.send({
      from: "MailBox Hero <noreply@mailboxhero.pro>",
      to: invitation.client_email,
      subject: `${invitation.cmra_name} has invited you to complete your Form 1583`,
      html: emailHtml,
    })

    if (emailError) {
      console.error("[v0] Email error:", emailError)
      throw new Error(`Failed to send email: ${emailError.message}`)
    }

    console.log("[v0] Test invitation email sent successfully")

    return NextResponse.json({
      success: true,
      inviteLink: invitation.invite_link,
      token: invitation.token,
      invitation_id: invitation.id,
      message: "Test invitation created and email sent",
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
