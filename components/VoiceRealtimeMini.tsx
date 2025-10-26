"use client"
import React from "react"

type VoiceRealtimeMiniProps = {
  buttonLabel?: string
  stopLabel?: string
  voicePreset?: string
  autoStart?: boolean
  sessionId?: string
  onReady?: (api: { speak: (text: string) => Promise<void>; stop: () => void; isActive: () => boolean }) => void
  onError?: (error: string) => void
}

export default function VoiceRealtimeMini({
  buttonLabel = "Start Voice",
  stopLabel = "Stop",
  voicePreset = "alloy",
  autoStart = false,
  sessionId,
  onReady,
  onError,
}: VoiceRealtimeMiniProps) {
  React.useEffect(() => {
    console.log("[v0] VoiceRealtimeMini - Component mounted with props:", {
      autoStart,
      voicePreset,
      sessionId,
    })
    return () => {
      console.log("[v0] VoiceRealtimeMini - Component unmounting, cleaning up connection")
      if (activeRef.current) {
        stop()
      }
    }
  }, [])

  const pcRef = React.useRef<RTCPeerConnection | null>(null)
  const localStreamRef = React.useRef<MediaStream | null>(null)
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const dcRef = React.useRef<RTCDataChannel | null>(null)
  const activeRef = React.useRef(false)
  const audioContainerRef = React.useRef<HTMLDivElement | null>(null)
  const isSpeakingResponseRef = React.useRef(false)
  const [active, setActive] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string>("Ready")
  const [isTransmitting, setIsTransmitting] = React.useState(false)
  const [needsUnmute, setNeedsUnmute] = React.useState(false)
  const [transcript, setTranscript] = React.useState<Array<{ role: "user" | "assistant"; text: string }>>([])

  React.useEffect(() => {
    if (!remoteAudioRef.current) {
      const audio = document.createElement("audio")
      audio.autoplay = true
      audio.playsInline = true
      audio.controls = false
      audio.style.display = "none"
      audio.volume = 1.0
      audio.muted = false
      audio.id = "voice-realtime-audio" // Add ID for debugging
      remoteAudioRef.current = audio

      // Append to document.body instead of component container
      document.body.appendChild(audio)

      console.log("[v0] VoiceRealtimeMini - Created persistent audio element in document.body")
    }

    // Don't remove audio element on unmount - let it persist
    return () => {
      console.log("[v0] VoiceRealtimeMini - Component unmounting (audio element persists)")
    }
  }, [])

  React.useEffect(() => {
    console.log("[v0] VoiceRealtimeMini - Auto-start effect triggered:", {
      autoStart,
      active,
      activeRef: activeRef.current,
    })
    if (autoStart && !active && !activeRef.current) {
      console.log("[v0] VoiceRealtimeMini - Initiating auto-start...")
      start().catch((e) => {
        console.error("[v0] VoiceRealtimeMini - Auto-start failed:", e)
        setError(e.message || String(e))
        if (onError) {
          onError(e.message || String(e))
        }
      })
    }
  }, [autoStart])

  function handleUnmute() {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = false
      remoteAudioRef.current.volume = 1.0
      remoteAudioRef.current
        .play()
        .then(() => {
          console.log("[v0] VoiceRealtimeMini - Audio unmuted and playing")
          setNeedsUnmute(false)
        })
        .catch((e) => {
          console.warn("[v0] VoiceRealtimeMini - Unmute failed:", e)
        })
    }
  }

  async function handleChatTurn(callId: string, message: string) {
    try {
      console.log("[v0] VoiceRealtimeMini - Handling chat turn:", message.substring(0, 50))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          session_id: sessionId || `voice_${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`)
      }

      const data = await response.json()
      const reply = data.reply || data.message || "I'm here to help."

      console.log("[v0] VoiceRealtimeMini - Got chat response:", reply.substring(0, 50))

      const chan = dcRef.current
      if (activeRef.current && chan && chan.readyState === "open") {
        isSpeakingResponseRef.current = true

        chan.send(
          JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: callId,
              output: JSON.stringify({ response: reply }),
            },
          }),
        )

        chan.send(
          JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["text", "audio"],
            },
          }),
        )

        setTimeout(() => {
          isSpeakingResponseRef.current = false
        }, 3000)
      }
    } catch (e: any) {
      console.error("[v0] VoiceRealtimeMini - Chat turn failed:", e)
      isSpeakingResponseRef.current = false
    }
  }

  async function start() {
    console.log("[v0] VoiceRealtimeMini - start() function called")
    setError(null)
    setStatus("Initializing...")
    setNeedsUnmute(false)
    try {
      console.log("[v0] VoiceRealtimeMini - Starting voice session with preset:", voicePreset)

      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
      pcRef.current = pc

      pc.onconnectionstatechange = () => {
        console.log("[v0] VoiceRealtimeMini - Connection state:", pc.connectionState)
        setStatus(`Connection: ${pc.connectionState}`)
      }

      pc.oniceconnectionstatechange = () => {
        console.log("[v0] VoiceRealtimeMini - ICE connection state:", pc.iceConnectionState)
      }

      const remoteStream = new MediaStream()
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream
        remoteAudioRef.current.volume = 1.0
        remoteAudioRef.current.muted = false
      }

      pc.ontrack = (e) => {
        console.log("[v0] VoiceRealtimeMini - Received remote audio track")
        e.streams.forEach((s) => s.getTracks().forEach((t) => remoteStream.addTrack(t)))
        setStatus("Audio connected")

        if (remoteAudioRef.current) {
          remoteAudioRef.current.play().catch((e) => {
            console.warn("[v0] VoiceRealtimeMini - Auto-play blocked:", e.message)
            setNeedsUnmute(true)
          })
        }
      }

      setStatus("Requesting microphone...")
      console.log("[v0] VoiceRealtimeMini - Requesting microphone access...")
      const local = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = local
      console.log("[v0] VoiceRealtimeMini - Microphone access granted")
      for (const track of local.getTracks()) {
        pc.addTrack(track, local)
      }

      const dc = pc.createDataChannel("oai-events")
      dcRef.current = dc

      dc.onopen = () => {
        console.log("[v0] VoiceRealtimeMini - Data channel opened")
        setStatus("Voice ready - speak now!")

        console.log("[v0] VoiceRealtimeMini - Triggering initial greeting")
        setTimeout(() => {
          if (activeRef.current && dcRef.current?.readyState === "open") {
            const chan = dcRef.current
            // Add a user message to start the conversation
            chan.send(
              JSON.stringify({
                type: "conversation.item.create",
                item: {
                  type: "message",
                  role: "user",
                  content: [
                    {
                      type: "input_text",
                      text: "Hello",
                    },
                  ],
                },
              }),
            )
            // Trigger OpenAI to respond
            chan.send(
              JSON.stringify({
                type: "response.create",
                response: {
                  modalities: ["text", "audio"],
                },
              }),
            )
          }
        }, 500)
      }
      dc.onclose = () => {
        console.log("[v0] VoiceRealtimeMini - Data channel closed")
        setIsTransmitting(false)
      }
      dc.onerror = (e) => {
        console.error("[v0] VoiceRealtimeMini - Data channel error:", e)
      }
      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data)
          console.log("[v0] VoiceRealtimeMini - Event type:", event.type)

          if (event.type === "error") {
            console.error("[v0] VoiceRealtimeMini - ERROR EVENT:", JSON.stringify(event, null, 2))
            setError(event.error?.message || event.message || "Unknown error from OpenAI")
            setStatus("Error occurred")
          }

          if (event.type === "conversation.item.input_audio_transcription.completed") {
            const userText = event.transcript || ""
            if (userText) {
              setTranscript((prev) => [...prev, { role: "user", text: userText }])
            }
          }

          if (event.type === "response.audio_transcript.done") {
            const assistantText = event.transcript || ""
            if (assistantText) {
              setTranscript((prev) => [...prev, { role: "assistant", text: assistantText }])
            }
          }

          if (isSpeakingResponseRef.current && event.type === "response.function_call_arguments.done") {
            console.log("[v0] VoiceRealtimeMini - Ignoring function call during response playback")
            return
          }

          if (event.type === "response.function_call_arguments.done") {
            console.log("[v0] VoiceRealtimeMini - Function call arguments done")

            // Extract function call details from the event
            if (event.item?.name === "cmra_chat_turn" || event.name === "cmra_chat_turn") {
              const item = event.item || event
              console.log("[v0] VoiceRealtimeMini - Function call:", item.name)
              console.log("[v0] VoiceRealtimeMini - Function arguments:", item.arguments)

              try {
                const args = typeof item.arguments === "string" ? JSON.parse(item.arguments) : item.arguments
                const message = args.message || args.user_message || ""
                const callId = item.call_id || event.call_id || `call_${Date.now()}`

                if (message) {
                  handleChatTurn(callId, message)
                }
              } catch (err) {
                console.error("[v0] VoiceRealtimeMini - Failed to parse function arguments:", err)
              }
            }
          }

          if (event.type?.includes("audio") || event.type?.includes("response")) {
            setIsTransmitting(true)
            setTimeout(() => setIsTransmitting(false), 1000)
          }
        } catch (err) {
          console.warn("[v0] VoiceRealtimeMini - Failed to parse event:", err)
        }
      }

      setStatus("Creating offer...")
      const offer = await pc.createOffer({ offerToReceiveAudio: true })
      await pc.setLocalDescription(offer)

      setStatus("Getting voice token...")
      const tokenResp = await fetch("/api/voice/token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ voice: voicePreset }),
      })

      console.log("[v0] VoiceRealtimeMini - Token response status:", tokenResp.status)

      const tokenText = await tokenResp.text()
      let tokenPayload: any = null
      try {
        tokenPayload = JSON.parse(tokenText)
      } catch {
        console.error("[v0] VoiceRealtimeMini - Failed to parse token response")
        tokenPayload = { detail: tokenText }
      }

      if (!tokenResp.ok) {
        const message =
          tokenPayload?.detail ?? tokenPayload?.error ?? `Voice token request failed (${tokenResp.status})`
        throw new Error(message)
      }

      if (!tokenPayload?.client_secret?.value) {
        throw new Error("No realtime client secret returned from backend")
      }

      setStatus("Connecting to OpenAI...")
      const r = await fetch("https://api.openai.com/v1/realtime?model=gpt-realtime-mini", {
        method: "POST",
        headers: {
          authorization: `Bearer ${tokenPayload.client_secret.value}`,
          "content-type": "application/sdp",
          "OpenAI-Beta": "realtime=v1",
        },
        body: offer.sdp || "",
      })

      if (!r.ok) {
        const errorText = await r.text()
        throw new Error(`OpenAI connection failed (${r.status}): ${errorText}`)
      }

      const answer = await r.text()
      await pc.setRemoteDescription({ type: "answer", sdp: answer })

      setStatus("Voice active")
      console.log("[v0] VoiceRealtimeMini - Voice session established")

      activeRef.current = true
      setActive(true)

      if (onReady) {
        onReady({
          speak: async (text: string) => {
            try {
              const chan = dcRef.current
              if (!activeRef.current || !chan || chan.readyState !== "open") {
                console.warn("[v0] VoiceRealtimeMini - Cannot speak: channel not ready")
                return
              }
              console.log("[v0] VoiceRealtimeMini - Sending speak command:", text.substring(0, 50))
              const payload = { type: "response.create", response: { instructions: String(text || "") } }
              chan.send(JSON.stringify(payload))

              if (remoteAudioRef.current) {
                remoteAudioRef.current.muted = false
                remoteAudioRef.current.volume = 1.0
                await remoteAudioRef.current.play().catch((e) => {
                  console.warn("[v0] VoiceRealtimeMini - Play failed:", e.message)
                  setNeedsUnmute(true)
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
        remoteAudioRef.current.play().catch((e) => {
          console.warn("[v0] VoiceRealtimeMini - Initial play blocked:", e.message)
          setNeedsUnmute(true)
        })
      }
    } catch (e: any) {
      console.error("[v0] VoiceRealtimeMini - Error in start():", e)
      const errorMsg = e?.message || String(e)
      setError(errorMsg)
      setStatus("Error")
      if (onError) {
        onError(errorMsg)
      }
      stop()
      throw e
    }
  }

  function stop() {
    console.log("[v0] VoiceRealtimeMini - Stopping voice session")
    setIsTransmitting(false)
    setNeedsUnmute(false)
    isSpeakingResponseRef.current = false
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

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null
      remoteAudioRef.current.pause()
    }

    activeRef.current = false
    setActive(false)
    setStatus("Ready")
  }

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 260 }}>
      {transcript.length > 0 && (
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            padding: 8,
            backgroundColor: "#f9fafb",
            borderRadius: 8,
            fontSize: 12,
            border: "1px solid #e5e7eb",
          }}
        >
          {transcript.map((item, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 8,
                padding: 6,
                backgroundColor: item.role === "user" ? "#dbeafe" : "#f3e8ff",
                borderRadius: 6,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 2, color: item.role === "user" ? "#1e40af" : "#6b21a8" }}>
                {item.role === "user" ? "You" : "AI"}:
              </div>
              <div style={{ color: "#374151" }}>{item.text}</div>
            </div>
          ))}
        </div>
      )}

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

      {needsUnmute && active && (
        <button
          onClick={handleUnmute}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🔊 Click to Enable Audio
        </button>
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
