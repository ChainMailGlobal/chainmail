import { type NextRequest, NextResponse } from "next/server"
import { generateCMRAAuditReport } from "@/lib/blockchain/audit-verification"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId } = body

    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId" }, { status: 400 })
    }

    // Retrieve CMRA agent data from database
    const supabase = await createClient()
    const { data: agent, error } = await supabase.from("cmra_agents").select("*").eq("id", agentId).single()

    if (error || !agent) {
      return NextResponse.json({ error: "CMRA agent not found" }, { status: 404 })
    }

    if (!agent.eth_anchor_tx_hash) {
      return NextResponse.json({ error: "No blockchain anchor found for this agent" }, { status: 404 })
    }

    // Generate audit report
    const auditReport = await generateCMRAAuditReport(agentId, agent.eth_anchor_tx_hash)

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        email: agent.email,
        businessName: agent.business_name,
        licenseNumber: agent.license_number,
      },
      blockchain: {
        anchorHash: agent.eth_anchor_hash,
        transactionHash: agent.eth_anchor_tx_hash,
        blockNumber: agent.eth_anchor_block,
        timestamp: agent.eth_anchor_timestamp,
      },
      auditReport,
    })
  } catch (error) {
    console.error("[v0] Error verifying CMRA:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
