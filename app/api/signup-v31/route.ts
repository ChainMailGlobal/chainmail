import { type NextRequest, NextResponse } from "next/server"

function generateDemoCredentials() {
  const adjectives = ["Swift", "Secure", "Smart", "Elite", "Prime", "Pro", "Max", "Ultra"]
  const nouns = ["Agent", "User", "Demo", "Client", "Tester", "Guest", "Pilot", "Beta"]
  const username = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`
  const password = Math.random().toString(36).substring(2, 10).toUpperCase()
  return { username, password }
}

async function sendDemoCredentials(email: string, name: string, username: string, password: string) {
  const emailBody = `
    Hi ${name},

    Thank you for requesting access to the MailboxHero v3.1 Advanced Demo!

    Your exclusive demo credentials:
    Username: ${username}
    Password: ${password}

    Access the demo at: ${process.env.NEXT_PUBLIC_SITE_URL || "https://mailboxhero.app"}/demo-v31

    These credentials are valid for 24 hours and provide full access to our patent-pending CMRA compliance technology including:
    • AI Witness Technology (V3)
    • Interactive Signature Pads with Confidence Scoring
    • CMID Token Minting on XRP Ledger
    • Complete CMRAgent Dashboard

    Questions? Reply to this email or contact Daniel@chainmail.global

    Best regards,
    The MailboxHero Team
  `

  // For now, log the email content - replace with actual email service
  console.log("[v0] Demo Credentials Email:", {
    to: email,
    subject: "Your MailboxHero v3.1 Demo Access",
    body: emailBody,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, role } = body

    const { username, password } = generateDemoCredentials()

    console.log("[v0] New v3.1 Demo Request:", {
      name,
      email,
      company,
      role,
      username,
      password,
      timestamp: new Date().toISOString(),
    })

    await sendDemoCredentials(email, name, username, password)

    // 1. Send email notification to Daniel@chainmail.global
    // 2. Store in database
    // 3. Send to CRM/lead management system

    return NextResponse.json({
      success: true,
      message: "Demo credentials sent to your email",
      credentials: { username, password },
    })
  } catch (error) {
    console.error("[v0] Error processing v3.1 signup:", error)
    return NextResponse.json({ success: false, message: "Failed to process request" }, { status: 500 })
  }
}
