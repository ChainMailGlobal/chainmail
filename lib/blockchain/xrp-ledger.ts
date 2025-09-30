import { Client, Wallet, xrpToDrops } from "xrpl"

export interface WitnessSessionRecord {
  sessionId: string
  customerId: string
  witnessType: "v3a" | "v3b"
  documentHash: string
  videoHash: string
  timestamp: string
  ipfsHash?: string
}

export class XRPLedgerService {
  private client: Client
  private wallet: Wallet | null = null

  constructor() {
    // Use testnet for development, mainnet for production
    const network = process.env.XRPL_NETWORK || "wss://s.altnet.rippletest.net:51233"
    this.client = new Client(network)
  }

  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect()
    }
  }

  async disconnect() {
    if (this.client.isConnected()) {
      await this.client.disconnect()
    }
  }

  async initializeWallet(seed?: string) {
    if (seed) {
      this.wallet = Wallet.fromSeed(seed)
    } else {
      // For testnet, fund a new wallet
      const fundResult = await this.client.fundWallet()
      this.wallet = fundResult.wallet
      console.log("[v0] Created new wallet:", this.wallet.address)
    }
    return this.wallet
  }

  async recordWitnessSession(record: WitnessSessionRecord): Promise<{
    txHash: string
    ledgerSequence: number
  }> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized")
    }

    await this.connect()

    try {
      // Create memo with session data
      const memoData = JSON.stringify({
        type: "WITNESS_SESSION",
        sessionId: record.sessionId,
        customerId: record.customerId,
        witnessType: record.witnessType,
        documentHash: record.documentHash,
        videoHash: record.videoHash,
        timestamp: record.timestamp,
        ipfsHash: record.ipfsHash,
      })

      // Convert memo to hex
      const memoHex = Buffer.from(memoData).toString("hex")

      // Prepare transaction
      const prepared = await this.client.autofill({
        TransactionType: "Payment",
        Account: this.wallet.address,
        Destination: this.wallet.address, // Send to self for record-keeping
        Amount: xrpToDrops(0.000001), // Minimal amount
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from("WITNESS_AUDIT").toString("hex"),
              MemoData: memoHex,
            },
          },
        ],
      })

      // Sign transaction
      const signed = this.wallet.sign(prepared)

      // Submit transaction
      const result = await this.client.submitAndWait(signed.tx_blob)

      console.log("[v0] XRP Ledger transaction recorded:", result.result.hash)

      return {
        txHash: result.result.hash as string,
        ledgerSequence: (result.result as any).ledger_index || 0,
      }
    } catch (error) {
      console.error("[v0] Error recording to XRP Ledger:", error)
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async retrieveWitnessSession(txHash: string): Promise<WitnessSessionRecord | null> {
    await this.connect()

    try {
      const response = await this.client.request({
        command: "tx",
        transaction: txHash,
      })

      if (response.result.Memos && response.result.Memos.length > 0) {
        const memoData = response.result.Memos[0].Memo.MemoData
        if (memoData) {
          const decodedData = Buffer.from(memoData, "hex").toString("utf-8")
          const record = JSON.parse(decodedData)
          return record
        }
      }

      return null
    } catch (error) {
      console.error("[v0] Error retrieving from XRP Ledger:", error)
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async getTransactionHistory(address: string): Promise<any[]> {
    await this.connect()

    try {
      const response = await this.client.request({
        command: "account_tx",
        account: address,
        limit: 100,
      })

      return response.result.transactions || []
    } catch (error) {
      console.error("[v0] Error getting transaction history:", error)
      throw error
    } finally {
      await this.disconnect()
    }
  }
}

// Singleton instance
let xrpService: XRPLedgerService | null = null

export function getXRPLedgerService(): XRPLedgerService {
  if (!xrpService) {
    xrpService = new XRPLedgerService()
  }
  return xrpService
}
