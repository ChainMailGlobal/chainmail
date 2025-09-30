import { streamText } from "ai"
import { createStreamableValue } from "@ai-sdk/rsc"

export async function getWitnessAssistance(
  question: string,
  context: {
    sessionType: "v3a" | "v3b"
    currentStep?: string
    sessionData?: Record<string, any>
  },
) {
  const systemPrompt = `You are a helpful AI assistant for CMRA witness services.
  You help both customers and agents through the witness verification process.
  
  Current context:
  - Session type: ${context.sessionType === "v3a" ? "In-Person (V3a)" : "Remote Scheduled (V3b)"}
  - Current step: ${context.currentStep || "Not specified"}
  
  Provide clear, concise guidance on:
  - What documents are needed
  - How to complete each step
  - Troubleshooting common issues
  - Legal requirements for Form 1583
  - Privacy and security information
  
  Be professional, friendly, and accurate.`

  const result = streamText({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: question,
      },
    ],
    maxOutputTokens: 1000,
    temperature: 0.7,
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}
