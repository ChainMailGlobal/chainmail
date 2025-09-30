"use client"

import { Clock, FileText, Video, Shield, LinkIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  session_id: string
  event_type: string
  event_data: any
  timestamp: string
}

interface Session {
  id: string
  status: string
  created_at: string
  completed_at: string | null
  ipfs_hash: string | null
  blockchain_tx_hash: string | null
  xrpl_tx_hash: string | null
  xrpl_ledger_seq: number | null
}

interface ComplianceTimelineProps {
  events: Event[]
  sessions: Session[]
}

export function ComplianceTimeline({ events, sessions }: ComplianceTimelineProps) {
  // Combine events and sessions into a unified timeline
  const timelineItems = [
    ...events.map((event) => ({
      id: event.id,
      type: "event",
      eventType: event.event_type,
      timestamp: event.timestamp,
      data: event.event_data,
      sessionId: event.session_id,
    })),
    ...sessions.map((session) => ({
      id: session.id,
      type: "session",
      eventType: session.status === "completed" ? "session_completed" : "session_created",
      timestamp: session.completed_at || session.created_at,
      data: {
        ipfsHash: session.ipfs_hash,
        blockchainTx: session.blockchain_tx_hash,
        xrplTx: session.xrpl_tx_hash,
        xrplLedger: session.xrpl_ledger_seq,
      },
      sessionId: session.id,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "session_started":
      case "session_completed":
        return <Video className="h-4 w-4" />
      case "signature_captured":
      case "witness_confirmed":
        return <FileText className="h-4 w-4" />
      case "video_saved":
        return <Video className="h-4 w-4" />
      case "blockchain_anchored":
        return <Shield className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventTitle = (eventType: string) => {
    const titles: Record<string, string> = {
      session_created: "Session Created",
      session_started: "Session Started",
      session_completed: "Session Completed",
      signature_captured: "Signature Captured",
      witness_confirmed: "Witness Confirmed",
      video_saved: "Video Recording Saved",
      blockchain_anchored: "Blockchain Anchored",
      documents_generated: "Documents Generated",
    }
    return titles[eventType] || eventType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getEventDescription = (item: any) => {
    if (item.type === "session" && item.data.blockchainTx) {
      return "Session data anchored to blockchain for immutable audit trail"
    }
    if (item.eventType === "signature_captured") {
      return "Customer signature captured and verified"
    }
    if (item.eventType === "witness_confirmed") {
      return "Witness confirmation and signature recorded"
    }
    return "Event logged to compliance audit trail"
  }

  return (
    <Card className="dashboard-card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Compliance Timeline</h2>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          Audit Trail
        </Badge>
      </div>

      <div className="mt-6 space-y-4">
        {timelineItems.length > 0 ? (
          timelineItems.slice(0, 10).map((item, index) => (
            <div key={item.id} className="relative flex gap-4 pb-4">
              {/* Timeline line */}
              {index < timelineItems.length - 1 && <div className="absolute left-5 top-10 h-full w-px bg-border" />}

              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {getEventIcon(item.eventType)}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{getEventTitle(item.eventType)}</p>
                    <p className="text-sm text-muted-foreground">{getEventDescription(item)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                </div>

                {/* Blockchain verification links */}
                {item.data?.blockchainTx && (
                  <div className="mt-2 rounded-lg border border-border bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Blockchain Verified</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Ethereum TX:</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          <code className="text-primary">{item.data.blockchainTx.slice(0, 16)}...</code>
                          <LinkIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                      {item.data.ipfsHash && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">IPFS Hash:</span>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            <code className="text-primary">{item.data.ipfsHash.slice(0, 16)}...</code>
                            <LinkIcon className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {item.data?.xrplTx && (
                  <div className="mt-2 rounded-lg border border-border bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">XRP Ledger Verified</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">TX Hash:</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          <code className="text-primary">{item.data.xrplTx.slice(0, 16)}...</code>
                          <LinkIcon className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                      {item.data.xrplLedger && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Ledger:</span>
                          <span className="font-mono text-xs text-foreground">{item.data.xrplLedger}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">No activity yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Your compliance timeline will appear here</p>
          </div>
        )}
      </div>

      {timelineItems.length > 10 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
      )}
    </Card>
  )
}
