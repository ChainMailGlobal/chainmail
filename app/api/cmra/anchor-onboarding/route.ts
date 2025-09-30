import { type NextRequest, NextResponse } from "next/server"
import { getEthereumAnchorService } from "@/lib/blockchain/ethereum-anchor"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, email, fullName, cmraName, cmraLicense, photoIdData, addressIdData, form1583aUrl, role } = body

    if (!agentId || !email || !fullName || !cmraName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Ethereum service
    const ethService = getEthereumAnchorService()

    // Initialize wallet (in production, use a secure private key from env)
    const privateKey = process.env.ETHEREUM_PRIVATE_KEY
    await ethService.initializeWallet(privateKey)

    // Record on Ethereum blockchain
    const { txHash, blockNumber, anchorHash } = await ethService.recordCMRAOnboarding({
      agentId,
      email,
      fullName,
      cmraName,
      cmraLicense,
      photoIdData,
      addressIdData,
      form1583aUrl,
      role,
      timestamp: new Date().toISOString(),
    })

    // Update database with Ethereum anchor
    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from("cmra_agents")
      .update({
        eth_anchor_hash: anchorHash,
        eth_anchor_tx_hash: txHash,
        eth_anchor_block: blockNumber,
        eth_anchor_timestamp: new Date().toISOString(),
      })
      .eq("id", agentId)

    if (updateError) {
      console.error("[v0] Error updating agent with Ethereum anchor:", updateError)
    }

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      blockNumber,
      anchorHash,
      message: "CMRA onboarding cryptographically notarized on Ethereum",
    })
  } catch (error) {
    console.error("[v0] Error anchoring to Ethereum:", error)
    return NextResponse.json({ error: "Failed to anchor on Ethereum" }, { status: 500 })
  }
}
