import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/send-email"
import { getCustomerInviteEmail } from "@/lib/email/templates"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, token, cmraName } = await request.json()

    if (!email || !firstName || !lastName || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://mailboxhero.pro"}/form1583/complete?token=${token}`

    const emailHtml = getCustomerInviteEmail({
      customerName: `${firstName} ${lastName}`,
      inviteUrl,
      cmraName: cmraName || "Your CMRA Location",
      expiresInDays: 30,
    })

    await sendEmail({
      to: email,
      subject: "Complete Your USPS Form 1583 - Action Required",
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending test invite email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
