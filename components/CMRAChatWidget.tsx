"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Send, Paperclip, Shield, Mic, Video } from "@/lib/icons"
import VoiceRealtimeMini from "./VoiceRealtimeMini"

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENT_BACKEND_BASE || ""

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
  isStreaming?: boolean
}

export default function CMRAChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasExistingSession, setHasExistingSession] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [voiceOn, setVoiceOn] = useState(false)
  const [showVoiceControls, setShowVoiceControls] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const speakRef = useRef<((text: string) => Promise<void>) | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
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
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && isChatStarted) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isChatStarted])

  const loadHistory = async () => {
    if (!sessionId) return

    setIsLoadingHistory(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/history?session_id=${sessionId}`)

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

  const sendMessageWithStreaming = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    const streamingId = `streaming-${Date.now()}`
    const streamingMessage: Message = {
      id: streamingId,
      text: "",
      sender: "agent",
      timestamp: new Date(),
      isStreaming: true,
    }
    setMessages((prev) => [...prev, streamingMessage])
    setStreamingMessageId(streamingId)

    try {
      const streamUrl = `${BACKEND_URL}/api/chat/stream?message=${encodeURIComponent(messageText)}&session_id=${sessionId || ""}`
      console.log("[v0] Attempting to connect to streaming endpoint:", streamUrl)

      const eventSource = new EventSource(streamUrl)
      eventSourceRef.current = eventSource

      let fullResponse = ""
      let hasReceivedData = false

      eventSource.addEventListener("token", (event) => {
        hasReceivedData = true
        const data = JSON.parse(event.data)
        fullResponse += data.chunk

        setMessages((prev) => prev.map((msg) => (msg.id === streamingId ? { ...msg, text: fullResponse } : msg)))
      })

      eventSource.addEventListener("done", (event) => {
        const data = JSON.parse(event.data)

        if (data.session_id) {
          setSessionId(data.session_id)
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingId
              ? { ...msg, text: fullResponse || data.reply || "I'm here to help!", isStreaming: false }
              : msg,
          ),
        )

        setStreamingMessageId(null)
        setIsLoading(false)
        eventSource.close()
        eventSourceRef.current = null
      })

      eventSource.addEventListener("error", async (event: Event) => {
        console.log("[v0] EventSource error event:", {
          readyState: eventSource.readyState,
          url: streamUrl,
          hasReceivedData,
        })

        eventSource.close()
        eventSourceRef.current = null

        // If we haven't received any data, fall back to JSON
        if (!hasReceivedData) {
          console.log("[v0] No data received from stream, falling back to JSON POST")
          setMessages((prev) => prev.filter((msg) => msg.id !== streamingId))
          setStreamingMessageId(null)
          await sendMessageJSON(messageText)
        } else {
          // If we got partial data, just finalize what we have
          console.log("[v0] Partial data received, finalizing stream")
          setMessages((prev) => prev.map((msg) => (msg.id === streamingId ? { ...msg, isStreaming: false } : msg)))
          setStreamingMessageId(null)
          setIsLoading(false)
        }
      })

      // Timeout fallback after 30 seconds
      setTimeout(() => {
        if (eventSourceRef.current) {
          console.log("[v0] Streaming timeout after 30s, falling back to JSON")
          eventSource.close()
          eventSourceRef.current = null

          if (!hasReceivedData) {
            setMessages((prev) => prev.filter((msg) => msg.id !== streamingId))
            setStreamingMessageId(null)
            sendMessageJSON(messageText)
          }
        }
      }, 30000)
    } catch (error) {
      console.error("[v0] Streaming setup failed:", error)
      setMessages((prev) => prev.filter((msg) => msg.id !== streamingId))
      setStreamingMessageId(null)
      await sendMessageJSON(messageText)
    }
  }

  const sendMessageJSON = async (messageText: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
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
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const messageText = inputValue

    // Try streaming first, will fall back to JSON if streaming fails
    await sendMessageWithStreaming(messageText)
  }

  const handleVoiceToggle = () => {
    setVoiceError(null)
    setShowVoiceControls(!showVoiceControls)
  }

  const handleCameraClick = () => {
    if (isLoading) return

    console.log("[v0] Camera button clicked")
    console.log("[v0] BACKEND_URL for upload:", BACKEND_URL || "(empty - using relative URL)")

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment" as any // Use rear camera on mobile

    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0]
      if (file) {
        console.log("[v0] Camera captured file:", file.name, file.type, file.size)
        await uploadFile(file)
      } else {
        console.log("[v0] No file selected from camera")
      }
    }

    input.onerror = (error) => {
      console.error("[v0] Camera input error:", error)
    }

    input.click()
  }

  const uploadFile = async (file: File) => {
    setIsLoading(true)

    try {
      const uploadUrl = `${BACKEND_URL}/api/upload`
      console.log("[v0] Uploading file to:", uploadUrl)
      console.log("[v0] File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      const formData = new FormData()
      formData.append("file", file)

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

      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Uploaded: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fileMessage])

      const chatUrl = `${BACKEND_URL}/api/chat`
      console.log("[v0] Sending file info to chat:", chatUrl)

      const fileInfoResponse = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `I've uploaded a file: ${file.name}`,
          session_id: sessionId,
          fileUrl: data.fileUrl,
          fileKey: data.fileKey,
        }),
      })

      if (fileInfoResponse.ok) {
        const chatData = await fileInfoResponse.json()
        if (chatData.session_id) {
          setSessionId(chatData.session_id)
        }

        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: chatData.reply || "I've received your file!",
          sender: "agent",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentResponse])
      } else {
        console.error("[v0] Chat response failed:", fileInfoResponse.status)
      }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    await uploadFile(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 active:scale-95"
          aria-label="Open CMRAi chat"
        >
          <Shield className="w-8 h-8" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 sm:bottom-6 sm:right-6 sm:left-auto z-[9999] sm:w-[420px] rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
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
              onClick={() => {
                setIsOpen(false)
                setIsChatStarted(false)
                setMessages([])
                setVoiceOn(false)
                setShowVoiceControls(false)
                setVoiceError(null)
                if (eventSourceRef.current) {
                  eventSourceRef.current.close()
                  eventSourceRef.current = null
                }
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isChatStarted ? (
            <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
              <div className="relative inline-block mb-4 sm:mb-6 mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                  0
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                {hasExistingSession ? "Welcome Back!" : "Start Your Form 1583"}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 sm:mb-8">
                {hasExistingSession
                  ? "Continue your previous conversation or start fresh."
                  : "Chat with our AI agent to complete your USPS Form 1583 in minutes with full witness verification."}
              </p>

              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-4">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
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
              )}

              <p className="text-xs text-gray-600 mt-3 sm:mt-4 font-medium">
                Voice, camera, and upload capabilities included
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                      {message.isStreaming && (
                        <div className="flex gap-1 mt-2">
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
                      )}
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-indigo-100" : "text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && !streamingMessageId && (
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
                <div className="px-4 py-3 bg-indigo-50 border-t border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-900">Voice Controls</span>
                    <button
                      onClick={() => {
                        setShowVoiceControls(false)
                        setVoiceError(null)
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs"
                    >
                      Hide
                    </button>
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
                    onReady={(api) => {
                      speakRef.current = api.speak
                      setVoiceOn(true)
                      setVoiceError(null)
                      console.log("[v0] Voice session ready")
                    }}
                  />
                </div>
              )}

              <div className="px-4 py-2 bg-white border-t border-gray-100">
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

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
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
