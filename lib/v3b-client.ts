// Client-side utilities for V3b witness flow

export interface WitnessSession {
  id: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  scheduledAt: string
  startedAt?: string
  completedAt?: string
  videoRoomId?: string
  confidenceScore?: number
  livenessScore?: number
  cmraAgent?: {
    id: string
    fullName: string
    cmraName: string
  }
}

export async function fetchSession(sessionId: string): Promise<WitnessSession> {
  const response = await fetch(`/api/v3b/sessions/${sessionId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch session")
  }
  const data = await response.json()
  return data.session
}

export async function createSession(scheduledAt: string, cmraAgentId: string): Promise<WitnessSession> {
  const response = await fetch("/api/v3b/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheduledAt, cmraAgentId }),
  })
  if (!response.ok) {
    throw new Error("Failed to create session")
  }
  const data = await response.json()
  return data.session
}

export async function updateSession(sessionId: string, updates: Partial<WitnessSession>) {
  const response = await fetch(`/api/v3b/sessions/${sessionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    throw new Error("Failed to update session")
  }
  return response.json()
}

export async function logSessionEvent(sessionId: string, eventType: string, eventData?: Record<string, any>) {
  const response = await fetch("/api/v3b/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, eventType, eventData }),
  })
  if (!response.ok) {
    console.error("Failed to log session event")
  }
}

export async function fetchAvailability(date: string) {
  const response = await fetch(`/api/v3b/availability?date=${date}`)
  if (!response.ok) {
    throw new Error("Failed to fetch availability")
  }
  return response.json()
}
