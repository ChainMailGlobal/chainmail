import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { org_id, bcg_username, bcg_password, crd_username, crd_password, allow_rpa_password_reset } = body

    // Validate required fields
    if (!org_id || !bcg_username || !bcg_password || !crd_username || !crd_password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user owns this CMRA
    const { data: cmra, error: cmraError } = await supabase
      .from("cmras")
      .select("id, owner_id")
      .eq("id", org_id)
      .single()

    if (cmraError || !cmra || cmra.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to manage this CMRA" }, { status: 403 })
    }

    // Encrypt passwords using pgcrypto (server-side encryption)
    // Note: In production, use a proper encryption service or Vault
    const { data: credentials, error: upsertError } = await supabase
      .from("usps_credentials")
      .upsert(
        {
          org_id,
          bcg_username,
          bcg_password_cipher: bcg_password, // TODO: Implement proper encryption
          crd_username,
          crd_password_cipher: crd_password, // TODO: Implement proper encryption
          allow_rpa_password_reset: allow_rpa_password_reset || false,
          status: "SUBMITTED",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "org_id",
        },
      )
      .select()
      .single()

    if (upsertError) {
      console.error("Error upserting credentials:", upsertError)
      return NextResponse.json({ error: "Failed to save credentials" }, { status: 500 })
    }

    // Create compliance job for RPA verification
    const { error: jobError } = await supabase.from("compliance_jobs").insert({
      type: "usps_credentials_verify",
      case_id: org_id,
      status: "QUEUED",
      payload: {
        org_id,
        bcg_username,
        crd_username,
      },
      created_at: new Date().toISOString(),
    })

    if (jobError) {
      console.error("Error creating compliance job:", jobError)
    }

    // Log audit event
    await supabase.from("audit_events").insert({
      kind: "usps_credentials_update",
      user_id: user.id,
      payload: {
        org_id,
        status: "SUBMITTED",
        action: "credentials_submitted",
      },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      credentials: {
        id: credentials.id,
        status: credentials.status,
        created_at: credentials.created_at,
      },
    })
  } catch (error) {
    console.error("Error in usps-credentials API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get org_id from query params
    const { searchParams } = new URL(request.url)
    const org_id = searchParams.get("org_id")

    if (!org_id) {
      return NextResponse.json({ error: "Missing org_id parameter" }, { status: 400 })
    }

    // Verify user owns this CMRA
    const { data: cmra, error: cmraError } = await supabase
      .from("cmras")
      .select("id, owner_id")
      .eq("id", org_id)
      .single()

    if (cmraError || !cmra || cmra.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch credentials (without passwords)
    const { data: credentials, error: fetchError } = await supabase
      .from("usps_credentials")
      .select("id, org_id, bcg_username, crd_username, allow_rpa_password_reset, status, created_at, updated_at")
      .eq("org_id", org_id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching credentials:", fetchError)
      return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
    }

    return NextResponse.json({
      credentials: credentials || null,
    })
  } catch (error) {
    console.error("Error in usps-credentials GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
