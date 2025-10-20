import { cookies } from "next/headers"

let createSupabaseClient: any = null

try {
  // Try to import Supabase, but don't fail if it's not available
  const supabaseModule = await import("@supabase/supabase-js")
  createSupabaseClient = supabaseModule.createClient
} catch (error) {
  console.warn("[v0] Supabase package not available. Server auth features are disabled.")
}

export async function createServerClient() {
  // If Supabase package isn't available, return null
  if (!createSupabaseClient) {
    return null
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabaseUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : "https://jvwfqjzwavmkyxwwwidd.supabase.co"

  const supabaseAnonKey = rawKey && rawKey.length > 100 && !rawKey.startsWith("eyJ") ? null : rawKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase not configured. Server auth features are disabled.")
    return null
  }

  const cookieStore = await cookies()

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
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
}

export async function createAdminClient() {
  // If Supabase package isn't available, return null
  if (!createSupabaseClient) {
    return null
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabaseUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : "https://jvwfqjzwavmkyxwwwidd.supabase.co"

  const supabaseServiceRoleKey =
    rawServiceKey && rawServiceKey.length > 100 && !rawServiceKey.startsWith("eyJ") ? null : rawServiceKey

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("[v0] Supabase admin not configured. Admin operations are disabled.")
    return null
  }

  const cookieStore = await cookies()

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
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
}

export const createClient = createServerClient
export const getSupabaseServer = createServerClient
