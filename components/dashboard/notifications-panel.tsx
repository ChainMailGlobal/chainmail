"use client"

import { Bell, AlertCircle, CheckCircle2, Clock, FileText, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Session {
  id: string
  status: string
  scheduled_at: string | null
  completed_at: string | null
  form_1583_url: string | null
  witness_certificate_url: string | null
}

interface NotificationsPanelProps {
  sessions: Session[]
}

export function NotificationsPanel({ sessions }: NotificationsPanelProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  // Generate notifications based on session status
  const notifications = []

  // Check for scheduled sessions coming up soon
  const upcomingSessions = sessions.filter((s) => {
    if (s.status !== "scheduled" || !s.scheduled_at) return false
    const scheduledDate = new Date(s.scheduled_at)
    const now = new Date()
    const hoursDiff = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursDiff > 0 && hoursDiff < 24
  })

  upcomingSessions.forEach((session) => {
    const scheduledDate = new Date(session.scheduled_at!)
    const hoursUntil = Math.round((scheduledDate.getTime() - new Date().getTime()) / (1000 * 60 * 60))
    notifications.push({
      id: `upcoming-${session.id}`,
      type: "info",
      icon: Calendar,
      title: "Upcoming Witness Session",
      message: `Your session is scheduled in ${hoursUntil} hours`,
      action: "View Details",
      actionHref: `/dashboard/sessions/${session.id}`,
      priority: "high",
    })
  })

  // Check for missing documents
  const incompleteSessions = sessions.filter(
    (s) => s.status === "completed" && (!s.form_1583_url || !s.witness_certificate_url),
  )

  if (incompleteSessions.length > 0) {
    notifications.push({
      id: "missing-docs",
      type: "warning",
      icon: FileText,
      title: "Missing Documents",
      message: `${incompleteSessions.length} session(s) need document generation`,
      action: "Resolve Now",
      actionHref: "/dashboard/documents",
      priority: "high",
    })
  }

  // Check for sessions in progress
  const inProgressSessions = sessions.filter((s) => s.status === "in_progress")

  inProgressSessions.forEach((session) => {
    notifications.push({
      id: `in-progress-${session.id}`,
      type: "info",
      icon: Clock,
      title: "Session In Progress",
      message: "Your witness session is currently active",
      action: "Join Session",
      actionHref: `/v3b/${session.id}`,
      priority: "high",
    })
  })

  // Check for recently completed sessions
  const recentlyCompleted = sessions.filter((s) => {
    if (s.status !== "completed" || !s.completed_at) return false
    const completedDate = new Date(s.completed_at)
    const now = new Date()
    const hoursSince = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60)
    return hoursSince < 24
  })

  recentlyCompleted.forEach((session) => {
    notifications.push({
      id: `completed-${session.id}`,
      type: "success",
      icon: CheckCircle2,
      title: "Session Completed",
      message: "Your witness session was successfully completed",
      action: "Download Documents",
      actionHref: `/dashboard/sessions/${session.id}`,
      priority: "medium",
    })
  })

  // Add quarterly certification reminder if user has completed sessions
  const hasCompletedSessions = sessions.some((s) => s.status === "completed")
  if (hasCompletedSessions) {
    notifications.push({
      id: "quarterly-cert",
      type: "info",
      icon: AlertCircle,
      title: "Quarterly Certification Due",
      message: "Your next quarterly certification is due in 45 days",
      action: "Schedule Now",
      actionHref: "/schedule-demo",
      priority: "low",
    })
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  notifications.sort(
    (a, b) =>
      priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder],
  )

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/20 bg-emerald-500/5"
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/5"
      case "error":
        return "border-red-500/20 bg-red-500/5"
      default:
        return "border-blue-500/20 bg-blue-500/5"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-emerald-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <>
      <Card className="dashboard-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Notifications & Actions</h2>
          {notifications.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Bell className="h-3 w-3" />
              {notifications.length}
            </Badge>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className={`rounded-lg border p-4 ${getNotificationStyle(notification.type)}`}>
                <div className="flex items-start gap-3">
                  <notification.icon className={`h-5 w-5 shrink-0 ${getIconColor(notification.type)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                    {notification.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 bg-transparent"
                        onClick={() => window.open(notification.actionHref, "_blank")}
                      >
                        {notification.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">No notifications</p>
              <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </div>

        {notifications.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">
              View All Notifications
            </Button>
          </div>
        )}
      </Card>
    </>
  )
}
