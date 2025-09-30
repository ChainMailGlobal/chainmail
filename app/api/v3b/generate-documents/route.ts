import { type NextRequest, NextResponse } from "next/server"
import { generateForm1583PDF, generateWitnessCertificate, type Form1583Data } from "@/lib/pdf/form-1583-generator"

export async function POST(request: NextRequest) {
  try {
    const data: Form1583Data = await request.json()

    console.log("[v0] Generating documents for session:", data.sessionId)

    // Generate Form 1583 PDF
    const form1583Blob = await generateForm1583PDF(data)

    // Generate Witness Certificate PDF
    const certificateBlob = await generateWitnessCertificate(data)

    // In production, upload to Blob storage and return URLs
    // For now, return success with mock URLs
    const form1583Url = `/documents/${data.sessionId}_form1583.pdf`
    const certificateUrl = `/documents/${data.sessionId}_certificate.pdf`

    console.log("[v0] Documents generated successfully")

    return NextResponse.json({
      success: true,
      form1583Url,
      certificateUrl,
      message: "Documents generated successfully",
    })
  } catch (error) {
    console.error("[v0] Error generating documents:", error)
    return NextResponse.json({ success: false, message: "Failed to generate documents" }, { status: 500 })
  }
}
