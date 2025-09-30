import { type NextRequest, NextResponse } from "next/server"

interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  fullName: string
  role: "owner" | "manager" | "employee"
  photoIdData: any
  addressIdData: any
  photoIdType: string
  addressIdType: string
  form1583aUrl: string
}

function mapRoleToBackend(cmraRole: "owner" | "manager" | "employee"): "admin" | "employee" | "customer" {
  switch (cmraRole) {
    case "owner":
      return "admin"
    case "manager":
    case "employee":
      return "employee"
    default:
      return "customer"
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()

    console.log("[v0] CMRA Registration Request:", {
      name: body.fullName,
      email: body.email,
      role: body.role,
      photoIdType: body.photoIdType,
      addressIdType: body.addressIdType,
      timestamp: new Date().toISOString(),
    })

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-replit-backend.replit.dev"
    const backendRole = mapRoleToBackend(body.role)

    const backendResponse = await fetch(`${backendUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: body.email.split("@")[0], // Use email prefix as username
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        role: backendRole,
        // Include CMRA-specific data in metadata
        metadata: {
          cmraRole: body.role,
          photoIdData: body.photoIdData,
          addressIdData: body.addressIdData,
          photoIdType: body.photoIdType,
          addressIdType: body.addressIdType,
          form1583aUrl: body.form1583aUrl,
        },
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      console.error("[v0] Backend signup failed:", errorData)

      let errorMsg = errorData.error || "Registration failed"

      if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
        errorMsg = "This email address is already registered. Please use a different email or try logging in."
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: backendResponse.status },
      )
    }

    const result = await backendResponse.json()

    console.log("[v0] Backend signup successful:", result)

    return NextResponse.json({
      success: true,
      message: "CMRA registration completed successfully",
      userId: result.user?.id,
      email: body.email,
      fullName: body.fullName,
      role: body.role,
      backendRole: backendRole,
      dashboardUrl: result.dashboardUrl || `${backendUrl}/dashboard`,
      redirectTo: result.redirectTo || result.dashboardUrl || `${backendUrl}/dashboard`,
    })
  } catch (error) {
    console.error("[v0] Error processing CMRA signup:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process registration",
      },
      { status: 500 },
    )
  }
}
