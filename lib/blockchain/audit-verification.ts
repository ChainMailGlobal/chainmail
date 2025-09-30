import { getEthereumAnchorService, type CMRAOnboardingRecord } from "./ethereum-anchor"
import { getXRPLedgerService } from "./xrp-ledger"
import crypto from "crypto"

/**
 * Audit and Verification Service
 *
 * This service provides tools for auditors and inspectors to verify the integrity
 * of CMRA onboarding and witness session data against blockchain anchors.
 */

export interface AuditResult {
  isValid: boolean
  message: string
  details: {
    computedHash: string
    blockchainHash: string
    timestamp: string
    blockNumber?: number
    ledgerSequence?: number
  }
}

/**
 * Verify CMRA onboarding data against Ethereum blockchain anchor
 */
export async function verifyCMRAOnboarding(record: CMRAOnboardingRecord, ethTxHash: string): Promise<AuditResult> {
  try {
    const ethService = getEthereumAnchorService()

    // Initialize wallet (read-only, no private key needed for verification)
    await ethService.initializeWallet()

    // Compute hash of provided data
    const computedHash = ethService.generateOnboardingHash(record)

    // Retrieve blockchain data
    const blockchainData = await ethService.retrieveCMRAOnboarding(ethTxHash)

    if (!blockchainData) {
      return {
        isValid: false,
        message: "Transaction not found on blockchain",
        details: {
          computedHash,
          blockchainHash: "N/A",
          timestamp: new Date().toISOString(),
        },
      }
    }

    // Compare hashes
    const isValid = computedHash === blockchainData.anchorHash

    return {
      isValid,
      message: isValid
        ? "CMRA onboarding data verified successfully"
        : "Data integrity check failed - hashes do not match",
      details: {
        computedHash,
        blockchainHash: blockchainData.anchorHash,
        timestamp: new Date(blockchainData.timestamp * 1000).toISOString(),
        blockNumber: blockchainData.blockNumber,
      },
    }
  } catch (error) {
    console.error("[v0] Error verifying CMRA onboarding:", error)
    throw error
  }
}

/**
 * Verify witness session data against XRP Ledger anchor
 */
export async function verifyWitnessSession(
  sessionData: {
    sessionId: string
    customerId: string
    witnessType: "v3a" | "v3b"
    documentUrl: string
    videoUrl: string
    facesData: any
    timestamp: string
  },
  xrplTxHash: string,
): Promise<AuditResult> {
  try {
    const xrpService = getXRPLedgerService()

    // Compute hash of provided data
    const artifactData = JSON.stringify({
      sessionId: sessionData.sessionId,
      customerId: sessionData.customerId,
      witnessType: sessionData.witnessType,
      documentUrl: sessionData.documentUrl,
      videoUrl: sessionData.videoUrl,
      facesData: sessionData.facesData,
      timestamp: sessionData.timestamp,
    })
    const computedHash = crypto.createHash("sha256").update(artifactData).digest("hex")

    // Retrieve blockchain data
    const blockchainData = await xrpService.retrieveWitnessSession(xrplTxHash)

    if (!blockchainData) {
      return {
        isValid: false,
        message: "Transaction not found on XRP Ledger",
        details: {
          computedHash,
          blockchainHash: "N/A",
          timestamp: new Date().toISOString(),
        },
      }
    }

    // Compare hashes
    const isValid = computedHash === blockchainData.documentHash

    return {
      isValid,
      message: isValid
        ? "Witness session data verified successfully"
        : "Data integrity check failed - hashes do not match",
      details: {
        computedHash,
        blockchainHash: blockchainData.documentHash,
        timestamp: blockchainData.timestamp,
      },
    }
  } catch (error) {
    console.error("[v0] Error verifying witness session:", error)
    throw error
  }
}

/**
 * Generate audit report for CMRA agent
 */
export async function generateCMRAAuditReport(agentId: string, ethTxHash: string) {
  return {
    agentId,
    auditType: "CMRA_ONBOARDING",
    blockchainNetwork: "Ethereum/Polygon",
    transactionHash: ethTxHash,
    explorerUrl: `https://polygonscan.com/tx/${ethTxHash}`,
    verificationInstructions: [
      "1. Retrieve CMRA agent data from database",
      "2. Recompute SHA-256 hash of onboarding data",
      "3. Compare with eth_anchor_hash in database",
      "4. Verify transaction on blockchain explorer",
      "5. Confirm block number and timestamp",
    ],
    auditTimestamp: new Date().toISOString(),
  }
}

/**
 * Generate audit report for witness session
 */
export async function generateWitnessSessionAuditReport(sessionId: string, xrplTxHash: string) {
  return {
    sessionId,
    auditType: "WITNESS_SESSION",
    blockchainNetwork: "XRP Ledger",
    transactionHash: xrplTxHash,
    explorerUrl: `https://livenet.xrpl.org/transactions/${xrplTxHash}`,
    verificationInstructions: [
      "1. Retrieve witness session data from database",
      "2. Recompute SHA-256 hash of session artifacts",
      "3. Compare with xrpl_anchor_hash in database",
      "4. Verify transaction on XRP Ledger explorer",
      "5. Confirm ledger sequence and timestamp",
    ],
    auditTimestamp: new Date().toISOString(),
  }
}
