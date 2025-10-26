"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Send, Paperclip, Shield, Mic, Video } from "@/lib/icons"
import VoiceRealtimeMini from "./VoiceRealtimeMini"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export default function CMRAChatWidget() {
  useEffect(() => {
    console.log("[v0] CMRAChatWidget MOUNTED")
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      console.log("[v0] Chat widget OPENED")
    } else {
      console.log("[v0] Chat widget CLOSED")
    }
  }, [isOpen])

  const [chatMode, setChatMode] = useState<"voice" | "text" | null>(null)
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasExistingSession, setHasExistingSession] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [showVoiceControls, setShowVoiceControls] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [autoStartVoice, setAutoStartVoice] = useState(false)
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false)
  const [pendingCameraCapture, setPendingCameraCapture] = useState(false)
  const speakRef = useRef<((text: string) => Promise<void>) | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const savedSessionId = localStorage.getItem("cmra_session_id")
    if (savedSessionId) {
      setSessionId(savedSessionId)
      setHasExistingSession(true)
    }
  }, [])

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("cmra_session_id", sessionId)
    }
  }, [sessionId])

  useEffect(() => {
    if (isOpen && isChatStarted && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isChatStarted, messages.length])

  const handleChatAreaClick = () => {
    if (isChatStarted && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const loadHistory = async () => {
    if (!sessionId) return

    setIsLoadingHistory(true)
    try {
      const response = await fetch(`/api/chat/history?session_id=${sessionId}`)

      const contentType = response.headers.get("content-type")
      if (!response.ok || !contentType?.includes("application/json")) {
        console.log("[v0] History endpoint not available or returned non-JSON, starting fresh chat")
        startChat()
        return
      }

      const data = await response.json()

      if (data.messages && data.messages.length > 0) {
        const formattedMessages: Message[] = data.messages.map((msg: any, index: number) => ({
          id: `history-${index}`,
          text: msg.content || msg.text,
          sender: msg.role === "user" ? "user" : "agent",
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }))
        setMessages(formattedMessages)
        setIsChatStarted(true)
      } else {
        startChat()
      }
    } catch (error) {
      console.log("[v0] History loading failed, starting fresh chat:", error)
      startChat()
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const startChat = (continueSession = false) => {
    if (continueSession && sessionId) {
      loadHistory()
    } else {
      if (!continueSession) {
        setSessionId(null)
        localStorage.removeItem("cmra_session_id")
      }
      setIsChatStarted(true)
      setMessages([
        {
          id: "welcome",
          text: "Hello! I'm your CMRAgent assistant. I can help you complete your USPS Form 1583 with full witness verification. How can I assist you today?",
          sender: "agent",
          timestamp: new Date(),
        },
      ])
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const messageText = inputValue
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      if (data.session_id) {
        setSessionId(data.session_id)
      }

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm here to help!",
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentResponse])

      if (voiceOn && speakRef.current && data.reply) {
        console.log("[v0] Speaking agent response via voice")
        await speakRef.current(data.reply)
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleVoiceToggle = () => {
    console.log("[v0] CMRAChatWidget - Voice button clicked, current state:", {
      showVoiceControls,
      voiceOn,
      autoStartVoice,
    })
    setVoiceError(null)
    const newShowVoice = !showVoiceControls
    setShowVoiceControls(newShowVoice)
    if (newShowVoice) {
      console.log("[v0] CMRAChatWidget - Enabling voice controls with auto-start")
      setAutoStartVoice(true)
    } else {
      console.log("[v0] CMRAChatWidget - Disabling voice controls")
      setAutoStartVoice(false)
      setVoiceOn(false)
    }
  }

  const handleCameraClick = () => {
    if (isLoading) return

    console.log("[v0] Camera button clicked")
    setPendingCameraCapture(true)
    setShowDocumentTypeModal(true)
  }

  const handleDocumentTypeSelect = (documentType: "photo_id" | "proof_address") => {
    setShowDocumentTypeModal(false)

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment" as any

    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0]
      if (file) {
        console.log("[v0] Camera captured file:", file.name, file.type, file.size)
        await uploadFile(file, documentType)
      } else {
        console.log("[v0] No file selected from camera")
      }
      setPendingCameraCapture(false)
    }

    input.onerror = (error) => {
      console.error("[v0] Camera input error:", error)
      setPendingCameraCapture(false)
    }

    input.click()
  }

  const uploadFile = async (file: File, documentType: "photo_id" | "proof_address" = "photo_id") => {
    setIsLoading(true)

    try {
      const uploadUrl = "/api/upload"
      console.log("[v0] Uploading file to:", uploadUrl)
      console.log("[v0] File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        documentType,
      })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("kind", documentType)
      formData.append("case_id", sessionId || "pending")

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Upload response status:", response.status)
      console.log("[v0] Upload response content-type:", response.headers.get("content-type"))

      const contentType = response.headers.get("content-type")
      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Upload failed:", {
          status: response.status,
          contentType,
          error: errorText.substring(0, 200),
        })
        throw new Error(`Upload failed with status ${response.status}`)
      }

      if (!contentType?.includes("application/json")) {
        const responseText = await response.text()
        console.error("[v0] Upload endpoint returned non-JSON:", {
          status: response.status,
          contentType,
          preview: responseText.substring(0, 200),
        })
        throw new Error("Upload endpoint not available (returned HTML instead of JSON)")
      }

      const data = await response.json()
      console.log("[v0] Upload successful:", data)

      const label = documentType === "photo_id" ? "Photo ID" : "Proof of Address"
      const uploadMessage = `Uploaded ${label}: ${data.fileUrl || file.name}`

      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 ${uploadMessage}`,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fileMessage])

      await sendUploadMessage(uploadMessage, [
        {
          kind: documentType,
          url: data.fileUrl,
          name: file.name,
          type: file.type,
        },
      ])
    } catch (error) {
      console.error("[v0] Error uploading file:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Sorry, I couldn't upload that file. ${error instanceof Error ? error.message : "Please try again."}`,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendUploadMessage = async (messageText: string, attachments: any[]) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId,
          attachments,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      if (data.session_id) {
        setSessionId(data.session_id)
      }

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm here to help!",
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentResponse])

      if (voiceOn && speakRef.current && data.reply) {
        console.log("[v0] Speaking agent response via voice")
        await speakRef.current(data.reply)
      }
    } catch (error) {
      console.error("[v0] Error sending upload message:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error processing your upload. Please try again.",
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setShowDocumentTypeModal(true)
    setPendingCameraCapture(false)

    // Store the file temporarily
    const tempFile = file

    // Wait for user selection
    const handleSelection = (documentType: "photo_id" | "proof_address") => {
      setShowDocumentTypeModal(false)
      uploadFile(tempFile, documentType)
    }

    // This will be handled by the modal buttons
    ;(window as any).__pendingFileUpload = handleSelection
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const handleModeSelection = (mode: "voice" | "text") => {
    console.log("[v0] User selected mode:", mode)
    setChatMode(mode)

    if (mode === "voice") {
      // Auto-start voice mode
      setShowVoiceControls(true)
      setAutoStartVoice(true)
      setIsChatStarted(true)
    } else {
      // Start text mode
      startChat(false)
    }
  }

  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = `sess_${Math.random().toString(36).substring(2, 15)}`
      console.log("[v0] Generated new session ID:", newSessionId)
      setSessionId(newSessionId)
    }
  }, [isOpen, sessionId])

  const handleClose = () => {
    console.log("[v0] Closing chat and clearing session")
    setIsOpen(false)
    setChatMode(null)
    setIsChatStarted(false)
    setMessages([])
    setVoiceOn(false)
    setShowVoiceControls(false)
    setVoiceError(null)
    setAutoStartVoice(false)
    setSessionId(null) // Clear session ID
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => {
            console.log("[v0] Chat button clicked - opening chat")
            setIsOpen(true)
          }}
          className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 active:scale-95"
          aria-label="Open CMRAi chat"
        >
          <Shield className="w-8 h-8" />
        </button>
      )}

      {showDocumentTypeModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Paperclip className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select Document Type</h3>
              <p className="text-sm text-gray-600">What type of document are you uploading?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (pendingCameraCapture) {
                    handleDocumentTypeSelect("photo_id")
                  } else {
                    const handler = (window as any).__pendingFileUpload
                    if (handler) {
                      handler("photo_id")
                      delete (window as any).__pendingFileUpload
                    }
                  }
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-between group"
              >
                <span>Photo ID</span>
                <span className="text-sm opacity-80 group-hover:opacity-100">Driver's License, Passport, etc.</span>
              </button>

              <button
                onClick={() => {
                  if (pendingCameraCapture) {
                    handleDocumentTypeSelect("proof_address")
                  } else {
                    const handler = (window as any).__pendingFileUpload
                    if (handler) {
                      handler("proof_address")
                      delete (window as any).__pendingFileUpload
                    }
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-between group"
              >
                <span>Proof of Address</span>
                <span className="text-sm opacity-80 group-hover:opacity-100">Utility Bill, Bank Statement, etc.</span>
              </button>

              <button
                onClick={() => {
                  setShowDocumentTypeModal(false)
                  setPendingCameraCapture(false)
                  delete (window as any).__pendingFileUpload
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:right-6 sm:left-auto z-[9999] sm:w-[420px] rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden flex flex-col h-[90vh] max-h-[600px]">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">CMRAi</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!chatMode ? (
            <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center overflow-y-auto">
              <div className="relative inline-block mb-4 sm:mb-6 mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome to CMRAi</h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 sm:mb-8">
                Choose how you'd like to complete your USPS Form 1583 with full witness verification.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleModeSelection("voice")}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Mic className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Start Voice Chat</div>
                      <div className="text-sm opacity-90">Speak naturally with AI assistance</div>
                    </div>
                  </div>
                  <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">→</div>
                </button>

                <button
                  onClick={() => handleModeSelection("text")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Send className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Start Text Chat</div>
                      <div className="text-sm opacity-90">Type your responses at your own pace</div>
                    </div>
                  </div>
                  <div className="text-2xl opacity-50 transition-opacity">→</div>
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-6">Both modes include camera and document upload capabilities</p>
            </div>
          ) : !isChatStarted ? (
            <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center overflow-y-auto">
              {hasExistingSession && (
                <button
                  onClick={() => startChat(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Continue Conversation
                </button>
              )}
              <button
                onClick={() => startChat(false)}
                className={`w-full ${
                  hasExistingSession
                    ? "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                } px-6 py-3.5 rounded-xl font-semibold transition-all`}
              >
                {hasExistingSession ? "Start New Chat" : "Start Chat Now"}
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" onClick={handleChatAreaClick}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-indigo-100" : "text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-2.5">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {showVoiceControls && (
                <div className="flex-shrink-0 px-4 py-3 bg-indigo-50 border-t border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-900">Voice Controls</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowVoiceControls(false)
                          setVoiceError(null)
                          setAutoStartVoice(false)
                          setVoiceOn(false)
                          setChatMode("text")
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2 py-1 rounded bg-white hover:bg-indigo-50 transition-colors"
                      >
                        Switch to Text
                      </button>
                      <button
                        onClick={() => {
                          setShowVoiceControls(false)
                          setVoiceError(null)
                          setAutoStartVoice(false)
                          setVoiceOn(false)
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-xs"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                  {voiceError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">Voice Error:</p>
                      <p className="text-xs text-red-600 mt-1">{voiceError}</p>
                      <p className="text-xs text-red-500 mt-2">
                        Make sure AGENT_BACKEND_BASE is set and the backend /api/voice/token endpoint is working.
                      </p>
                    </div>
                  )}
                  <VoiceRealtimeMini
                    voicePreset="alloy"
                    buttonLabel="Start Voice"
                    stopLabel="Stop Voice"
                    autoStart={autoStartVoice}
                    sessionId={sessionId || undefined}
                    onReady={async (api) => {
                      speakRef.current = api.speak
                      setVoiceOn(true)
                      setVoiceError(null)
                      setAutoStartVoice(false)
                      console.log("[v0] Voice session ready")
                    }}
                    onError={(error) => {
                      setVoiceError(error)
                      setVoiceOn(false)
                      setAutoStartVoice(false)
                    }}
                  />
                </div>
              )}

              <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-gray-100">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleVoiceToggle}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      showVoiceControls
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                    title="Toggle voice controls"
                  >
                    <Mic className="w-4 h-4" />
                    <span className="text-xs">Voice</span>
                  </button>
                  <button
                    onClick={handleCameraClick}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Capture photo"
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-xs">Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload file"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="text-xs">Upload</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>
              </div>

              <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    autoFocus
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
