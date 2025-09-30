import { type NextRequest, NextResponse } from "next/server"
import { getXRPLedgerService } from "@/lib/blockchain/xrp-ledger"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, customerId, witnessType, documentUrl, videoUrl, facesData, ipfsHash } = body

    if (!sessionId || !customerId || !witnessType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const artifactData = JSON.stringify({
      sessionId,
      customerId,
      witnessType,
      documentUrl,
      videoUrl,
      facesData,
      timestamp: new Date().toISOString(),
    })
    const anchorHash = crypto.createHash("sha256").update(artifactData).digest("hex")

    // Initialize XRP Ledger service
    const xrpService = getXRPLedgerService()

    // Initialize wallet (in production, use a secure seed from env)
    const walletSeed = process.env.XRPL_WALLET_SEED
    await xrpService.initializeWallet(walletSeed)

    const { txHash, ledgerSequence } = await xrpService.recordWitnessSession({
      sessionId,
      customerId,
      witnessType,
      documentHash: anchorHash,
      videoHash: videoUrl ? crypto.createHash("sha256").update(videoUrl).digest("hex") : "",
      timestamp: new Date().toISOString(),
      ipfsHash,
    })

    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from("witness_sessions")
      .update({
        xrpl_anchor_hash: anchorHash,
        xrpl_tx_hash: txHash,
        xrpl_ledger_seq: ledgerSequence,
        xrpl_anchor_timestamp: new Date().toISOString(),
      })
      .eq("id", sessionId)

    if (updateError) {
      console.error("[v0] Error updating session with XRP Ledger anchor:", updateError)
    }

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      ledgerSequence,
      anchorHash,
      message: "Witness session irrefutably linked to XRP Ledger for audit",
    })
  } catch (error) {
    console.error("[v0] Error recording to XRP Ledger:", error)
    return NextResponse.json({ error: "Failed to record on XRP Ledger" }, { status: 500 })
  }
}
