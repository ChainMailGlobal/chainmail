"use client"

import { useState } from "react"
import { Shield, ExternalLink, Copy, Check, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BlockchainVerificationModalProps {
  sessionId: string
  ethTxHash?: string | null
  ethBlock?: number | null
  ethTimestamp?: string | null
  xrplTxHash?: string | null
  xrplLedger?: number | null
  xrplTimestamp?: string | null
  ipfsHash?: string | null
}

export function BlockchainVerificationModal({
  sessionId,
  ethTxHash,
  ethBlock,
  ethTimestamp,
  xrplTxHash,
  xrplLedger,
  xrplTimestamp,
  ipfsHash,
}: BlockchainVerificationModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formatTimestamp = (timestamp: string | null | undefined) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const hasBlockchainData = ethTxHash || xrplTxHash || ipfsHash

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Shield className="h-4 w-4" />
          Verify on Chain
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Blockchain Verification
          </DialogTitle>
          <DialogDescription>
            Cryptographic proof of your compliance session anchored to immutable blockchain ledgers
          </DialogDescription>
        </DialogHeader>

        {hasBlockchainData ? (
          <div className="space-y-6">
            {/* Ethereum Anchor */}
            {ethTxHash && (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Ethereum Mainnet</h3>
                  <Badge variant="outline" className="status-badge-compliant">
                    Verified
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-2 py-1 text-xs text-foreground">{ethTxHash}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(ethTxHash, "ethTx")}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === "ethTx" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://etherscan.io/tx/${ethTxHash}`, "_blank")}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {ethBlock && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Block Number</p>
                        <p className="mt-1 font-mono text-sm text-foreground">{ethBlock.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp</p>
                        <p className="mt-1 text-sm text-foreground">{formatTimestamp(ethTimestamp)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* XRP Ledger Anchor */}
            {xrplTxHash && (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">XRP Ledger</h3>
                  <Badge variant="outline" className="status-badge-compliant">
                    Verified
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-2 py-1 text-xs text-foreground">{xrplTxHash}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(xrplTxHash, "xrplTx")}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === "xrplTx" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://livenet.xrpl.org/transactions/${xrplTxHash}`, "_blank")}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {xrplLedger && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ledger Index</p>
                        <p className="mt-1 font-mono text-sm text-foreground">{xrplLedger.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp</p>
                        <p className="mt-1 text-sm text-foreground">{formatTimestamp(xrplTimestamp)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IPFS Hash */}
            {ipfsHash && (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">IPFS Storage</h3>
                  <Badge variant="outline" className="status-badge-compliant">
                    Stored
                  </Badge>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Content Hash</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-2 py-1 text-xs text-foreground">{ipfsHash}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(ipfsHash, "ipfs")}
                      className="h-8 w-8 p-0"
                    >
                      {copiedField === "ipfs" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank")}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Info */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm text-foreground">
                  <p className="font-medium">What does this mean?</p>
                  <p className="mt-1 text-muted-foreground">
                    Your session data has been cryptographically hashed and anchored to public blockchain ledgers. This
                    creates an immutable, tamper-proof audit trail that can be independently verified by anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">No blockchain data available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Blockchain anchoring will be available after session completion
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
