"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Send, Paperclip, Shield } from "@/lib/icons"
import VoiceRealtimeMini from "./VoiceRealtimeMini"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

interface TranscriptItem {
  role: "user" | "agent"
  text: string
}

export default function CMRAChatWidget() {
  useEffect(() => {
    console.log("[v0] CMRAChatWidget MOUNTED")
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [autoStartVoice, setAutoStartVoice] = useState(false)
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false)
  const [pendingCameraCapture, setPendingCameraCapture] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const speakRef = useRef<((text: string) => Promise<void>) | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isTypingRef = useRef(false)
  const [chatMode, setChatMode] = useState<"voice" | "text" | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = `sess_${Math.random().toString(36).substring(2, 15)}`
      console.log("[v0] Generated new session ID:", newSessionId)
      setSessionId(newSessionId)
      localStorage.setItem("cmra_session_id", newSessionId)
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    if (isOpen && isChatStarted && inputRef.current && !voiceOn) {
      if (!isTypingRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, isChatStarted, voiceOn])

  const handleInputFocus = () => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }, 300)
    }
  }

  const handleChatAreaClick = () => {
    if (isChatStarted && inputRef.current && !voiceOn) {
      inputRef.current.focus()
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
    isTypingRef.current = false
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
        if (inputRef.current && !voiceOn) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }

  const handleVoiceToggle = () => {
    console.log("[v0] CMRAChatWidget - Voice button clicked, current state:", {
      voiceOn,
      autoStartVoice,
    })
    setVoiceError(null)
    const newVoiceOn = !voiceOn
    if (newVoiceOn) {
      console.log("[v0] CMRAChatWidget - Enabling voice with auto-start")
      setAutoStartVoice(true)
      inputRef.current?.blur()
    } else {
      console.log("[v0] CMRAChatWidget - Disabling voice")
      setAutoStartVoice(false)
      setVoiceOn(false)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
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

    const tempFile = file

    const handleSelection = (documentType: "photo_id" | "proof_address") => {
      setShowDocumentTypeModal(false)
      uploadFile(tempFile, documentType)
    }
    ;(window as any).__pendingFileUpload = handleSelection
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    isTypingRef.current = e.target.value.length > 0
  }

  const handleClose = () => {
    console.log("[v0] Closing chat and clearing session")
    setIsOpen(false)
    setIsChatStarted(false)
    setMessages([])
    setVoiceOn(false)
    setVoiceError(null)
    setAutoStartVoice(false)
    setSessionId(null)
    setTranscript([])
    setChatMode(null)
    localStorage.removeItem("cmra_session_id")
  }

  const handleModeSelection = (mode: "voice" | "text") => {
    setChatMode(mode)
    setIsChatStarted(true)
    console.log(`[v0] Chat mode selected: ${mode}`)
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

          {!isChatStarted ? (
            <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Chat Mode</h3>
                <p className="text-sm text-gray-600">How would you like to communicate?</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleModeSelection("voice")}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl mb-3"
                >
                  Start Voice Chat
                </button>

                <button
                  onClick={() => handleModeSelection("text")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Start Text Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" onClick={handleChatAreaClick}>
                {transcript.length > 0 && (
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="text-xs font-semibold text-indigo-700 mb-2">Voice Conversation:</div>
                    <div className="space-y-2">
                      {transcript.map((item, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-2 rounded ${
                            item.role === "user" ? "bg-blue-50 text-blue-900" : "bg-purple-50 text-purple-900"
                          }`}
                        >
                          <div className="font-semibold mb-1">{item.role === "user" ? "You said:" : "CMRAi :"}</div>
                          <div>{item.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

              {chatMode === "voice" && (
                <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
                  {voiceError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">Voice Error:</p>
                      <p className="text-xs text-red-600 mt-1">{voiceError}</p>
                    </div>
                  )}
                  <div className="hidden">
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
                      onTranscriptUpdate={(newTranscript) => {
                        setTranscript(newTranscript)
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={handleInputFocus}
                    placeholder={chatMode === "voice" ? "Type to override voice..." : "Type your message..."}
                    autoFocus={chatMode === "text"}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {chatMode === "voice" && voiceOn && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-indigo-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Voice active - listening</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
