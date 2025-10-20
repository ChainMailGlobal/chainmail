"use client"
import React from "react"

type VoiceRealtimeMiniProps = {
  buttonLabel?: string
  stopLabel?: string
  voicePreset?: string
  onReady?: (api: { speak: (text: string) => Promise<void>; stop: () => void; isActive: () => boolean }) => void
}

export default function VoiceRealtimeMini({
  buttonLabel = "Start Voice",
  stopLabel = "Stop",
  voicePreset = "alloy",
  onReady,
}: VoiceRealtimeMiniProps) {
  const pcRef = React.useRef<RTCPeerConnection | null>(null)
  const localStreamRef = React.useRef<MediaStream | null>(null)
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const dcRef = React.useRef<RTCDataChannel | null>(null)
  const activeRef = React.useRef(false)
  const [active, setActive] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function start() {
    setError(null)
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
      pcRef.current = pc

      // Remote audio sink
      const remoteStream = new MediaStream()
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream
      }
      pc.ontrack = (e) => {
        e.streams[0]?.getAudioTracks().forEach(() => {})
        e.streams.forEach((s) => s.getTracks().forEach((t) => remoteStream.addTrack(t)))
      }

      // Mic
      const local = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = local
      for (const track of local.getTracks()) pc.addTrack(track, local)

      // Data channel for sending speak events
      const dc = pc.createDataChannel("oai-events")
      dcRef.current = dc

      // Create local offer
      const offer = await pc.createOffer({ offerToReceiveAudio: true })
      await pc.setLocalDescription(offer)

      // Get ephemeral client secret for gpt-realtime-mini
      const tokenResp = await fetch("/api/voice/token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ voice: voicePreset }),
      })
      const tokenText = await tokenResp.text().catch(() => "")
      let tokenPayload: any = null
      if (tokenText) {
        try {
          tokenPayload = JSON.parse(tokenText)
        } catch {
          tokenPayload = { detail: tokenText }
        }
      }

      if (!tokenResp.ok) {
        const message =
          tokenPayload?.detail ?? tokenPayload?.error ?? `Voice token request failed (${tokenResp.status})`
        throw new Error(message)
      }

      if (!tokenPayload?.client_secret?.value) {
        const message = tokenPayload?.detail ?? tokenPayload?.error ?? "No realtime client secret returned"
        throw new Error(message)
      }

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
      const answer = await r.text()
      await pc.setRemoteDescription({ type: "answer", sdp: answer })

      activeRef.current = true
      setActive(true)
      if (onReady) {
        onReady({
          speak: async (text: string) => {
            try {
              const chan = dcRef.current
              if (!activeRef.current || !chan || chan.readyState !== "open") return
              const payload = { type: "response.create", response: { instructions: String(text || "") } }
              chan.send(JSON.stringify(payload))
              await remoteAudioRef.current?.play().catch(() => {})
            } catch (e) {
              console.warn("voice speak failed", e)
            }
          },
          stop: () => stop(),
          isActive: () => activeRef.current,
        })
      }
      // Start playing remote audio (iOS/Safari may require a user gesture)
      await remoteAudioRef.current?.play().catch(() => {})
    } catch (e: any) {
      setError(e?.message || String(e))
      stop()
    }
  }

  function stop() {
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
  }

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 260 }}>
      <audio ref={remoteAudioRef} autoPlay playsInline />
      <div style={{ display: "flex", gap: 8 }}>
        {!active ? <button onClick={start}>{buttonLabel}</button> : <button onClick={stop}>{stopLabel}</button>}
      </div>
      {error && <div style={{ color: "#b91c1c", fontSize: 12 }}>Voice error: {error}</div>}
      {!error && !active && (
        <div style={{ color: "#6b7280", fontSize: 12 }}>Requires mic permission and HTTPS. Click to start.</div>
      )}
    </div>
  )
}
