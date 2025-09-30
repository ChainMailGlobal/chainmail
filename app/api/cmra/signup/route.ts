import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const supabase = await createClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          full_name: body.fullName,
          role: body.role,
          user_type: "cmra_agent",
        },
      },
    })

    if (authError) {
      console.error("[v0] Error creating auth user:", authError)
      return NextResponse.json(
        {
          success: false,
          error: authError.message || "Failed to create user account",
        },
        { status: 400 },
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create user account",
        },
        { status: 400 },
      )
    }

    const { data: agentData, error: agentError } = await supabase
      .from("cmra_agents")
      .insert({
        id: authData.user.id,
        email: body.email,
        full_name: body.fullName,
        cmra_name: `${body.fullName}'s CMRA`, // Default CMRA name
        cmra_license: "PENDING", // Will be updated after verification
        phone: body.photoIdData?.phone || null,
        is_active: false, // Inactive until Form 1583-A is verified
      })
      .select()
      .single()

    if (agentError) {
      console.error("[v0] Error creating CMRA agent record:", agentError)

      // Clean up auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create CMRA agent record",
        },
        { status: 500 },
      )
    }

    console.log("[v0] CMRA agent created successfully:", agentData.id)

    try {
      const anchorResponse = await fetch(`${request.nextUrl.origin}/api/cmra/anchor-onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agentData.id,
          email: body.email,
          fullName: body.fullName,
          cmraName: agentData.cmra_name,
          cmraLicense: agentData.cmra_license,
          photoIdData: body.photoIdData,
          addressIdData: body.addressIdData,
          form1583aUrl: body.form1583aUrl,
          role: body.role,
        }),
      })

      if (anchorResponse.ok) {
        const anchorResult = await anchorResponse.json()
        console.log("[v0] Blockchain anchor successful:", anchorResult.transactionHash)
      } else {
        console.warn("[v0] Blockchain anchoring failed, but registration continues")
      }
    } catch (anchorError) {
      console.warn("[v0] Blockchain anchoring error (non-critical):", anchorError)
    }

    return NextResponse.json({
      success: true,
      message: "CMRA registration completed successfully",
      agentId: agentData.id,
      email: body.email,
      fullName: body.fullName,
      role: body.role,
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
