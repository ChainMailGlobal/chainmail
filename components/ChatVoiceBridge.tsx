"use client"
import React from "react"
import VoiceRealtimeMini from "./VoiceRealtimeMini"

type Msg = { role: "user" | "agent"; text: string }
type AttachmentPayload = { kind?: string; url: string; name?: string; type?: string }
type Followup = { type: string; label?: string; due_at?: string; status?: string; created_at?: string }
type ChatResp = { reply?: string; next?: string; session_id?: string; followups?: Followup[] }
type HistoryEntry = {
  role: "user" | "agent"
  message: string
  meta?: Record<string, unknown> | null
  created_at?: string
}

const SESSION_STORAGE_KEY = "mailboxhero_chat_session"

type ChatVoiceBridgeProps = {
  endpoint?: string
  placeholder?: string
  height?: number
  autoVoiceOn?: boolean
  voicePreset?: string
}

export default function ChatVoiceBridge({
  endpoint = "/api/chat",
  placeholder = "Type a message...",
  height = 440,
  autoVoiceOn = false,
  voicePreset = "alloy",
}: ChatVoiceBridgeProps) {
  const [messages, setMessages] = React.useState<Msg[]>([])
  const [input, setInput] = React.useState("")
  const [next, setNext] = React.useState<string | undefined>(undefined)
  const [busy, setBusy] = React.useState(false)
  const [uploadingKind, setUploadingKind] = React.useState<string | null>(null)
  const [followups, setFollowups] = React.useState<Followup[]>([])
  const [voiceOn, setVoiceOn] = React.useState(false)
  const [showWitness, setShowWitness] = React.useState(false)
  const [witnessSubmissionId, setWitnessSubmissionId] = React.useState<string | undefined>(undefined)
  const [loadingHistory, setLoadingHistory] = React.useState(false)
  const [historyError, setHistoryError] = React.useState<string | null>(null)
  const [historyLoaded, setHistoryLoaded] = React.useState(false)
  const [connectionIssue, setConnectionIssue] = React.useState<"history" | "network" | null>(null)
  const sessionRef = React.useRef<string | undefined>(undefined)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const speakRef = React.useRef<null | ((t: string) => Promise<void>)>(null)
  const pendingStartRef = React.useRef(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const sendRef = React.useRef<
    | ((
        msg: string,
        extras?: { attachments?: AttachmentPayload[] },
        options?: { silent?: boolean },
      ) => Promise<ChatResp | null> | void)
    | null
  >(null)
  const PRECHECK_START = "precheck:start"

  const persistSession = React.useCallback((sessionId: string | undefined) => {
    if (!sessionId || typeof window === "undefined") return
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
    } catch {
      // ignore storage errors
    }
  }, [])

  const clearStoredSession = React.useCallback(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const loadHistory = React.useCallback(
    async (sessionId: string) => {
      setLoadingHistory(true)
      setHistoryError(null)
      setConnectionIssue(null)
      try {
        setShowWitness(false)
        setWitnessSubmissionId(undefined)
        const res = await fetch(`/api/chat/history/${encodeURIComponent(sessionId)}`, {
          method: "GET",
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error(`history_request_failed_${res.status}`)
        }
        const payload = await res.json().catch(() => ({}))
        const history: HistoryEntry[] = Array.isArray(payload?.messages) ? payload.messages : []
        if (history.length) {
          setMessages(
            history
              .filter((entry): entry is HistoryEntry => entry.role === "user" || entry.role === "agent")
              .map((entry) => ({ role: entry.role, text: entry.message })),
          )
          const lastAgent = [...history].reverse().find((entry) => entry.role === "agent")
          if (lastAgent?.meta && typeof lastAgent.meta === "object") {
            const meta = lastAgent.meta as { next?: string; followups?: Followup[] }
            if (typeof meta?.next === "string") setNext(meta.next)
            if (Array.isArray(meta?.followups)) setFollowups(meta.followups)
          }
        } else {
          setMessages([])
          setNext(undefined)
          setFollowups([])
        }
        sessionRef.current = sessionId
        persistSession(sessionId)
        setConnectionIssue(null)
      } catch (err) {
        console.warn("[chat] history load failed", err)
        setHistoryError("history_load_failed")
        sessionRef.current = sessionId
        persistSession(sessionId)
        setMessages([])
        setNext(undefined)
        setFollowups([])
        setConnectionIssue("history")
      } finally {
        setLoadingHistory(false)
        setHistoryLoaded(true)
      }
    },
    [persistSession],
  )

  const startNewConversation = React.useCallback(() => {
    clearStoredSession()
    sessionRef.current = undefined
    setMessages([])
    setNext(undefined)
    setFollowups([])
    setShowWitness(false)
    setWitnessSubmissionId(undefined)
    setHistoryError(null)
    setHistoryLoaded(true)
    setLoadingHistory(false)
    setConnectionIssue(null)
    setTimeout(() => {
      try {
        inputRef.current?.focus()
      } catch {
        // ignore
      }
    }, 0)
  }, [clearStoredSession])

  React.useEffect(() => {
    if (!historyLoaded) return
    inputRef.current?.focus()
    if (autoVoiceOn && !sessionRef.current) {
      setVoiceOn(true)
      pendingStartRef.current = true // greet will be spoken after voice is ready
    }
  }, [autoVoiceOn, historyLoaded])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (storedSession) {
      loadHistory(storedSession)
    } else {
      setHistoryLoaded(true)
    }
  }, [loadHistory])

  // Keep cursor ready: focus input on container click and on global typing
  React.useEffect(() => {
    function focusIfPossible() {
      inputRef.current?.focus()
    }
    const onContainerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tag = (target?.tagName || "").toLowerCase()
      if (tag !== "input" && tag !== "textarea" && target?.getAttribute("contenteditable") !== "true") {
        focusIfPossible()
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase()
      const isTypingTarget =
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement | null)?.getAttribute("contenteditable") === "true"
      if (!isTypingTarget) {
        // Printable keys (single char) without meta/ctrl
        if (e.key && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          focusIfPossible()
          // Optionally append the character for a smooth UX
          try {
            if (inputRef.current) {
              inputRef.current.value += e.key
              setInput(inputRef.current.value)
            }
          } catch {}
          e.preventDefault()
        } else if (e.key === "Backspace") {
          focusIfPossible()
          e.preventDefault()
        }
      }
    }
    const node = containerRef.current
    node?.addEventListener("click", onContainerClick)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      node?.removeEventListener("click", onContainerClick)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  async function send(
    msg: string,
    extras?: { attachments?: AttachmentPayload[] },
    options?: { silent?: boolean },
  ): Promise<ChatResp | null> {
    const silent = options?.silent ?? false
    if (!msg || busy || loadingHistory) return null
    setBusy(true)
    if (!silent) {
      setMessages((m) => [...m, { role: "user", text: msg }])
    }
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: msg, session_id: sessionRef.current, attachments: extras?.attachments }),
      })
      if (!r.ok) {
        setConnectionIssue("network")
        const body = await r.json().catch(() => ({}))
        throw new Error(body?.error || `chat_request_failed_${r.status}`)
      }
      const j: ChatResp = await r.json()
      sessionRef.current = j.session_id || sessionRef.current
      if (sessionRef.current) {
        persistSession(sessionRef.current)
      }
      if (j.reply) {
        setMessages((m) => [...m, { role: "agent", text: j.reply! }])
        if (voiceOn && speakRef.current) {
          // Speak orchestrator reply via ChatGPT voice
          speakRef.current(j.reply!)
        }
      }
      setNext(j.next)
      if (Array.isArray(j.followups)) {
        setFollowups(j.followups)
      }
      if (!historyLoaded) {
        setHistoryLoaded(true)
      }
      setConnectionIssue(null)
      return j
    } catch {
      if (!silent) {
        setMessages((m) => [...m, { role: "agent", text: "Chat error. Try again." }])
      }
      setConnectionIssue("network")
      return null
    } finally {
      setBusy(false)
      if (!silent) {
        setInput("")
        inputRef.current?.focus()
      }
    }
  }

  React.useEffect(() => {
    sendRef.current = send
  })

  React.useEffect(() => {
    const needsWitness =
      next === "capture_signature" || followups.some((f) => f.type === "witness" || f.type === "capture_signature")
    setShowWitness((prev) => (prev === needsWitness ? prev : needsWitness))
    if (needsWitness && sessionRef.current) {
      setWitnessSubmissionId(sessionRef.current)
    }
  }, [next, followups])

  React.useEffect(() => {
    function onWitnessMessage(event: MessageEvent) {
      if (event?.data?.type === "witness:completed") {
        ;(async () => {
          let attempts = 0
          while (busy && attempts < 10) {
            await new Promise((resolve) => setTimeout(resolve, 200))
            attempts += 1
          }
          if (!busy && sendRef.current) {
            await sendRef.current("signed")
          }
        })()
      }
    }
    window.addEventListener("message", onWitnessMessage)
    return () => window.removeEventListener("message", onWitnessMessage)
  }, [busy])

  // Optional: quick kickoff when toggling voice on (enter intake)
  async function ensureStarted() {
    if (!sessionRef.current && !busy) {
      await send(PRECHECK_START, undefined, { silent: true })
    }
  }

  async function handleUpload(kind: "photo_id" | "proof_address") {
    if (uploadingKind || loadingHistory) return
    await ensureStarted()
    return new Promise<void>((resolve) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*,application/pdf"
      if (kind === "photo_id") {
        input.setAttribute("capture", "environment")
      }
      setUploadingKind(kind)
      document.body.appendChild(input)
      input.onchange = async () => {
        const file = input.files?.[0]
        input.remove()
        if (!file) {
          setUploadingKind(null)
          resolve()
          return
        }
        setUploadingKind(kind)
        try {
          const form = new FormData()
          form.append("file", file)
          form.append("kind", kind)
          form.append("case_id", sessionRef.current || "pending")
          const resp = await fetch("/api/upload", {
            method: "POST",
            body: form,
          })
          const data = await resp.json()
          if (!resp.ok || !data?.fileUrl) {
            throw new Error(data?.error || "Upload failed")
          }
          const label = kind === "photo_id" ? "Photo ID" : "Proof of address"
          const existingDraft = inputRef.current?.value ?? ""
          await send(`Uploaded ${label}: ${data.fileUrl}`, {
            attachments: [{ kind, url: data.fileUrl, name: file.name, type: file.type }],
          })
          if (existingDraft) {
            setInput(existingDraft)
            if (inputRef.current) {
              inputRef.current.value = existingDraft
            }
          }
        } catch (err: any) {
          setMessages((m) => [...m, { role: "agent", text: `Upload failed: ${err?.message || String(err)}` }])
        } finally {
          setUploadingKind(null)
          resolve()
        }
      }
      input.click()
    })
  }

  // Basic browser STT to capture final text; minimal and optional
  // Use 'any' to avoid TS DOM lib dependency for SpeechRecognition types in build
  const recognitionRef = React.useRef<any>(null)
  const [listening, setListening] = React.useState(false)

  function toggleMic() {
    const SR: any = (globalThis as any).webkitSpeechRecognition || (globalThis as any).SpeechRecognition
    if (!SR) {
      alert("Voice (STT) not supported in this browser.")
      return
    }
    void ensureStarted()
    if (!recognitionRef.current) {
      const rec: any = new SR()
      rec.lang = "en-US"
      rec.interimResults = true
      rec.continuous = false
      rec.onstart = () => setListening(true)
      rec.onend = () => setListening(false)
      rec.onerror = () => setListening(false)
      rec.onresult = (e: any) => {
        let finalText = ""
        let interimText = ""
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript
          if (e.results[i].isFinal) finalText += t
          else interimText += t
        }
        if (interimText) setInput(interimText)
        if (finalText) {
          const text = finalText.trim()
          setInput(text)
          send(text)
        }
      }
      recognitionRef.current = rec
    }
    const rec = recognitionRef.current!
    if (listening) rec.stop()
    else rec.start()
  }

  const needsPhotoId = followups.some((f) => f.type === "photo_id")
  const needsProofAddress = followups.some(
    (f) => f.type === "proof_of_address" || f.type === "proof_address" || f.type === "upload_address_proof",
  )
  const hasAgentReply = messages.some((m) => m.role === "agent")
  const showUploadButtons =
    next === "upload_ids" || next === "upload_address_proof" || needsPhotoId || needsProofAddress || hasAgentReply
  const witnessCaseId = witnessSubmissionId || sessionRef.current || "pending"
  const pendingBadges = [
    needsPhotoId ? "Photo ID pending" : null,
    needsProofAddress ? "Proof of address pending" : null,
  ]
    .filter(Boolean)
    .join(" | ")
  const resources = [
    { label: "PS Form 1583 (USPS)", url: "https://about.usps.com/forms/ps1583.pdf" },
    { label: "PS Form 1583-A (CMRA Registration)", url: "https://about.usps.com/forms/ps1583a.pdf" },
    { label: "USPS Privacy Act Statement", url: "https://about.usps.com/who/legal/privacy-policy/" },
  ]

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        border: "1px solid #d1d5db",
        borderRadius: 10,
        padding: 16,
        background: "#ffffff",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#4b5563" }}>
          {sessionRef.current ? "Continuing your CMRA intake session." : "Start your CMRA compliance intake."}
        </span>
        {sessionRef.current && historyLoaded && (
          <button
            type="button"
            onClick={startNewConversation}
            style={{
              fontSize: 12,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#1f2937",
              borderRadius: 6,
              padding: "4px 10px",
            }}
          >
            Start new conversation
          </button>
        )}
      </div>

      {connectionIssue && (
        <div
          style={{
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #fb923c",
            background: "#fff7ed",
            color: "#9a3412",
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            {connectionIssue === "history"
              ? "We couldn't restore your previous session."
              : "We lost the connection to your session."}
          </div>
          <div style={{ fontSize: 12 }}>
            You can retry the session or restart. We'll keep your local history until you choose to reset.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sessionRef.current && (
              <button
                type="button"
                onClick={() => {
                  if (sessionRef.current) {
                    loadHistory(sessionRef.current)
                  }
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #f97316",
                  background: "#fff7ed",
                  color: "#c2410c",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Retry session
              </button>
            )}
            <button
              type="button"
              onClick={startNewConversation}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #b91c1c",
                background: "#fee2e2",
                color: "#991b1b",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Restart session
            </button>
          </div>
        </div>
      )}

      {loadingHistory && (
        <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 12 }}>Loading previous messages…</div>
      )}
      {historyError && (
        <div style={{ fontSize: 12, color: "#b91c1c", marginBottom: 12 }}>
          We couldn&apos;t load your last chat. You&apos;re starting fresh.
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
        {!voiceOn ? (
          <button
            type="button"
            disabled={loadingHistory || busy}
            onClick={async () => {
              setVoiceOn(true)
              await ensureStarted()
            }}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #6366f1",
              background: "#eef2ff",
              color: "#312e81",
              fontSize: 12,
              opacity: loadingHistory ? 0.6 : 1,
            }}
          >
            Enable Voice Greeting
          </button>
        ) : (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={voiceOn}
              disabled={loadingHistory || busy}
              onChange={async (e) => {
                setVoiceOn(e.target.checked)
                if (e.target.checked) await ensureStarted()
              }}
            />
            Voice Beta
          </label>
        )}
        {voiceOn && (
          <div style={{ marginLeft: 12 }}>
            <VoiceRealtimeMini
              voicePreset={voicePreset}
              onReady={async (api) => {
                speakRef.current = api.speak
                if (pendingStartRef.current && !sessionRef.current) {
                  pendingStartRef.current = false
                  await send(PRECHECK_START, undefined, { silent: true })
                }
              }}
            />
          </div>
        )}
      </div>

      <div style={{ maxHeight: height, overflowY: "auto", display: "grid", gap: 10 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              justifySelf: m.role === "agent" ? "start" : "end",
              maxWidth: "85%",
              background: m.role === "agent" ? "#f7f7f8" : "#e7f0ff",
              borderRadius: 8,
              padding: "8px 10px",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {showUploadButtons && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            border: "1px dashed #9ca3af",
            borderRadius: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#4b5563" }}>
            Upload required ID documents{pendingBadges ? ` (${pendingBadges})` : " (optional during intake)"}
          </span>
          <button
            type="button"
            onClick={() => handleUpload("photo_id")}
            disabled={!!uploadingKind}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #2563eb",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: 12,
            }}
          >
            {uploadingKind === "photo_id" ? "Uploading Photo ID..." : "Upload Photo ID"}
          </button>
          <button
            type="button"
            onClick={() => handleUpload("proof_address")}
            disabled={!!uploadingKind}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #059669",
              background: "#ecfdf5",
              color: "#047857",
              fontSize: 12,
            }}
          >
            {uploadingKind === "proof_address" ? "Uploading Proof..." : "Upload Proof of Address"}
          </button>
        </div>
      )}

      {showWitness && (
        <div style={{ marginTop: 12 }}>
          <iframe
            src={`/witness/live?embed=1${witnessCaseId ? `&submission_id=${encodeURIComponent(witnessCaseId)}` : ""}`}
            style={{ width: "100%", maxWidth: 440, height: 520, border: 0, borderRadius: 8 }}
            allow="camera *; microphone *"
          />
        </div>
      )}

      {!!followups.length && (
        <div
          style={{ marginTop: 12, padding: 12, borderRadius: 8, border: "1px solid #fbbf24", background: "#fffbeb" }}
        >
          <div style={{ fontWeight: 600, fontSize: 12, color: "#92400e", marginBottom: 6 }}>Outstanding items</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#92400e", display: "grid", gap: 4 }}>
            {followups.map((f) => {
              const due = f.due_at ? new Date(f.due_at).toLocaleDateString() : undefined
              const status = f.status && f.status !== "pending" ? ` (${f.status})` : ""
              return (
                <li key={`${f.type}-${f.created_at ?? ""}`}>
                  {f.label || f.type}
                  {due ? ` - due ${due}` : ""}
                  {status}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, border: "1px solid #d1d5db", background: "#f9fafb" }}>
        <div style={{ fontWeight: 600, fontSize: 12, color: "#1f2937", marginBottom: 6 }}>Compliance resources</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#374151", display: "grid", gap: 4 }}>
          {resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const m = input.trim()
          if (m) send(m)
        }}
        style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}
      >
        <input
          ref={inputRef}
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput((e.target as HTMLInputElement).value)}
          disabled={loadingHistory}
          style={{ flex: 1 }}
          autoFocus
        />
        {voiceOn && (
          <button
            type="button"
            onClick={toggleMic}
            disabled={loadingHistory}
            style={{ padding: "6px 10px", opacity: loadingHistory ? 0.6 : 1 }}
          >
            {listening ? "Stop Listening" : "Speak"}
          </button>
        )}
        <button
          type="submit"
          disabled={loadingHistory || !input || busy}
          style={{ padding: "6px 12px", opacity: loadingHistory ? 0.6 : 1 }}
        >
          {busy ? "Sending..." : "Send"}
        </button>
      </form>

      {!!next && <div style={{ marginTop: 6, color: "#999", fontSize: 12 }}>Next: {next}</div>}
    </div>
  )
}
