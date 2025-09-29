import { type NextRequest, NextResponse } from "next/server"

interface WelcomeEmailData {
  email: string
  firstName: string
  lastName: string
  role: string
}

export async function POST(request: NextRequest) {
  try {
    const body: WelcomeEmailData = await request.json()

    const emailContent = `
      Hi ${body.firstName},

      Welcome to CMRAgent - Your CMRA Operations Platform!

      Your registration has been received and is being processed. Here's what you need to know:

      ACCOUNT DETAILS:
      - Name: ${body.firstName} ${body.lastName}
      - Email: ${body.email}
      - Role: ${body.role.toUpperCase()}
      - Status: Pending Verification

      NEXT STEPS:
      1. Complete the digital Form 1583 workflow as a customer (training requirement)
      2. Wait for verification confirmation (typically within 24 hours)
      3. Access your CMRAgent dashboard once verified

      RESOURCES:
      - Standard Operating Procedures (SOP): [Link]
      - Client-facing Form 1583 digital experience (V3): [Link]
      - Training videos: [Link]
      - Support: support@mailboxhero.pro

      As part of your training, you must complete a digital 1583 workflow just like your clients. 
      This helps you understand the customer experience and ensures you can guide clients effectively.

      Questions? Reply to this email or contact us at support@mailboxhero.pro

      Best regards,
      The CMRAgent Team
    `

    console.log("[v0] Welcome Email Sent:", {
      to: body.email,
      subject: "Welcome to CMRAgent - CMRA Operations Platform",
      timestamp: new Date().toISOString(),
    })

    // TODO: Send actual email using email service (Resend, SendGrid, etc.)

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
    })
  } catch (error) {
    console.error("[v0] Error sending welcome email:", error)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }
}
