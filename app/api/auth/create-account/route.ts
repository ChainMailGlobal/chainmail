import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, password, caseId } = await req.json()

    // Validate input
    if (!email || !fullName) {
      return NextResponse.json({ error: "Email and full name are required" }, { status: 400 })
    }

    console.log("[v0] Creating account for:", email)
    console.log("[v0] SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log("[v0] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

    const supabase = await createAdminClient()

    if (!supabase) {
      console.error("[v0] Supabase admin client is null - check SUPABASE_SERVICE_ROLE_KEY")
      return NextResponse.json(
        {
          error:
            "Supabase admin not configured. Please add SUPABASE_SERVICE_ROLE_KEY environment variable with your service_role key from Supabase Dashboard > Settings > API.",
        },
        { status: 500 },
      )
    }

    const userPassword = password || Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

    const shouldAutoConfirm = !!password

    // Create user with email verification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: userPassword,
      options: {
        data: {
          full_name: fullName,
          case_id: caseId,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mailboxhero.pro"}/dashboard`,
        ...(shouldAutoConfirm && { emailRedirectTo: undefined }),
      },
    })

    if (authError) {
      console.error("[v0] Account creation error:", authError)
      console.error("[v0] Error code:", authError.code)
      console.error("[v0] Error status:", authError.status)

      if (authError.status === 401 || authError.message?.includes("Invalid API key")) {
        return NextResponse.json(
          {
            error:
              "Invalid Supabase API key. Please verify SUPABASE_SERVICE_ROLE_KEY is set to your service_role key (not anon key) from Supabase Dashboard > Settings > API > service_role.",
          },
          { status: 500 },
        )
      }

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

    const message = shouldAutoConfirm
      ? "Account created successfully! You can now sign in."
      : "Account created. Please check email to verify and set password."

    return NextResponse.json({
      success: true,
      message,
      userId: authData.user?.id,
    })
  } catch (error) {
    console.error("[v0] Create account error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
