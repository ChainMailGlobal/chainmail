import { generateObject } from "ai"
import { z } from "zod"

const livenessDetectionSchema = z.object({
  isLive: z.boolean().describe("Whether the person is live and present"),
  livenessScore: z.number().min(0).max(100).describe("Liveness confidence score"),
  indicators: z.object({
    blinking: z.boolean().describe("Natural blinking detected"),
    headMovement: z.boolean().describe("Natural head movement detected"),
    facialExpressions: z.boolean().describe("Natural facial expressions detected"),
    depthPerception: z.boolean().describe("3D depth detected (not a flat photo)"),
    lighting: z.boolean().describe("Natural lighting variations detected"),
  }),
  fraudIndicators: z.array(z.string()).describe("Potential spoofing attempts"),
  recommendation: z.enum(["approve", "review", "reject"]),
})

export type LivenessDetectionResult = z.infer<typeof livenessDetectionSchema>

export async function detectLiveness(videoUrl: string): Promise<LivenessDetectionResult> {
  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: livenessDetectionSchema,
    messages: [
      {
        role: "system",
        content: `You are a liveness detection AI specialized in preventing spoofing attacks.
        Analyze the video for signs of a real, live person vs. a photo, video replay, or deepfake.
        
        Look for:
        - Natural blinking patterns (not too regular)
        - Micro-expressions and natural facial movements
        - Head rotation and 3D depth cues
        - Lighting consistency and shadows
        - Texture and skin details
        - Eye reflections and pupil reactions
        
        Flag any suspicious patterns that suggest spoofing.`,
      },
      {
        role: "user",
        content: `Analyze this video for liveness: ${videoUrl}`,
      },
    ],
    maxOutputTokens: 1500,
  })

  return object
}
