"use client"

import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface WelcomePanelProps {
  user: {
    fullName: string
  }
  stats: {
    totalSessions: number
    completedSessions: number
    inProgressSessions: number
    scheduledSessions: number
    complianceStatus: string
  }
}

export function WelcomePanel({ user, stats }: WelcomePanelProps) {
  const onboardingSteps = [
    { name: "Info Entered", completed: true },
    { name: "ID Uploaded", completed: stats.totalSessions > 0 },
    { name: "Witness Scheduled", completed: stats.scheduledSessions > 0 || stats.completedSessions > 0 },
    { name: "Compliance Complete", completed: stats.completedSessions > 0 },
  ]

  const completedSteps = onboardingSteps.filter((s) => s.completed).length
  const progress = (completedSteps / onboardingSteps.length) * 100

  const getStatusBadge = () => {
    switch (stats.complianceStatus) {
      case "compliant":
        return (
          <Badge className="status-badge-compliant gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="status-badge-in-progress gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        )
      default:
        return (
          <Badge className="status-badge-flagged gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card className="dashboard-card">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.fullName}</h1>
          <p className="mt-1 text-muted-foreground">Track your compliance status and manage your witness sessions</p>
        </div>
        <div className="flex items-center gap-3">{getStatusBadge()}</div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Onboarding Progress</span>
          <span className="text-muted-foreground">
            {completedSteps} of {onboardingSteps.length} steps
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {onboardingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-lg border p-3 ${
                step.completed ? "border-primary/20 bg-primary/5" : "border-border bg-muted/50"
              }`}
            >
              {step.completed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
              )}
              <span className={`text-sm ${step.completed ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Sessions</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalSessions}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{stats.completedSessions}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-blue-500">{stats.inProgressSessions}</p>
        </div>
      </div>
    </Card>
  )
}
