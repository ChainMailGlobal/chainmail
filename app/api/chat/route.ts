import type { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SYSTEM_PROMPT = `You are MailboxHero CMRA Agent helping users complete USPS Form 1583. Be friendly, use "Aloha", and guide step-by-step. Explain DMM 508.1.8 compliance clearly. Keep responses concise (2-3 sentences).`

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    const systemMessage = {
      role: "system" as const,
      content: SYSTEM_PROMPT + (context ? `\n\nContext:\n${JSON.stringify(context)}` : ""),
    }

    const openaiMessages = [
      systemMessage,
      ...messages.map((m: any) => ({
        role: m.from === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) controller.enqueue(encoder.encode(content))
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
