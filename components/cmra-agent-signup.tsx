"use client"

import { useState } from "react"

// Minimal, self-contained mockup of a CMRA Agent chat for sign-ups
// Tailwind classes are used for styling. No external UI kits required.
// This is a lightweight, interactive prototype — click Quick Actions to see the flow.

export default function CMRAAgentSignupMock() {
  type Msg = { id: string; from: "agent" | "user"; text: string }

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m1",
      from: "agent",
      text: "Aloha! I’m MailboxHero — your CMRA Agent. I can help you open a mailbox, complete Form 1583, and handle witnessing. Ready to start?",
    },
  ])

  const [input, setInput] = useState("")

  const [steps, setSteps] = useState([
    { key: "account", label: "Create account", done: false },
    { key: "email", label: "Verify email", done: false },
    { key: "ids", label: "Upload IDs", done: false },
    { key: "prefill", label: "Prefill 1583", done: false },
    { key: "witness", label: "Witness", done: false },
    { key: "submit", label: "Submit / Finish", done: false },
  ])

  function push(from: Msg["from"], text: string) {
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), from, text }])
  }

  function completeStep(key: string) {
    setSteps((s) => s.map((st) => (st.key === key ? { ...st, done: true } : st)))
  }

  function onSend() {
    if (!input.trim()) return
    push("user", input.trim())
    setInput("")
    // naive echo
    setTimeout(() => {
      push("agent", "Got it. If you’d like, tap a Quick Action to move to the next step.")
    }, 400)
  }

  // Quick actions simulate the happy path for sign-ups
  const actions = [
    {
      label: "Start 1583",
      onClick: () => {
        push("user", "Start my 1583")
        push("agent", "Great — I’ve created your submission. Let’s make an account so we can save your progress.")
        completeStep("account")
      },
    },
    {
      label: "Verify Email",
      onClick: () => {
        push("user", "Email verified")
        push(
          "agent",
          "Email verified ✅ Next, please upload a primary and a secondary ID. A driver’s license + utility bill works.",
        )
        completeStep("email")
      },
    },
    {
      label: "Upload IDs",
      onClick: () => {
        push("user", "Uploading my license front/back and a utility bill…")
        setTimeout(() => {
          push("agent", "Thanks! I’m running OCR to extract your name and address and will prefill Form 1583 fields.")
          completeStep("ids")
          setTimeout(() => {
            push("agent", "Prefill ready. Please review the fields for accuracy and sign.")
            completeStep("prefill")
          }, 700)
        }, 600)
      },
    },
    {
      label: "Schedule Witness",
      onClick: () => {
        push("user", "Schedule a witness session")
        push(
          "agent",
          "I can queue you for a live agent (v3a) or use AI Witness™ (v3b) if risk is low. Which do you prefer?",
        )
        completeStep("witness")
      },
    },
    {
      label: "Finish & Submit",
      onClick: () => {
        push("user", "Finish and submit")
        push(
          "agent",
          "All set! I’ve generated your evidence packet and created an audit receipt. You’ll get an email with download links.",
        )
        completeStep("submit")
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white p-6">
      {/* Header */}
      <header className="mx-auto max-w-6xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white grid place-items-center font-semibold">MH</div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">MailboxHero — CMRA Agent</h1>
            <p className="text-sm text-zinc-500">Form 1583 sign‑ups • Witness • Audit</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
          <span className="inline-flex items-center gap-1">
            Status:
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700">
              Online
            </span>
          </span>
        </div>
      </header>

      {/* Main grid */}
      <main className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat column */}
        <section className="lg:col-span-2">
          <div className="rounded-2xl border bg-white shadow-sm h-[72vh] flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="font-medium">Sign‑up Assistant</div>
              <div className="text-xs text-zinc-500">508‑friendly • Keyboard/Screen‑reader ready</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow ${
                      m.from === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-zinc-100 text-zinc-800 rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  onSend()
                }}
              >
                <label htmlFor="chat" className="sr-only">
                  Message
                </label>
                <input
                  id="chat"
                  className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message… (e.g., ‘Start my 1583’)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:brightness-110 focus:ring-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </form>

              {/* Quick actions */}
              <div className="mt-3 flex flex-wrap gap-2" aria-label="Quick actions">
                {actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar: Progress */}
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="font-medium mb-2">Your progress</div>
            <ol className="space-y-2">
              {steps.map((s) => (
                <li key={s.key} className="flex items-center gap-2 text-sm">
                  <span
                    className={`h-5 w-5 grid place-items-center rounded-full text-white ${
                      s.done ? "bg-green-500" : "bg-zinc-300"
                    }`}
                    aria-hidden
                  >
                    {s.done ? "✓" : "…"}
                  </span>
                  <span className={s.done ? "text-zinc-700" : "text-zinc-500"}>{s.label}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="font-medium mb-2">What I’ll collect</div>
            <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-1">
              <li>Primary + secondary ID (OCR for prefill)</li>
              <li>Mailing & physical address (normalize)</li>
              <li>Signature and witness preference</li>
              <li>Consent to automated checks</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="font-medium mb-2">Witness options</div>
            <div className="text-sm text-zinc-600 space-y-1">
              <p>
                <strong>v1:</strong> Human-only
              </p>
              <p>
                <strong>v2:</strong> AI prechecks + human countersign
              </p>
              <p>
                <strong>v3a:</strong> Queue for live virtual agent
              </p>
              <p>
                <strong>v3b:</strong> Full AI Witness™ (risk‑gated)
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl mt-6 text-center text-xs text-zinc-500">
        DMM 508.1.8.1 assistance only — not legal advice. Evidence is hashed and logged for audit.
      </footer>
    </div>
  )
}
