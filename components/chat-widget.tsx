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

type ScreeningData = {
  userType: "cmra_owner" | "cmra_customer" | "individual" | null
  has1583a: boolean | null
  witnessPreference: "in_person" | "video" | "ai_witness" | null
  flow: "1583a_registration" | "1583_owner" | "1583_customer" | "cmra_search" | null
}

type CurrentStep = "prescreen" | "start" | "profile" | "documents" | "review"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<CurrentStep>("prescreen")
  const [screeningData, setScreeningData] = useState<ScreeningData>({
    userType: null,
    has1583a: null,
    witnessPreference: null,
    flow: null,
  })
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "assistant",
      text: "Aloha! Are you a CMRA owner, a customer of a CMRA, or looking for CMRA services?",
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

  const handleUserTypeSelection = async (userType: "cmra_owner" | "cmra_customer" | "individual") => {
    const userMessage: Message = {
      from: "user",
      text:
        userType === "cmra_owner"
          ? "I'm a CMRA Owner"
          : userType === "cmra_customer"
            ? "I'm a CMRA Customer"
            : "Looking for CMRA Services",
    }

    setMessages((prev) => [...prev, userMessage])
    setScreeningData((prev) => ({ ...prev, userType }))
    setIsTyping(true)

    // Determine next question based on user type
    let nextQuestion = ""
    if (userType === "cmra_owner") {
      nextQuestion = "Have you filed Form 1583-A with USPS yet?"
    } else if (userType === "cmra_customer") {
      nextQuestion = "Were you sent here by your CMRA? How would you like to complete witness verification?"
    } else {
      nextQuestion = "What's your ZIP code? I'll help you find nearby CMRAs."
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "assistant", text: nextQuestion }])
      setIsTyping(false)
    }, 1000)
  }

  const handleWitnessPreference = (preference: "in_person" | "video" | "ai_witness") => {
    const preferenceText =
      preference === "ai_witness"
        ? "AI Witness (Instant • 24/7)"
        : preference === "video"
          ? "Video Call with CMRA"
          : "In-Person at CMRA"

    const userMessage: Message = { from: "user", text: preferenceText }
    setMessages((prev) => [...prev, userMessage])
    setScreeningData((prev) => ({ ...prev, witnessPreference: preference, flow: "1583_customer" }))
    setIsTyping(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "assistant",
          text: "Perfect! Let's get started with your Form 1583. I'll need some basic information. What's your full name?",
        },
      ])
      setIsTyping(false)
      setCurrentStep("profile")
    }, 1000)
  }

  const handleHas1583A = (hasIt: boolean) => {
    const userMessage: Message = { from: "user", text: hasIt ? "Yes, I have filed it" : "No, not yet" }
    setMessages((prev) => [...prev, userMessage])
    setScreeningData((prev) => ({ ...prev, has1583a: hasIt }))
    setIsTyping(true)

    setTimeout(() => {
      if (!hasIt) {
        setMessages((prev) => [
          ...prev,
          {
            from: "assistant",
            text: "You need to file Form 1583-A first to register your CMRA business with USPS. Would you like guidance on how to do that?",
          },
        ])
        setScreeningData((prev) => ({ ...prev, flow: "1583a_registration" }))
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "assistant",
            text: "Great! Do you need to complete your personal Form 1583 as the CMRA owner?",
          },
        ])
      }
      setIsTyping(false)
    }, 1000)
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

          {/* Quick action buttons for pre-screening */}
          {currentStep === "prescreen" && messages.length === 1 && (
            <div className="px-3 md:px-4 pb-2 space-y-2">
              <Button
                onClick={() => handleUserTypeSelection("cmra_owner")}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent justify-start"
              >
                🏢 I'm a CMRA Owner
              </Button>
              <Button
                onClick={() => handleUserTypeSelection("cmra_customer")}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent justify-start"
              >
                📬 I'm a CMRA Customer
              </Button>
              <Button
                onClick={() => handleUserTypeSelection("individual")}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent justify-start"
              >
                🔍 Looking for CMRA Services
              </Button>
            </div>
          )}

          {/* Witness preference buttons for CMRA customers */}
          {currentStep === "prescreen" && screeningData.userType === "cmra_customer" && messages.length >= 3 && (
            <div className="px-3 md:px-4 pb-2 space-y-2">
              <Button
                onClick={() => handleWitnessPreference("ai_witness")}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent justify-start"
              >
                🤖 AI Witness (Instant • 24/7)
              </Button>
              <Button
                onClick={() => handleWitnessPreference("video")}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent justify-start"
              >
                📹 Video Call with CMRA
              </Button>
              <Button
                onClick={() => handleWitnessPreference("in_person")}
                variant="outline"
                size="sm"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent justify-start"
              >
                👤 In-Person at CMRA
              </Button>
            </div>
          )}

          {/* 1583-A response buttons for CMRA owners */}
          {currentStep === "prescreen" &&
            screeningData.userType === "cmra_owner" &&
            screeningData.has1583a === null &&
            messages.length >= 3 && (
              <div className="px-3 md:px-4 pb-2 space-y-2">
                <Button
                  onClick={() => handleHas1583A(true)}
                  variant="outline"
                  size="sm"
                  className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent"
                >
                  Yes, I have filed it
                </Button>
                <Button
                  onClick={() => handleHas1583A(false)}
                  variant="outline"
                  size="sm"
                  className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent"
                >
                  No, not yet
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
