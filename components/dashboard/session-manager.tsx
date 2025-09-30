"use client"

import { Video, Calendar, Clock, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Session {
  id: string
  status: string
  scheduled_at: string | null
  confidence_score: number | null
  liveness_score: number | null
  video_recording_url: string | null
  cmra_agent?: {
    full_name: string
    cmra_name: string
  }
}

interface SessionManagerProps {
  sessions: Session[]
}

export function SessionManager({ sessions }: SessionManagerProps) {
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled" || s.status === "in_progress")
  const nextSession = upcomingSessions[0]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="dashboard-card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Witness Sessions</h2>
        <Link href="/demo-v31">
          <Button size="sm">Schedule New</Button>
        </Link>
      </div>

      {nextSession ? (
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Session</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{formatDate(nextSession.scheduled_at)}</p>
              {nextSession.cmra_agent && (
                <p className="mt-1 text-sm text-muted-foreground">
                  with {nextSession.cmra_agent.full_name} ({nextSession.cmra_agent.cmra_name})
                </p>
              )}
            </div>
            <Badge className={getStatusColor(nextSession.status)}>{nextSession.status}</Badge>
          </div>

          <div className="mt-4 flex gap-2">
            {nextSession.status === "in_progress" && (
              <Link href={`/v3b/${nextSession.id}`}>
                <Button size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  Join Session
                </Button>
              </Link>
            )}
            {nextSession.status === "scheduled" && (
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Reschedule
              </Button>
            )}
          </div>

          {nextSession.confidence_score !== null && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Confidence Score</span>
                <span className="font-medium text-foreground">{nextSession.confidence_score}%</span>
              </div>
              {nextSession.liveness_score !== null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Liveness Score</span>
                  <span className="font-medium text-foreground">{nextSession.liveness_score}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">No upcoming sessions</p>
          <p className="mt-1 text-sm text-muted-foreground">Schedule your first witness session to get started</p>
          <Link href="/demo-v31">
            <Button size="sm" className="mt-4">
              Schedule Session
            </Button>
          </Link>
        </div>
      )}

      {upcomingSessions.length > 1 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Other Upcoming Sessions</p>
          {upcomingSessions.slice(1, 3).map((session) => (
            <div key={session.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{formatDate(session.scheduled_at)}</p>
                {session.cmra_agent && <p className="text-xs text-muted-foreground">{session.cmra_agent.full_name}</p>}
              </div>
              <Link href={`/dashboard/sessions/${session.id}`}>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
