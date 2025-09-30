"use client"

import { ArrowLeft, Download, Video, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlockchainVerificationModal } from "./blockchain-verification-modal"

interface SessionDetailPageProps {
  session: {
    id: string
    status: string
    scheduled_at: string | null
    started_at: string | null
    completed_at: string | null
    confidence_score: number | null
    liveness_score: number | null
    video_recording_url: string | null
    form_1583_url: string | null
    witness_certificate_url: string | null
    customer_id_document_url: string | null
    ipfs_hash: string | null
    blockchain_tx_hash: string | null
    xrpl_tx_hash: string | null
    xrpl_ledger_seq: number | null
    cmra_agent?: {
      full_name: string
      cmra_name: string
      email: string
    }
  }
}

export function SessionDetailPage({ session }: SessionDetailPageProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "status-badge-compliant"
      case "in_progress":
        return "status-badge-in-progress"
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session Details</h1>
            <p className="text-muted-foreground">Session ID: {session.id.slice(0, 8)}</p>
          </div>
        </div>
        <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="dashboard-card lg:col-span-2">
          <h2 className="text-xl font-semibold text-foreground">Session Information</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="mt-1 font-medium text-foreground">{formatDate(session.scheduled_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Started</p>
              <p className="mt-1 font-medium text-foreground">{formatDate(session.started_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="mt-1 font-medium text-foreground">{formatDate(session.completed_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="mt-1 font-medium text-foreground">{session.status}</p>
            </div>
          </div>

          {session.cmra_agent && (
            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">CMRA Agent</p>
              <p className="mt-1 text-foreground">{session.cmra_agent.full_name}</p>
              <p className="text-sm text-muted-foreground">{session.cmra_agent.cmra_name}</p>
              <p className="text-sm text-muted-foreground">{session.cmra_agent.email}</p>
            </div>
          )}

          {(session.confidence_score !== null || session.liveness_score !== null) && (
            <div className="mt-6">
              <h3 className="font-semibold text-foreground">AI Verification Scores</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {session.confidence_score !== null && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{session.confidence_score}%</p>
                  </div>
                )}
                {session.liveness_score !== null && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Liveness Score</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{session.liveness_score}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="dashboard-card">
          <h2 className="text-xl font-semibold text-foreground">Blockchain Verification</h2>

          <div className="mt-6 space-y-4">
            <BlockchainVerificationModal
              sessionId={session.id}
              ethTxHash={session.blockchain_tx_hash}
              xrplTxHash={session.xrpl_tx_hash}
              xrplLedger={session.xrpl_ledger_seq}
              ipfsHash={session.ipfs_hash}
            />

            {session.blockchain_tx_hash && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Ethereum Verified</span>
                </div>
              </div>
            )}

            {session.xrpl_tx_hash && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">XRP Ledger Verified</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="dashboard-card">
        <h2 className="text-xl font-semibold text-foreground">Documents & Media</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {session.form_1583_url && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Form 1583</span>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {session.witness_certificate_url && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Witness Certificate</span>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {session.customer_id_document_url && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">ID Document</span>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}

          {session.video_recording_url && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Session Recording</span>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
