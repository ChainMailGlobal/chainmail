"use client"

import { useState } from "react"

export default function MailboxHeroChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
          aria-label="Open CMRAgent chat"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="font-semibold text-sm">CMRAgent</span>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            !
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 md:-top-2 md:-right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-900"
            aria-label="Close chat"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <iframe
            src="https://mailboxhero-chat-standalone-7jhxz5xfd-mailboxheros-projects.vercel.app"
            className="w-full h-full md:w-full md:h-[700px] md:rounded-2xl md:shadow-2xl"
            style={{ border: "none" }}
            allow="camera; microphone"
            title="MailboxHero Assistant"
          />
        </div>
      )}
    </>
  )
}
