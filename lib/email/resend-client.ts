import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendEmailFromAPI(data: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}) {
  try {
    console.log("[v0] Sending email to:", data.to)

    if (!resend) {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: data.to,
        subject: data.subject,
      })
      return { success: true, message: "Email would be sent (RESEND_API_KEY not configured)" }
    }

    await resend.emails.send({
      from: data.from || "MailboxHero Pro <noreply@mailboxhero.pro>",
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
    })

    console.log("[v0] Email sent successfully via Resend")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    throw error
  }
}
