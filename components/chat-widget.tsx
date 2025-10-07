"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  from: "user" | "assistant"
  text: string
}

type FormData = {
  name?: string
  email?: string
  phone?: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "assistant",
      text: "Aloha! I'm CMRAgent. I can help you complete your Form 1583 in just 3 minutes. Ready to get started?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [formData, setFormData] = useState<FormData>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const extractFormData = (text: string) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/
    const nameRegex = /(?:my name is|i'm|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i

    const newFormData: FormData = { ...formData }

    const emailMatch = text.match(emailRegex)
    if (emailMatch) newFormData.email = emailMatch[0]

    const phoneMatch = text.match(phoneRegex)
    if (phoneMatch) newFormData.phone = phoneMatch[0]

    const nameMatch = text.match(nameRegex)
    if (nameMatch) newFormData.name = nameMatch[1]

    setFormData(newFormData)
    return newFormData
  }

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    const userMessage: Message = { from: "user", text: textToSend }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Extract form data from user input
    const updatedFormData = extractFormData(textToSend)

    try {
      console.log("[v0] Sending chat request...")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: updatedFormData,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error:", errorText)
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let assistantText = ""

      setMessages((prev) => [...prev, { from: "assistant", text: "" }])
      setIsTyping(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantText += chunk

        setMessages((prev) => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1
          if (newMessages[lastIndex]?.from === "assistant") {
            newMessages[lastIndex] = { from: "assistant", text: assistantText }
          }
          return newMessages
        })
      }

      console.log("[v0] Streaming complete")
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          from: "assistant",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ])
      setIsTyping(false)
    }
  }

  const handleQuickAction = () => {
    const quickMessage = "I want to start Form 1583"
    handleSend(quickMessage)
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-50 w-full h-full md:w-[400px] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col border-t md:border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b bg-indigo-600 md:rounded-t-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">CMRAgent</h3>
                <p className="text-xs text-white/80">AI Form Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 ${
                    message.from === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-3 md:px-4 pb-2">
              <Button
                onClick={handleQuickAction}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent"
              >
                Start Form 1583
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 md:p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 text-sm md:text-base"
              />
              <Button onClick={() => handleSend()} size="icon" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-indigo-600 text-white shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center group"
        aria-label="Open CMRAgent Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <Bot className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110 duration-200" />
        )}
      </button>
    </>
  )
}
