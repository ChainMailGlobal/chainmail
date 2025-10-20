"use client"
import React from "react"

type VoiceRealtimeMiniProps = {
  buttonLabel?: string
  stopLabel?: string
  voicePreset?: string
  autoStart?: boolean
  onReady?: (api: { speak: (text: string) => Promise<void>; stop: () => void; isActive: () => boolean }) => void
  onError?: (error: string) => void
}

export default function VoiceRealtimeMini({
  buttonLabel = "Start Voice",
  stopLabel = "Stop",
  voicePreset = "alloy",
  autoStart = false,
  onReady,
  onError,
}: VoiceRealtimeMiniProps) {
  const pcRef = React.useRef<RTCPeerConnection | null>(null)
  const localStreamRef = React.useRef<MediaStream | null>(null)
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const dcRef = React.useRef<RTCDataChannel | null>(null)
  const activeRef = React.useRef(false)
  const [active, setActive] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string>("Ready")
  const [isTransmitting, setIsTransmitting] = React.useState(false)

  React.useEffect(() => {
    if (autoStart && !active && !activeRef.current) {
      console.log("[v0] VoiceRealtimeMini - Auto-starting voice session")
      start()
    }
  }, [autoStart])

  async function start() {
    setError(null)
    setStatus("Initializing...")
    try {
      console.log("[v0] VoiceRealtimeMini - Starting voice session with preset:", voicePreset)
      console.log("[v0] VoiceRealtimeMini - Calling /api/voice/token endpoint")

      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
      pcRef.current = pc

      pc.onconnectionstatechange = () => {
        console.log("[v0] VoiceRealtimeMini - Connection state:", pc.connectionState)
        setStatus(`Connection: ${pc.connectionState}`)
      }

      pc.oniceconnectionstatechange = () => {
        console.log("[v0] VoiceRealtimeMini - ICE connection state:", pc.iceConnectionState)
      }

      // Remote audio sink
      const remoteStream = new MediaStream()
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream
        remoteAudioRef.current.volume = 1.0
        remoteAudioRef.current.muted = false
      }
      pc.ontrack = (e) => {
        console.log("[v0] VoiceRealtimeMini - Received remote audio track")
        e.streams[0]?.getAudioTracks().forEach(() => {})
        e.streams.forEach((s) => s.getTracks().forEach((t) => remoteStream.addTrack(t)))
        setStatus("Audio connected")
        remoteAudioRef.current?.play().catch((e) => {
          console.warn("[v0] VoiceRealtimeMini - Auto-play blocked:", e)
        })
      }

      // Mic
      setStatus("Requesting microphone...")
      console.log("[v0] VoiceRealtimeMini - Requesting microphone access...")
      const local = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = local
      console.log("[v0] VoiceRealtimeMini - Microphone access granted, tracks:", local.getTracks().length)
      for (const track of local.getTracks()) {
        pc.addTrack(track, local)
        console.log("[v0] VoiceRealtimeMini - Added local audio track:", track.label)
      }

      // Data channel for sending speak events
      const dc = pc.createDataChannel("oai-events")
      dcRef.current = dc

      dc.onopen = () => {
        console.log("[v0] VoiceRealtimeMini - Data channel opened")
        setStatus("Voice ready - speak now!")
        remoteAudioRef.current?.play().catch(() => {})
      }
      dc.onclose = () => {
        console.log("[v0] VoiceRealtimeMini - Data channel closed")
        setIsTransmitting(false)
      }
      dc.onerror = (e) => {
        console.error("[v0] VoiceRealtimeMini - Data channel error:", e)
      }
      dc.onmessage = (e) => {
        console.log("[v0] VoiceRealtimeMini - Received message from OpenAI:", e.data.substring(0, 100))
        setIsTransmitting(true)
        setTimeout(() => setIsTransmitting(false), 1000)
      }

      // Create local offer
      setStatus("Creating offer...")
      const offer = await pc.createOffer({ offerToReceiveAudio: true })
      await pc.setLocalDescription(offer)

      setStatus("Getting voice token...")
      console.log("[v0] VoiceRealtimeMini - Requesting voice token from /api/voice/token...")

      // Get ephemeral client secret for gpt-realtime-mini
      const tokenResp = await fetch("/api/voice/token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ voice: voicePreset }),
      })

      console.log("[v0] VoiceRealtimeMini - Token response status:", tokenResp.status)
      console.log("[v0] VoiceRealtimeMini - Token response content-type:", tokenResp.headers.get("content-type"))

      const tokenText = await tokenResp.text().catch(() => "")
      let tokenPayload: any = null
      if (tokenText) {
        try {
          tokenPayload = JSON.parse(tokenText)
          console.log("[v0] VoiceRealtimeMini - Token payload received:", tokenPayload)
        } catch {
          console.error("[v0] VoiceRealtimeMini - Failed to parse token response:", tokenText.substring(0, 200))
          tokenPayload = { detail: tokenText }
        }
      }

      if (!tokenResp.ok) {
        const message =
          tokenPayload?.detail ??
          tokenPayload?.error ??
          `Voice token request failed (${tokenResp.status}). Check that AGENT_BACKEND_BASE is set and /api/voice/token endpoint is working.`
        console.error("[v0] VoiceRealtimeMini - Token request failed:", message)
        throw new Error(message)
      }

      if (!tokenPayload?.client_secret?.value) {
        const message =
          tokenPayload?.detail ??
          tokenPayload?.error ??
          "No realtime client secret returned from backend. The /api/voice/token endpoint may not be configured correctly."
        console.error("[v0] VoiceRealtimeMini - Missing client secret:", message)
        throw new Error(message)
      }

      setStatus("Connecting to OpenAI...")
      console.log("[v0] VoiceRealtimeMini - Connecting to OpenAI Realtime API...")

      // Send SDP to OpenAI Realtime, receive answer
      const r = await fetch("https://api.openai.com/v1/realtime?model=gpt-realtime-mini", {
        method: "POST",
        headers: {
          authorization: `Bearer ${tokenPayload.client_secret.value}`,
          "content-type": "application/sdp",
          "OpenAI-Beta": "realtime=v1",
        },
        body: offer.sdp || "",
      })

      console.log("[v0] VoiceRealtimeMini - OpenAI response status:", r.status)

      if (!r.ok) {
        const errorText = await r.text()
        console.error("[v0] VoiceRealtimeMini - OpenAI connection failed:", errorText)
        throw new Error(`OpenAI Realtime connection failed (${r.status}): ${errorText}`)
      }

      const answer = await r.text()
      console.log("[v0] VoiceRealtimeMini - Received SDP answer from OpenAI")
      await pc.setRemoteDescription({ type: "answer", sdp: answer })

      setStatus("Voice active")
      console.log("[v0] VoiceRealtimeMini - Voice session established successfully")

      activeRef.current = true
      setActive(true)
      if (onReady) {
        onReady({
          speak: async (text: string) => {
            try {
              const chan = dcRef.current
              if (!activeRef.current || !chan || chan.readyState !== "open") {
                console.warn("[v0] VoiceRealtimeMini - Cannot speak: channel not ready", {
                  active: activeRef.current,
                  hasChannel: !!chan,
                  readyState: chan?.readyState,
                })
                return
              }
              console.log("[v0] VoiceRealtimeMini - Sending speak command:", text.substring(0, 50))
              const payload = { type: "response.create", response: { instructions: String(text || "") } }
              chan.send(JSON.stringify(payload))
              if (remoteAudioRef.current) {
                remoteAudioRef.current.muted = false
                await remoteAudioRef.current.play().catch((e) => {
                  console.warn("[v0] VoiceRealtimeMini - Play failed:", e)
                  // Try to unmute and play again
                  if (remoteAudioRef.current) {
                    remoteAudioRef.current.muted = false
                    remoteAudioRef.current.play().catch(() => {})
                  }
                })
              }
            } catch (e) {
              console.warn("[v0] VoiceRealtimeMini - Speak failed:", e)
            }
          },
          stop: () => stop(),
          isActive: () => activeRef.current,
        })
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = false
        remoteAudioRef.current.volume = 1.0
        await remoteAudioRef.current.play().catch((e) => {
          console.warn("[v0] VoiceRealtimeMini - Initial auto-play blocked:", e)
          console.log("[v0] VoiceRealtimeMini - User may need to interact with page to enable audio")
        })
      }
    } catch (e: any) {
      console.error("[v0] VoiceRealtimeMini - Error:", e)
      const errorMsg = e?.message || String(e)
      setError(errorMsg)
      setStatus("Error")
      console.error("[v0] VoiceRealtimeMini - Full error details:", {
        message: errorMsg,
        stack: e?.stack,
      })
      if (onError) {
        onError(errorMsg)
      }
      stop()
    }
  }

  function stop() {
    console.log("[v0] VoiceRealtimeMini - Stopping voice session")
    setIsTransmitting(false)
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop())
      pcRef.current?.close()
    } catch {}
    pcRef.current = null
    try {
      dcRef.current?.close()
    } catch {}
    dcRef.current = null
    try {
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
    } catch {}
    localStreamRef.current = null
    activeRef.current = false
    setActive(false)
    setStatus("Ready")
  }

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 260 }}>
      <audio ref={remoteAudioRef} autoPlay playsInline controls={false} />
      {!autoStart && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!active ? <button onClick={start}>{buttonLabel}</button> : <button onClick={stop}>{stopLabel}</button>}
          {isTransmitting && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                animation: "pulse 1s infinite",
              }}
            />
          )}
        </div>
      )}
      {active && !error && (
        <div style={{ color: "#059669", fontSize: 12, padding: 8, backgroundColor: "#d1fae5", borderRadius: 4 }}>
          Status: {status}
          <div style={{ marginTop: 4, fontSize: 11, opacity: 0.8 }}>
            {isTransmitting ? "🔊 Audio playing..." : "Speak into your microphone"}
          </div>
        </div>
      )}
      {error && (
        <div style={{ color: "#b91c1c", fontSize: 12, padding: 8, backgroundColor: "#fee2e2", borderRadius: 4 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Voice Error:</div>
          <div>{error}</div>
        </div>
      )}
      {!error && !active && !autoStart && (
        <div style={{ color: "#6b7280", fontSize: 12 }}>Requires mic permission and HTTPS. Click to start.</div>
      )}
      {autoStart && !active && !error && (
        <div style={{ color: "#6366f1", fontSize: 12, padding: 8, backgroundColor: "#e0e7ff", borderRadius: 4 }}>
          Starting voice session...
        </div>
      )}
    </div>
  )
}
