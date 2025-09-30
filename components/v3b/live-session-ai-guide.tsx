"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Volume2, VolumeX, Minimize2 } from "lucide-react"
import { generateText } from "ai"

interface LiveSessionAIGuideProps {
  sessionStep: string
  sessionData?: Record<string, any>
  onStepComplete?: () => void
  autoSpeak?: boolean
}

export function LiveSessionAIGuide({
  sessionStep,
  sessionData,
  onStepComplete,
  autoSpeak = false,
}: LiveSessionAIGuideProps) {
  const [guidance, setGuidance] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(autoSpeak)

  useEffect(() => {
    generateGuidance()
  }, [sessionStep])

  const generateGuidance = async () => {
    setIsLoading(true)

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `You are an AI witness assistant guiding a customer through a live video witness session for USPS Form 1583 verification.

Current Step: ${sessionStep}
Session Data: ${JSON.stringify(sessionData || {})}

Provide clear, friendly, step-by-step instructions for what the customer needs to do RIGHT NOW. 

Guidelines:
- Use simple, conversational language
- Be encouraging and supportive
- Give specific actions (e.g., "Hold your ID up to the camera")
- Mention what will happen next
- Keep it brief (2-4 sentences)
- Address the customer directly using "you"

Format as plain text, no markdown.`,
      })

      setGuidance(text)

      // Auto-speak if enabled
      if (speechEnabled && "speechSynthesis" in window) {
        speakGuidance(text)
      }
    } catch (error) {
      console.error("[v0] Error generating AI guidance:", error)
      setGuidance(getDefaultGuidance(sessionStep))
    } finally {
      setIsLoading(false)
    }
  }

  const speakGuidance = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      speakGuidance(guidance)
    }
  }

  const getDefaultGuidance = (step: string): string => {
    const guidanceMap: Record<string, string> = {
      welcome:
        "Welcome to your AI-witnessed Form 1583 verification session. I'll guide you through each step to make this quick and easy. Let's get started!",
      "id-verification":
        "Please hold your government-issued photo ID up to the camera. Make sure all four corners are visible and the text is clear and readable.",
      "liveness-check":
        "Now I need to verify you're a real person. Please follow the on-screen prompts: look left, look right, and smile. This only takes a few seconds.",
      "form-review":
        "Great! Now let's review your Form 1583 information together. I'll read each section aloud, and you can confirm everything is correct.",
      signature:
        "Time to sign your form. Use your finger or stylus to sign in the box below, just like you would on paper. Take your time to make it clear.",
      "video-recording":
        "I'm now recording your verbal confirmation. Please state your full name and confirm that you've reviewed and agree to the information on Form 1583.",
      completion:
        "Excellent! Your verification is complete. Your Form 1583 has been digitally witnessed and will be submitted to USPS. You'll receive a confirmation email shortly.",
    }

    return guidanceMap[step] || "Please follow the on-screen instructions to continue."
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Guide
          {isSpeaking && <Volume2 className="h-4 w-4 ml-2 animate-pulse" />}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="border-2 border-blue-200 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-blue-600" />
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                  </span>
                )}
              </div>
              <div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">
                  AI Witness Guide
                </Badge>
                <p className="text-xs text-slate-600 mt-1">Step: {sessionStep.replace(/-/g, " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className="h-8 w-8 p-0"
                title={speechEnabled ? "Disable voice" : "Enable voice"}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-blue-600 py-4">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span>Preparing guidance...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-slate-700 leading-relaxed">{guidance}</p>
              </div>

              <div className="flex items-center gap-2">
                {speechEnabled && (
                  <Button type="button" variant="outline" size="sm" onClick={toggleSpeech} className="flex-1 bg-white">
                    {isSpeaking ? (
                      <>
                        <VolumeX className="h-4 w-4 mr-2" />
                        Stop Speaking
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Repeat Instructions
                      </>
                    )}
                  </Button>
                )}
                {onStepComplete && (
                  <Button
                    type="button"
                    onClick={onStepComplete}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Continue
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
