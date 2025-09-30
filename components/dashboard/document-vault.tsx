"use client"

import { FileText, Download, Eye, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Session {
  id: string
  status: string
  form_1583_url: string | null
  witness_certificate_url: string | null
  customer_id_document_url: string | null
  video_recording_url: string | null
  completed_at: string | null
}

interface DocumentVaultProps {
  sessions: Session[]
}

export function DocumentVault({ sessions }: DocumentVaultProps) {
  const completedSessions = sessions.filter((s) => s.status === "completed")

  const documents = completedSessions.flatMap((session) => {
    const docs = []
    if (session.form_1583_url) {
      docs.push({
        id: `${session.id}-form1583`,
        name: "Form 1583",
        type: "PDF",
        sessionId: session.id,
        url: session.form_1583_url,
        date: session.completed_at,
        status: "valid",
      })
    }
    if (session.witness_certificate_url) {
      docs.push({
        id: `${session.id}-cert`,
        name: "Witness Certificate",
        type: "PDF",
        sessionId: session.id,
        url: session.witness_certificate_url,
        date: session.completed_at,
        status: "valid",
      })
    }
    if (session.customer_id_document_url) {
      docs.push({
        id: `${session.id}-id`,
        name: "ID Document",
        type: "Image",
        sessionId: session.id,
        url: session.customer_id_document_url,
        date: session.completed_at,
        status: "valid",
      })
    }
    if (session.video_recording_url) {
      docs.push({
        id: `${session.id}-video`,
        name: "Session Recording",
        type: "Video",
        sessionId: session.id,
        url: session.video_recording_url,
        date: session.completed_at,
        status: "valid",
      })
    }
    return docs
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="dashboard-card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Document Vault</h2>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      {documents.length > 0 ? (
        <div className="mt-6 space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {formatDate(doc.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="status-badge-compliant">
                  {doc.status}
                </Badge>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">No documents yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete a witness session to generate your compliance documents
          </p>
        </div>
      )}
    </Card>
  )
}
