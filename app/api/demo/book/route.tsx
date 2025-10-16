import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/send-email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, companyName, phone, demoType, scheduledAt, calendlyEventId, meetingUrl } = body

    const supabase = await createClient()

    // Get current user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: booking, error } = await supabase
      .from("demo_bookings")
      .insert({
        user_id: user?.id,
        email,
        full_name: fullName,
        company_name: companyName,
        phone,
        demo_type: demoType || "platform_overview",
        scheduled_at: scheduledAt,
        calendly_event_id: calendlyEventId,
        meeting_url: meetingUrl,
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: "Demo Scheduled - MailboxHero Pro",
      html: `
        <h2>Your Demo is Confirmed!</h2>
        <p>Hi ${fullName},</p>
        <p>Your demo with MailboxHero Pro has been scheduled for ${new Date(scheduledAt).toLocaleString()}.</p>
        <p><strong>Meeting Link:</strong> ${meetingUrl || "Will be sent 15 minutes before the session"}</p>
        <p>We look forward to showing you how MailboxHero Pro can streamline your CMRA operations!</p>
      `,
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Error booking demo:", error)
    return NextResponse.json({ error: "Failed to book demo" }, { status: 500 })
  }
}
