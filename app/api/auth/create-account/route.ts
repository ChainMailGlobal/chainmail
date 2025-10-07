import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, caseId } = await req.json()

    // Validate input
    if (!email || !fullName) {
      return NextResponse.json({ error: "Email and full name are required" }, { status: 400 })
    }

    // Create Supabase admin client
    const supabase = await createServerClient()

    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    // Generate a temporary password (user will set their own via email)
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

    // Create user with email verification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          full_name: fullName,
          case_id: caseId,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mailboxhero.pro"}/dashboard`,
      },
    })

    if (authError) {
      console.error("[v0] Account creation error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // If caseId provided, link user to their case
    if (caseId && authData.user) {
      const { error: updateError } = await supabase.from("cases").update({ user_id: authData.user.id }).eq("id", caseId)

      if (updateError) {
        console.error("[v0] Case linking error:", updateError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account created. Please check email to verify and set password.",
      userId: authData.user?.id,
    })
  } catch (error) {
    console.error("[v0] Create account error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
