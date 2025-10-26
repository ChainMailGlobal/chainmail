import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { getCustomerInviteEmail } from "@/lib/email/templates"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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
      inviteLink, // Changed from inviteUrl
      cmraName: cmraName || "Your CMRA Location",
      expiresAt: expiresAt.toISOString(), // Changed from expiresInDays
    })

    console.log("[v0] Sending test invite email to:", email)

    if (resend) {
      await resend.emails.send({
        from: "MailboxHero Pro <noreply@mailboxhero.pro>",
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      })
      console.log("[v0] Test invite email sent successfully via Resend")
    } else {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: email,
        subject: emailTemplate.subject,
      })
    }

    return NextResponse.json({
      success: true,
      inviteLink,
      message: resend ? "Email sent successfully" : "RESEND_API_KEY not configured (check logs)",
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
