"use client"

import { CheckCircle2, Circle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SessionProgressProps {
  session: {
    id: string
    status: string
    started_at: string | null
    completed_at: string | null
    customer_signature_url: string | null
    witness_signature_url: string | null
    customer_id_document_url: string | null
    video_recording_url: string | null
    form_1583_url: string | null
    witness_certificate_url: string | null
  }
}

export function SessionProgress({ session }: SessionProgressProps) {
  const steps = [
    {
      id: "scheduled",
      label: "Session Scheduled",
      completed: true,
    },
    {
      id: "started",
      label: "Session Started",
      completed: !!session.started_at,
    },
    {
      id: "id_verified",
      label: "ID Verified",
      completed: !!session.customer_id_document_url,
    },
    {
      id: "signatures",
      label: "Signatures Captured",
      completed: !!session.customer_signature_url && !!session.witness_signature_url,
    },
    {
      id: "video_recorded",
      label: "Video Recorded",
      completed: !!session.video_recording_url,
    },
    {
      id: "documents_generated",
      label: "Documents Generated",
      completed: !!session.form_1583_url && !!session.witness_certificate_url,
    },
    {
      id: "completed",
      label: "Session Completed",
      completed: session.status === "completed",
    },
  ]

  const completedSteps = steps.filter((s) => s.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <Card className="dashboard-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Session Progress</h3>
        <span className="text-sm text-muted-foreground">
          {completedSteps} of {steps.length} steps
        </span>
      </div>

      <div className="mt-4">
        <Progress value={progressPercentage} className="h-2" />
        <p className="mt-2 text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</p>
      </div>

      <div className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            {step.completed ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            ) : index === completedSteps ? (
              <Clock className="h-5 w-5 shrink-0 text-blue-500" />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <span className={`text-sm ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
