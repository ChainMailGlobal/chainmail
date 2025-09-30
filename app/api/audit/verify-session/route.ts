import { type NextRequest, NextResponse } from "next/server"
import { generateWitnessSessionAuditReport } from "@/lib/blockchain/audit-verification"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    // Retrieve witness session data from database
    const supabase = await createClient()
    const { data: session, error } = await supabase.from("witness_sessions").select("*").eq("id", sessionId).single()

    if (error || !session) {
      return NextResponse.json({ error: "Witness session not found" }, { status: 404 })
    }

    if (!session.xrpl_tx_hash) {
      return NextResponse.json({ error: "No blockchain anchor found for this session" }, { status: 404 })
    }

    // Generate audit report
    const auditReport = await generateWitnessSessionAuditReport(sessionId, session.xrpl_tx_hash)

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        userId: session.user_id,
        agentId: session.agent_id,
        sessionType: session.session_type,
        status: session.status,
      },
      blockchain: {
        anchorHash: session.xrpl_anchor_hash,
        transactionHash: session.xrpl_tx_hash,
        ledgerSequence: session.xrpl_ledger_seq,
        timestamp: session.xrpl_anchor_timestamp,
      },
      auditReport,
    })
  } catch (error) {
    console.error("[v0] Error verifying session:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
