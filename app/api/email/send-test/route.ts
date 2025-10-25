import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/send-email"
import {
  getSessionConfirmationEmail,
  getSessionCompleteEmail,
  getSessionReminderEmail,
  getCustomerInviteEmail,
  getMissingUploadEmail,
  getInvalidUploadEmail,
  getViolationAlertEmail,
} from "@/lib/email/templates"

export async function POST(request: NextRequest) {
  try {
    const { template, to } = await request.json()

    if (!to) {
      return NextResponse.json({ error: "Email address required" }, { status: 400 })
    }

    let emailTemplate

    switch (template) {
      case "session-confirmation":
        emailTemplate = getSessionConfirmationEmail({
          customerName: "Test User",
          sessionDate: "Monday, January 15, 2025",
          sessionTime: "2:00 PM EST",
          agentName: "Sarah Johnson",
        })
        break

      case "session-complete":
        emailTemplate = getSessionCompleteEmail({
          customerName: "Test User",
          sessionId: "WS-2025-001234",
          form1583Url: "https://example.com/form-1583.pdf",
          certificateUrl: "https://example.com/certificate.pdf",
          confidenceScore: 98,
        })
        break

      case "session-reminder":
        emailTemplate = getSessionReminderEmail({
          customerName: "Test User",
          sessionDate: "Tomorrow, January 15",
          sessionTime: "2:00 PM EST",
          joinUrl: "https://mailboxhero.pro/session/join/abc123",
        })
        break

      case "customer-invite":
        emailTemplate = getCustomerInviteEmail({
          customerName: "Test User",
          cmraName: "Downtown Mail Center",
          inviteLink: "https://mailboxhero.pro/invite/xyz789",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        break

      case "missing-upload":
        emailTemplate = getMissingUploadEmail({
          customerName: "Test User",
          missingDocuments: ["Proof of Address", "Photo ID (back side)"],
          uploadLink: "https://mailboxhero.pro/upload/missing",
        })
        break

      case "invalid-upload":
        emailTemplate = getInvalidUploadEmail({
          customerName: "Test User",
          documentType: "Photo ID",
          reason: "Image is blurry and text is not legible",
          uploadLink: "https://mailboxhero.pro/upload/retry",
        })
        break

      case "violation-alert":
        emailTemplate = getViolationAlertEmail({
          customerName: "Test User",
          violationType: "Expired ID Document",
          description: "Your photo ID has expired. Please upload a current, valid ID.",
          actionUrl: "https://mailboxhero.pro/dashboard/compliance",
        })
        break

      default:
        return NextResponse.json({ error: "Invalid template" }, { status: 400 })
    }

    await sendEmail({
      to,
      subject: `[TEST] ${emailTemplate.subject}`,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    return NextResponse.json({ success: true, message: "Test email sent" })
  } catch (error) {
    console.error("[v0] Send test email error:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}
