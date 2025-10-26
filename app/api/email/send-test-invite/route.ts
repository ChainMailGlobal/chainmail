import { type NextRequest, NextResponse } from "next/server"
import { sendEmailFromAPI } from "@/lib/email/resend-client"
import { getCustomerInviteEmail } from "@/lib/email/templates"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, token, cmraName } = await request.json()

    if (!email || !firstName || !lastName || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://mailboxhero.pro"}/form1583/complete?token=${token}`

    const emailTemplate = getCustomerInviteEmail({
      customerName: `${firstName} ${lastName}`,
      inviteLink,
      cmraName: cmraName || "Your CMRA Location",
      expiresAt: expiresAt.toISOString(),
    })

    console.log("[v0] Sending test invite email to:", email)

    await sendEmailFromAPI({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    return NextResponse.json({
      success: true,
      inviteLink,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error sending test invite email:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
