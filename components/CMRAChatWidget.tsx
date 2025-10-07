"use client"

import { useMemo, useRef, useState } from "react"

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

async function createAccount(email: string, fullName: string, caseId?: string) {
  const r = await fetch("/api/auth/create-account", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, fullName, caseId }),
  })
  return await r.json()
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
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [lastReply, setLastReply] = useState<MCPReply | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasAllCore = useMemo(() => {
    const flags = lastReply?.compliance?.flags || {}
    const missing = lastReply?.compliance?.missingBlocks || []
    // We require phone & email per 1583; email here, phone via agent prompt
    const coreOK = !missing.length || missing.every((m) => m.toLowerCase().includes("optional"))
    return { coreOK, missing, flags }
  }, [lastReply])

  async function send() {
    if (!inputRef.current?.value) return
    const msg = inputRef.current.value
    setTurns((t) => [...t, { from: "user", text: msg }])
    inputRef.current.value = ""
    setPending(true)
    try {
      const data = await postChat(msg)
      setLastReply(data)
      const lines: Turn[] = [{ from: "agent", text: data.reply }]
      // Render some notable events inline for now
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
      setTurns((t) => [...t, { from: "agent", text: `Error: ${e.message || "chat failed"}` }])
    } finally {
      setPending(false)
    }
  }

  async function handleCreateAccount() {
    if (!email || !fullName) {
      setTurns((t) => [
        ...t,
        { from: "agent", text: "I need your full name and email to create your dashboard account." },
      ])
      return
    }
    const res = await createAccount(email, fullName, undefined)
    if (res.success) {
      setTurns((t) => [
        ...t,
        {
          from: "agent",
          text: "Account created. Check your email to verify and set your password, then log in to your dashboard.",
        },
      ])
    } else {
      setTurns((t) => [...t, { from: "agent", text: `Account error: ${res.error}` }])
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

            <div className="grid grid-cols-2 gap-2">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="border rounded-lg px-2 py-2 text-sm"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border rounded-lg px-2 py-2 text-sm"
              />
              <button
                onClick={handleCreateAccount}
                className="col-span-2 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
              >
                Create dashboard account
              </button>
            </div>

            {!!hasAllCore.missing?.length && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                Missing items (mail release blocked): {hasAllCore.missing.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
