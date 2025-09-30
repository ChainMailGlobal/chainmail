import { generateObject } from "ai"
import { z } from "zod"

const signatureAnalysisSchema = z.object({
  isAuthentic: z.boolean().describe("Whether the signature appears authentic"),
  confidenceScore: z.number().min(0).max(100),
  characteristics: z.object({
    pressure: z.string().describe("Signature pressure pattern"),
    speed: z.string().describe("Signing speed"),
    fluidity: z.string().describe("Signature fluidity"),
    consistency: z.string().describe("Consistency with reference signatures"),
  }),
  fraudIndicators: z.array(z.string()).describe("Signs of forgery or tracing"),
  recommendation: z.enum(["accept", "review", "reject"]),
  notes: z.string().describe("Additional analysis notes"),
})

export type SignatureAnalysisResult = z.infer<typeof signatureAnalysisSchema>

export async function analyzeSignature({
  signatureUrl,
  referenceSignatureUrl,
}: {
  signatureUrl: string
  referenceSignatureUrl?: string
}): Promise<SignatureAnalysisResult> {
  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: signatureAnalysisSchema,
    messages: [
      {
        role: "system",
        content: `You are a signature verification expert AI.
        Analyze signatures for authenticity by examining:
        - Pressure patterns and pen strokes
        - Speed and fluidity of signing
        - Natural variations vs. traced/copied patterns
        - Consistency with reference signatures
        - Signs of hesitation or unnatural movements
        
        Provide detailed analysis for forensic review.`,
      },
      {
        role: "user",
        content: `Analyze this signature: ${signatureUrl}${referenceSignatureUrl ? `. Compare with reference: ${referenceSignatureUrl}` : ""}`,
      },
    ],
    maxOutputTokens: 1500,
  })

  return object
}
