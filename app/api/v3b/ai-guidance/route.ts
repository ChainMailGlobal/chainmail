import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionStep, sessionData, previousSteps } = body

    if (!sessionStep) {
      return NextResponse.json({ error: "Session step is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an AI witness assistant guiding a customer through a live video witness session for USPS Form 1583 verification.

Current Step: ${sessionStep}
Session Data: ${JSON.stringify(sessionData || {})}
Previous Steps Completed: ${JSON.stringify(previousSteps || [])}

Provide clear, friendly, step-by-step instructions for what the customer needs to do RIGHT NOW.

Guidelines:
- Use simple, conversational language (5th grade reading level)
- Be encouraging and supportive
- Give specific, actionable instructions
- Mention what will happen next
- Keep it brief (2-4 sentences maximum)
- Address the customer directly using "you"
- If they've completed previous steps, acknowledge their progress

Format as plain text, no markdown or special formatting.`,
    })

    return NextResponse.json({
      success: true,
      guidance: text,
      step: sessionStep,
    })
  } catch (error) {
    console.error("[v0] Error generating AI guidance:", error)
    return NextResponse.json({ error: "Failed to generate guidance" }, { status: 500 })
  }
}
