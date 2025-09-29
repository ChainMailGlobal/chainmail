import { type NextRequest, NextResponse } from "next/server"

interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "owner" | "manager" | "employee"
  photoId: {
    type: string
    extractedData: any
  }
  addressId: {
    type: string
    extractedData: any
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()

    console.log("[v0] CMRA Registration Request:", {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      role: body.role,
      photoIdType: body.photoId.type,
      addressIdType: body.addressId.type,
      timestamp: new Date().toISOString(),
    })

    // TODO: Store in database (Supabase)
    // TODO: Generate Form 1583-A PDF
    // TODO: Send welcome email with SOP and onboarding instructions
    // TODO: Create user account with RBAC role

    return NextResponse.json({
      success: true,
      message: "CMRA registration initiated successfully",
      userId: `cmra_${Date.now()}`,
      form1583aUrl: "/api/forms/1583a-preview.pdf",
    })
  } catch (error) {
    console.error("[v0] Error processing CMRA signup:", error)
    return NextResponse.json({ success: false, message: "Failed to process registration" }, { status: 500 })
  }
}
