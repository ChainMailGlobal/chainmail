"use server"

import { Resend } from "resend"
import {
  getSessionConfirmationEmail,
  getSessionCompleteEmail,
  getSessionReminderEmail,
  getCustomerInviteEmail,
} from "./templates"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendEmail(data: { to: string; subject: string; html: string; text?: string }) {
  try {
    console.log("[v0] Sending email to:", data.to)

    if (resend) {
      await resend.emails.send({
        from: "MailboxHero Pro <noreply@mailboxhero.pro>",
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      })
      console.log("[v0] Email sent successfully via Resend")
    } else {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: data.to,
        subject: data.subject,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendSessionConfirmationEmail(data: {
  to: string
  customerName: string
  sessionDate: string
  sessionTime: string
  agentName: string
}) {
  try {
    const template = getSessionConfirmationEmail(data)

    console.log("[v0] Sending session confirmation email to:", data.to)

    if (resend) {
      await resend.emails.send({
        from: "StreamlineWitness <noreply@streamlinewitness.com>",
        to: data.to,
        subject: template.subject,
        html: template.html,
      })
      console.log("[v0] Email sent successfully via Resend")
    } else {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: data.to,
        subject: template.subject,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendSessionCompleteEmail(data: {
  to: string
  customerName: string
  sessionId: string
  form1583Url: string
  certificateUrl: string
  confidenceScore?: number
}) {
  try {
    const template = getSessionCompleteEmail(data)

    console.log("[v0] Sending session complete email to:", data.to)

    if (resend) {
      await resend.emails.send({
        from: "StreamlineWitness <noreply@streamlinewitness.com>",
        to: data.to,
        subject: template.subject,
        html: template.html,
      })
      console.log("[v0] Email sent successfully via Resend")
    } else {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: data.to,
        subject: template.subject,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendSessionReminderEmail(data: {
  to: string
  customerName: string
  sessionDate: string
  sessionTime: string
  joinUrl: string
}) {
  try {
    const template = getSessionReminderEmail(data)

    console.log("[v0] Sending session reminder email to:", data.to)

    if (resend) {
      await resend.emails.send({
        from: "StreamlineWitness <noreply@streamlinewitness.com>",
        to: data.to,
        subject: template.subject,
        html: template.html,
      })
      console.log("[v0] Email sent successfully via Resend")
    } else {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: data.to,
        subject: template.subject,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendCustomerInviteEmail(data: {
  to: string
  customerName?: string
  cmraName: string
  inviteLink: string
  expiresAt: string
}) {
  try {
    const template = getCustomerInviteEmail(data)

    console.log("[v0] Sending customer invite email to:", data.to)

    if (resend) {
      await resend.emails.send({
        from: "MailboxHero Pro <noreply@mailboxhero.pro>",
        to: data.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })
      console.log("[v0] Email sent successfully via Resend")
    } else {
      console.log("[v0] RESEND_API_KEY not configured. Email would be sent:", {
        to: data.to,
        subject: template.subject,
      })
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
