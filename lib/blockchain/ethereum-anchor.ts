import { ethers } from "ethers"
import crypto from "crypto"

export interface CMRAOnboardingRecord {
  agentId: string
  email: string
  fullName: string
  cmraName: string
  cmraLicense: string
  photoIdData: any
  addressIdData: any
  form1583aUrl: string
  role: string
  timestamp: string
}

export class EthereumAnchorService {
  private provider: ethers.JsonRpcProvider | null = null
  private wallet: ethers.Wallet | null = null
  private useMock: boolean

  constructor() {
    // Use mock mode by default unless ETHEREUM_USE_REAL is set to "true"
    this.useMock = process.env.ETHEREUM_USE_REAL !== "true"

    if (!this.useMock) {
      // Use Polygon mainnet for production (low gas fees)
      // Use Mumbai testnet for development
      const rpcUrl = process.env.ETHEREUM_RPC_URL || "https://rpc-mumbai.maticvigil.com"
      this.provider = new ethers.JsonRpcProvider(rpcUrl)
    }
  }

  async initializeWallet(privateKey?: string) {
    if (this.useMock) {
      console.log("[v0] Using mock Ethereum mode - no real blockchain transactions")
      return null
    }

    if (!this.provider) {
      throw new Error("Provider not initialized")
    }

    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey, this.provider)
    } else {
      // Generate new wallet for testing
      this.wallet = ethers.Wallet.createRandom().connect(this.provider)
      console.log("[v0] Created new Ethereum wallet:", this.wallet.address)
    }

    return this.wallet
  }

  /**
   * Generate SHA-256 hash of CMRA onboarding data
   */
  generateOnboardingHash(record: CMRAOnboardingRecord): string {
    const dataString = JSON.stringify({
      agentId: record.agentId,
      email: record.email,
      fullName: record.fullName,
      cmraName: record.cmraName,
      cmraLicense: record.cmraLicense,
      photoIdData: record.photoIdData,
      addressIdData: record.addressIdData,
      form1583aUrl: record.form1583aUrl,
      role: record.role,
      timestamp: record.timestamp,
    })

    return crypto.createHash("sha256").update(dataString).digest("hex")
  }

  private generateMockTxHash(): string {
    return "0x" + crypto.randomBytes(32).toString("hex")
  }

  private generateMockBlockNumber(): number {
    return Math.floor(Math.random() * 1000000) + 10000000
  }

  /**
   * Record CMRA onboarding anchor on Ethereum/Polygon (or mock)
   */
  async recordCMRAOnboarding(record: CMRAOnboardingRecord): Promise<{
    txHash: string
    blockNumber: number
    anchorHash: string
  }> {
    const anchorHash = this.generateOnboardingHash(record)

    if (this.useMock) {
      const mockTxHash = this.generateMockTxHash()
      const mockBlockNumber = this.generateMockBlockNumber()

      console.log("[v0] Mock Ethereum anchor created:")
      console.log("  - TX Hash:", mockTxHash)
      console.log("  - Block:", mockBlockNumber)
      console.log("  - Anchor Hash:", anchorHash)

      return {
        txHash: mockTxHash,
        blockNumber: mockBlockNumber,
        anchorHash,
      }
    }

    // Real blockchain mode
    if (!this.wallet || !this.provider) {
      throw new Error("Wallet or provider not initialized")
    }

    try {
      // Create transaction with hash in data field
      const tx = await this.wallet.sendTransaction({
        to: this.wallet.address, // Send to self for record-keeping
        value: ethers.parseEther("0"), // No value transfer
        data: ethers.hexlify(ethers.toUtf8Bytes(`CMRA_ANCHOR:${anchorHash}`)),
      })

      console.log("[v0] Ethereum transaction submitted:", tx.hash)

      // Wait for confirmation
      const receipt = await tx.wait()

      if (!receipt) {
        throw new Error("Transaction receipt not available")
      }

      console.log("[v0] Ethereum transaction confirmed in block:", receipt.blockNumber)

      return {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        anchorHash,
      }
    } catch (error) {
      console.error("[v0] Error recording to Ethereum:", error)
      throw error
    }
  }

  /**
   * Retrieve CMRA onboarding record from Ethereum (or mock)
   */
  async retrieveCMRAOnboarding(txHash: string): Promise<{
    anchorHash: string
    blockNumber: number
    timestamp: number
  } | null> {
    if (this.useMock) {
      console.log("[v0] Mock mode: Cannot retrieve real blockchain data for", txHash)
      return {
        anchorHash: "mock_hash_" + txHash.slice(-8),
        blockNumber: this.generateMockBlockNumber(),
        timestamp: Math.floor(Date.now() / 1000),
      }
    }

    if (!this.provider) {
      throw new Error("Provider not initialized")
    }

    try {
      const tx = await this.provider.getTransaction(txHash)
      if (!tx) {
        return null
      }

      const receipt = await this.provider.getTransactionReceipt(txHash)
      if (!receipt) {
        return null
      }

      const block = await this.provider.getBlock(receipt.blockNumber)
      if (!block) {
        return null
      }

      // Extract anchor hash from transaction data
      const dataString = ethers.toUtf8String(tx.data)
      const anchorHash = dataString.replace("CMRA_ANCHOR:", "")

      return {
        anchorHash,
        blockNumber: receipt.blockNumber,
        timestamp: block.timestamp,
      }
    } catch (error) {
      console.error("[v0] Error retrieving from Ethereum:", error)
      throw error
    }
  }

  /**
   * Verify onboarding data against blockchain anchor
   */
  async verifyOnboarding(record: CMRAOnboardingRecord, txHash: string): Promise<boolean> {
    const computedHash = this.generateOnboardingHash(record)

    if (this.useMock) {
      console.log("[v0] Mock mode: Verification simulated as successful")
      return true
    }

    const blockchainData = await this.retrieveCMRAOnboarding(txHash)

    if (!blockchainData) {
      return false
    }

    return computedHash === blockchainData.anchorHash
  }
}

// Singleton instance
let ethService: EthereumAnchorService | null = null

export function getEthereumAnchorService(): EthereumAnchorService {
  if (!ethService) {
    ethService = new EthereumAnchorService()
  }
  return ethService
}
