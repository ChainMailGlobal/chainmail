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
          className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 active:scale-95"
          aria-label="Open CMRAgent chat"
        >
          <Shield className="w-8 h-8" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:right-6 sm:left-auto z-[9999] sm:w-[400px] rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">CMRA Agent • MailboxHero Pro</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                0
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Start Your Form 1583</h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 sm:mb-8">
              Chat with our AI agent to complete your USPS Form 1583 in minutes with full witness verification.
            </p>

            <button
              onClick={openChat}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Open Chat Interface
            </button>

            <p className="text-xs text-gray-600 mt-3 sm:mt-4 font-medium">
              Opens in a new window with full voice, camera, and upload capabilities
            </p>
          </div>
        </div>
      )}
    </>
  )
}
