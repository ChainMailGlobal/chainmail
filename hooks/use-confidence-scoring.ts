"use client"

import { useState, useEffect, useCallback } from "react"

export interface ConfidenceScore {
  overall: number
  liveness: number
  timestamp: number
}

export function useConfidenceScoring(sessionId: string, isActive: boolean) {
  const [score, setScore] = useState<ConfidenceScore>({
    overall: 0,
    liveness: 0,
    timestamp: Date.now(),
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Simulate real-time scoring updates
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setScore((prev) => {
        // Gradually increase score over time (simulating AI learning)
        const newOverall = Math.min(95, prev.overall + Math.random() * 3)
        const newLiveness = Math.min(95, prev.liveness + Math.random() * 2)

        return {
          overall: Math.round(newOverall),
          liveness: Math.round(newLiveness),
          timestamp: Date.now(),
        }
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isActive])

  const analyzeFrame = useCallback(
    async (frameData: string) => {
      if (!isActive) return

      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/v3b/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            analysisType: "video_frame",
            data: { frameData, previousScore: score.overall },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setScore((prev) => ({
            ...prev,
            overall: data.result.score,
            timestamp: Date.now(),
          }))
        }
      } catch (error) {
        console.error("[v0] Error analyzing frame:", error)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [sessionId, isActive, score.overall],
  )

  const analyzeFullSession = useCallback(
    async (sessionData: {
      videoFrame?: string
      transcript?: string
      documentImage?: string
      customerName: string
      duration: number
      verbalAcknowledgment: string
    }) => {
      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/v3b/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            analysisType: "full_session",
            data: sessionData,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return data.result
        }
      } catch (error) {
        console.error("[v0] Error analyzing session:", error)
      } finally {
        setIsAnalyzing(false)
      }
    },
    [sessionId],
  )

  return {
    score,
    isAnalyzing,
    analyzeFrame,
    analyzeFullSession,
  }
}
