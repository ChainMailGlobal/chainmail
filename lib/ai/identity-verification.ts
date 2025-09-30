import { generateObject } from "ai"
import { z } from "zod"

// Schema for identity verification results
const identityVerificationSchema = z.object({
  isVerified: z.boolean().describe("Whether the identity is verified"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence score 0-100"),
  livenessScore: z.number().min(0).max(100).describe("Liveness detection score 0-100"),
  fraudFlags: z.array(z.string()).describe("List of potential fraud indicators"),
  faceMatch: z
    .object({
      isMatch: z.boolean(),
      similarity: z.number().min(0).max(100),
    })
    .describe("Face matching between video and ID document"),
  documentAnalysis: z.object({
    isAuthentic: z.boolean(),
    documentType: z.string(),
    expirationDate: z.string().optional(),
    issueDate: z.string().optional(),
  }),
  recommendations: z.array(z.string()).describe("Recommendations for the agent"),
})

export type IdentityVerificationResult = z.infer<typeof identityVerificationSchema>

export async function verifyIdentity({
  faceVideoUrl,
  idDocumentUrl,
  verbalAcknowledgment,
}: {
  faceVideoUrl: string
  idDocumentUrl: string
  verbalAcknowledgment?: string
}): Promise<IdentityVerificationResult> {
  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: identityVerificationSchema,
    messages: [
      {
        role: "system",
        content: `You are an expert identity verification AI for CMRA witness services. 
        Analyze the provided face video and ID document to verify identity.
        Check for:
        - Face matching between video and ID photo
        - Liveness indicators (blinking, head movement, natural expressions)
        - Document authenticity (security features, tampering signs)
        - Consistency in verbal acknowledgment
        
        Provide detailed fraud flags if anything seems suspicious.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Verify this identity. Face video: ${faceVideoUrl}, ID document: ${idDocumentUrl}${verbalAcknowledgment ? `, Verbal acknowledgment: "${verbalAcknowledgment}"` : ""}`,
          },
        ],
      },
    ],
    maxOutputTokens: 2000,
  })

  return object
}
