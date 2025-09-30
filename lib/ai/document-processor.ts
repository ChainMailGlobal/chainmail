import { generateObject } from "ai"
import { z } from "zod"

const documentDataSchema = z.object({
  documentType: z.string().describe("Type of ID document"),
  personalInfo: z.object({
    fullName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    dateOfBirth: z.string(),
    address: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
      })
      .optional(),
  }),
  documentInfo: z.object({
    documentNumber: z.string(),
    issueDate: z.string(),
    expirationDate: z.string(),
    issuingAuthority: z.string(),
  }),
  extractedText: z.string().describe("All text extracted from document"),
  confidence: z.number().min(0).max(100),
})

export type DocumentData = z.infer<typeof documentDataSchema>

export async function processDocument(documentUrl: string): Promise<DocumentData> {
  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: documentDataSchema,
    messages: [
      {
        role: "system",
        content: `You are a document processing AI specialized in extracting data from ID documents.
        Extract all relevant information accurately, including:
        - Personal information (name, DOB, address)
        - Document details (number, issue/expiration dates)
        - All visible text
        
        Be precise with dates and numbers. If information is unclear, note it in the confidence score.`,
      },
      {
        role: "user",
        content: `Extract all information from this ID document: ${documentUrl}`,
      },
    ],
    maxOutputTokens: 2000,
  })

  return object
}
