"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export interface VideoRecorderState {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  videoBlob: Blob | null
  error: string | null
}

export function useVideoRecorder() {
  const [state, setState] = useState<VideoRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    videoBlob: null,
    error: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      })

      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        setState((prev) => ({ ...prev, videoBlob: blob, isRecording: false }))

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorder.start(1000) // Collect data every second

      // Start timer
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, recordingTime: prev.recordingTime + 1 }))
      }, 1000)

      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
      }))

      console.log("[v0] Video recording started")
    } catch (error) {
      console.error("[v0] Error starting video recording:", error)
      setState((prev) => ({
        ...prev,
        error: "Failed to access camera/microphone",
      }))
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      console.log("[v0] Video recording stopped")
    }
  }, [state.isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause()

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setState((prev) => ({ ...prev, isPaused: true }))
      console.log("[v0] Video recording paused")
    }
  }, [state.isRecording, state.isPaused])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume()

      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, recordingTime: prev.recordingTime + 1 }))
      }, 1000)

      setState((prev) => ({ ...prev, isPaused: false }))
      console.log("[v0] Video recording resumed")
    }
  }, [state.isRecording, state.isPaused])

  const resetRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      videoBlob: null,
      error: null,
    })

    chunksRef.current = []
    console.log("[v0] Video recording reset")
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    stream: streamRef.current,
  }
}
