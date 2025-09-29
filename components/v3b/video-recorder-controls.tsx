"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Square, Pause, Play, RotateCcw } from "lucide-react"

interface VideoRecorderControlsProps {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  onStart: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  disabled?: boolean
}

export function VideoRecorderControls({
  isRecording,
  isPaused,
  recordingTime,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
  disabled = false,
}: VideoRecorderControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
      <div className="flex items-center gap-3">
        {isRecording && (
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            Recording
          </Badge>
        )}
        {isPaused && <Badge variant="secondary">Paused</Badge>}
        <span className="text-sm font-mono text-slate-600">{formatTime(recordingTime)}</span>
      </div>

      <div className="flex items-center gap-2">
        {!isRecording && (
          <Button onClick={onStart} disabled={disabled} className="bg-red-600 hover:bg-red-700 text-white">
            <Video className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && !isPaused && (
          <>
            <Button onClick={onPause} variant="outline" disabled={disabled}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button onClick={onStop} variant="destructive" disabled={disabled}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <Button onClick={onResume} className="bg-green-600 hover:bg-green-700 text-white" disabled={disabled}>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
            <Button onClick={onStop} variant="destructive" disabled={disabled}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {!isRecording && recordingTime > 0 && (
          <Button onClick={onReset} variant="outline" disabled={disabled}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
