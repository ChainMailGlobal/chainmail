import { type NextRequest, NextResponse } from "next/server"
import {
  sendSessionConfirmationEmail,
  sendSessionCompleteEmail,
  sendSessionReminderEmail,
} from "@/lib/email/send-email"

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    console.log("[v0] Sending notification:", type)

    let result

    switch (type) {
      case "session_confirmation":
        result = await sendSessionConfirmationEmail(data)
        break
      case "session_complete":
        result = await sendSessionCompleteEmail(data)
        break
      case "session_reminder":
        result = await sendSessionReminderEmail(data)
        break
      default:
        return NextResponse.json({ success: false, message: "Invalid notification type" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error sending notification:", error)
    return NextResponse.json({ success: false, message: "Failed to send notification" }, { status: 500 })
  }
}
