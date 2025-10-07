import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import type { NextRequest } from "next/server"

export const maxDuration = 30

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are MailboxHero CMRA Agent helping users complete USPS Form 1583. Be friendly, use "Aloha", and guide step-by-step. Explain DMM 508.1.8 compliance clearly. Keep responses concise (2-3 sentences).`

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Chat API called")
    const { messages, context } = await req.json()
    console.log("[v0] Received messages:", messages?.length)

    const formattedMessages = messages.map((m: any) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }))

    const allMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT + (context ? `\n\nContext:\n${JSON.stringify(context)}` : ""),
      },
      ...formattedMessages,
    ]

    console.log("[v0] Calling streamText with OpenAI gpt-4o")

    const result = streamText({
      model: openai("gpt-4o"),
      messages: allMessages,
      temperature: 0.7,
      maxTokens: 500,
      abortSignal: req.signal,
    })

    console.log("[v0] Streaming response started")

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
