"use client"

import { useState } from "react"

export default function CMRAChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const openChat = () => {
    window.open("https://app.mailboxhero.pro/chat", "_blank", "width=500,height=800,menubar=no,toolbar=no,location=no")
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          aria-label="Open CMRAgent chat"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%208%2C%202025%2C%2006_21_45%20PM-PyMBtJyygIvQskbXvz75gDeeZBQq1p.png"
            alt="CMRAgent"
            className="w-18 h-18 object-contain"
          />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[94vw] rounded-2xl shadow-2xl bg-white border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="font-semibold">CMRA Agent • MailboxHero Pro</div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-white">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%208%2C%202025%2C%2006_21_45%20PM-PyMBtJyygIvQskbXvz75gDeeZBQq1p.png"
              alt="CMRAgent"
              className="w-24 h-24 object-contain mb-6"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Start Your Form 1583</h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Chat with our AI agent to complete your USPS Form 1583 in minutes with full witness verification.
            </p>
            <button
              onClick={openChat}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Open Chat Interface
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Opens in a new window with full voice, camera, and upload capabilities
            </p>
          </div>
        </div>
      )}
    </>
  )
}
