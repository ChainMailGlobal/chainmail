import { cookies } from "next/headers"

export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase not configured. Server auth features are disabled.")
    return null
  }

  try {
    // Dynamic import to prevent blocking if package isn't available
    const { createServerClient: createSupabaseServerClient } = require("@supabase/ssr")
    const cookieStore = await cookies()

    return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
  } catch (error) {
    console.warn("[v0] Supabase package not available. Server auth features are disabled.")
    return null
  }
}

export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("[v0] Supabase admin not configured. Admin operations are disabled.")
    return null
  }

  try {
    // Dynamic import to prevent blocking if package isn't available
    const { createServerClient: createSupabaseServerClient } = require("@supabase/ssr")
    const cookieStore = await cookies()

    return createSupabaseServerClient(supabaseUrl, supabaseServiceRoleKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignore cookie errors in Server Components
          }
        },
      },
    })
  } catch (error) {
    console.warn("[v0] Supabase package not available. Admin operations are disabled.")
    return null
  }
}

export async function createClient() {
  return createServerClient()
}

export const getSupabaseServer = createServerClient
