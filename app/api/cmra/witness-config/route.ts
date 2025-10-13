import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch witness config for this CMRA
  const { data, error } = await supabase.from("cmra_witness_config").select("*").eq("cmra_id", user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("[v0] Error fetching witness config:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If no config exists, return defaults
  if (!data) {
    return NextResponse.json({
      ai_witness_enabled: true,
      live_video_enabled: true,
      in_person_enabled: true,
      ai_witness_price: null,
      live_video_price: null,
      in_person_price: null,
    })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const {
    ai_witness_enabled,
    live_video_enabled,
    in_person_enabled,
    ai_witness_price,
    live_video_price,
    in_person_price,
  } = body

  // Validate at least one method is enabled
  if (!ai_witness_enabled && !live_video_enabled && !in_person_enabled) {
    return NextResponse.json({ error: "At least one witness method must be enabled" }, { status: 400 })
  }

  // Upsert witness config
  const { data, error } = await supabase
    .from("cmra_witness_config")
    .upsert(
      {
        cmra_id: user.id,
        ai_witness_enabled,
        live_video_enabled,
        in_person_enabled,
        ai_witness_price: ai_witness_price || null,
        live_video_price: live_video_price || null,
        in_person_price: in_person_price || null,
      },
      { onConflict: "cmra_id" },
    )
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving witness config:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log("[v0] Witness config saved successfully for CMRA:", user.id)
  return NextResponse.json(data)
}
