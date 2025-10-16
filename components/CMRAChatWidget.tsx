"use client"

import { useState } from "react"
import { Shield, X } from "@/lib/icons"

export default function CMRAChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const openChat = () => {
    window.open("https://app.mailboxhero.pro/chat", "_blank", "width=600,height=800")
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110"
          aria-label="Open CMRAgent chat"
        >
          <Shield className="w-7 h-7" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[94vw] rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">CMRA Agent • MailboxHero Pro</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                0
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Form 1583</h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Chat with our AI agent to complete your USPS Form 1583 in minutes with full witness verification.
            </p>

            <button
              onClick={openChat}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Open Chat Interface
            </button>

            <p className="text-xs text-gray-600 mt-4 font-medium">
              Opens in a new window with full voice, camera, and upload capabilities
            </p>
          </div>
        </div>
      )}
    </>
  )
}
