import { streamText } from "ai"
import type { NextRequest } from "next/server"

export const maxDuration = 30

const PRESCREEN_PROMPT = `You are the MailboxHero Pre-Screening Agent. Determine user type and path:

1. CMRA Owner - Check if they have 1583-A, then their 1583, then ready for customers
2. CMRA Customer - Ask for witness preference (AI/Video/In-Person)
3. Individual - Get ZIP code for CMRA search

Analyze the conversation and return JSON with this structure:
{
  "userType": "cmra_owner|cmra_customer|individual|unknown",
  "has1583a": true|false|null,
  "witnessPreference": "in_person|video|ai_witness|null",
  "nextQuestion": "string with the next question to ask",
  "readyToStart": true|false,
  "flow": "1583a_registration|1583_owner|1583_customer|cmra_search|unknown"
}

Be conversational and friendly. Use "Aloha" in greetings.`

export async function POST(req: NextRequest) {
  try {
    const { messages, userResponses } = await req.json()

    const conversationText = messages
      .map((m: any) => `${m.from === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n")

    const result = streamText({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: PRESCREEN_PROMPT },
        {
          role: "user",
          content: `Analyze this conversation and determine the user type and next steps:\n\n${conversationText}\n\nUser responses: ${JSON.stringify(userResponses)}`,
        },
      ],
      temperature: 0.3,
      abortSignal: req.signal,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Prescreen API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process prescreen request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
