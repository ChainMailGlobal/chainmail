"use client"

import { useRef, useState } from "react"

type AgentEvent =
  | { type: "MESSAGE"; role: "agent" | "system"; text: string }
  | { type: "REQUEST_INPUT"; fieldId: string; label: string; helpId?: string; constraints?: any }
  | {
      type: "PROVIDER_SUGGESTIONS"
      origin: { lat: number; lon: number }
      items: { org_id: string; name: string; address: string; distance_m: number; ai_witness_enabled?: boolean }[]
    }
  | { type: "PDF_READY"; url: string; form: "1583" | "1583A"; note?: string }
  | { type: "SIGN_AS_AI_WITNESS"; form: "1583"; witness: any }
  | { type: "NAVIGATE"; to: string }
  | { type: "BOOKING_CONFIRMED"; booking: any }

type MCPReply = {
  reply: string
  events: AgentEvent[]
  compliance: { allRequiredMet: boolean; missingBlocks: string[]; flags?: Record<string, boolean> }
  memory_id?: string
}

type Turn = { from: "user" | "agent"; text: string }

async function postChat(message: string, user_id?: string, submission_id?: string): Promise<MCPReply> {
  const resp = await fetch("/api/agent/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, user_id, submission_id }),
  })
  if (!resp.ok) throw new Error(await resp.text())
  return await resp.json()
}

export default function CMRAChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([
    {
      from: "agent",
      text: "Welcome to MailboxHero Pro. I'll guide your USPS Form 1583 with DMM 508.1.8 compliance. Type 'start' to begin.",
    },
  ])
  const [pending, setPending] = useState(false)
  const [lastReply, setLastReply] = useState<MCPReply | null>(null)
  const [lastError, setLastError] = useState<{ message: string; canRetry: boolean } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function send() {
    if (!inputRef.current?.value) return
    const msg = inputRef.current.value
    setTurns((t) => [...t, { from: "user", text: msg }])
    inputRef.current.value = ""
    setPending(true)
    setLastError(null)

    try {
      const data = await postChat(msg)
      setLastReply(data)
      const lines: Turn[] = [{ from: "agent", text: data.reply }]
      data.events?.forEach((ev) => {
        if (ev.type === "REQUEST_INPUT") {
          lines.push({ from: "agent", text: `Please provide: ${ev.label}` })
        } else if (ev.type === "PDF_READY") {
          lines.push({ from: "agent", text: `Your ${ev.form} is ready: ${ev.url}` })
        } else if (ev.type === "PROVIDER_SUGGESTIONS") {
          const items = ev.items.map((i) => `• ${i.name} — ${i.address} (${Math.round(i.distance_m)} m)`).join("\n")
          lines.push({ from: "agent", text: `Top providers near you:\n${items}` })
        } else if (ev.type === "BOOKING_CONFIRMED") {
          lines.push({ from: "agent", text: `Witness booked: ${ev.booking.start} (${ev.booking.modality})` })
        }
      })
      setTurns((t) => [...t, ...lines])
    } catch (e: any) {
      let errorMessage = "Unable to connect to chat service. Please try again."
      const canRetry = true

      try {
        const errorText = e.message || ""
        if (errorText.includes("mcp_unavailable") || errorText.includes("MCP returned 401")) {
          errorMessage =
            "The chat service is temporarily unavailable. Our team has been notified. Please try again in a moment."
        } else if (errorText.includes("fetch failed") || errorText.includes("network")) {
          errorMessage = "Network connection issue. Please check your internet and try again."
        } else if (errorText.includes("500")) {
          errorMessage = "Server error occurred. Please try again or contact support if this persists."
        }
      } catch {
        // Use default error message
      }

      setLastError({ message: errorMessage, canRetry })
      setTurns((t) => [...t, { from: "agent", text: `⚠️ ${errorMessage}` }])
    } finally {
      setPending(false)
    }
  }

  async function retry() {
    if (!lastError?.canRetry) return
    const lastUserMessage = [...turns].reverse().find((t) => t.from === "user")
    if (lastUserMessage && inputRef.current) {
      inputRef.current.value = lastUserMessage.text
      await send()
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="font-medium">CMRAgent</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[94vw] md:w-[400px] md:h-[700px] h-[calc(100vh-3rem)] rounded-2xl shadow-2xl bg-white border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-semibold">CMRA Agent • MailboxHero Pro</div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-4 bg-neutral-50">
            {turns.map((t, i) => (
              <div key={i} className={t.from === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block px-3 py-2 rounded-xl text-sm ${t.from === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-white space-y-3">
            {lastError?.canRetry && (
              <button
                onClick={retry}
                className="w-full py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-sm font-medium transition-colors"
              >
                Retry Last Message
              </button>
            )}

            <div className="flex gap-2">
              <input
                ref={inputRef}
                disabled={pending}
                placeholder="Type a message…"
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button onClick={send} disabled={pending} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
                {pending ? "…" : "Send"}
              </button>
            </div>

            <div className="text-center">
              <a href="/login" className="text-xs text-indigo-600 hover:text-indigo-700">
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
