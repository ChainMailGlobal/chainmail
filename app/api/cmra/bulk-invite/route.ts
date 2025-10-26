import { type NextRequest, NextResponse } from "next/server"
import { sendEmailFromAPI } from "@/lib/email/resend-client"
import { getCustomerInviteEmail } from "@/lib/email/templates"

export async function POST(request: NextRequest) {
  try {
    const { cmraLocationId, cmraName, customers } = await request.json()

    if (!cmraLocationId || !cmraName || !customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log(`[v0] Sending bulk invites for ${customers.length} customers from ${cmraName}`)

    let successCount = 0
    let failedCount = 0

    // Send invites to all customers
    for (const customer of customers) {
      try {
        // Generate unique invite link (expires in 30 days)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://mailboxhero.pro"}/signup?cmra=${cmraLocationId}&email=${encodeURIComponent(customer.email)}`

        const template = getCustomerInviteEmail({
          customerName: `${customer.firstName} ${customer.lastName}`,
          cmraName,
          inviteLink,
          expiresAt: expiresAt.toISOString(),
        })

        await sendEmailFromAPI({
          to: customer.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        })

        successCount++
        console.log(`[v0] Invite sent to ${customer.email}`)
      } catch (error) {
        console.error(`[v0] Failed to send invite to ${customer.email}:`, error)
        failedCount++
      }
    }

    console.log(`[v0] Bulk invite complete: ${successCount} sent, ${failedCount} failed`)

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      total: customers.length,
    })
  } catch (error) {
    console.error("[v0] Error in bulk invite:", error)
    return NextResponse.json({ error: "Failed to process bulk invites" }, { status: 500 })
  }
}
