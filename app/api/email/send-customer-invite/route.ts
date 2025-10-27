import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { getCustomerInviteEmail } from "@/lib/email/templates"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, customerName, cmraName, inviteLink } = await request.json()

    const emailHtml = getCustomerInviteEmail({
      customerName,
      cmraName,
      inviteLink,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    })

    const { error } = await resend.emails.send({
      from: "MailBox Hero <noreply@mailboxhero.pro>",
      to: email,
      subject: `${cmraName} has invited you to complete your Form 1583`,
      html: emailHtml,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
