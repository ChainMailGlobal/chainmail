import { cookies } from "next/headers"

let supabaseModuleCache: any = null
let importAttempted = false

async function getSupabaseModule() {
  if (importAttempted) {
    return supabaseModuleCache
  }

  importAttempted = true

  try {
    const supabaseModule = await import("@supabase/supabase-js")
    supabaseModuleCache = supabaseModule.createClient
    return supabaseModuleCache
  } catch (error) {
    console.warn("[v0] Supabase package not available. Server auth features are disabled.")
    return null
  }
}

export async function createServerClient() {
  const createClient = await getSupabaseModule()

  if (!createClient) {
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

  return createClient(supabaseUrl, supabaseAnonKey, {
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

export async function createAdminClient() {
  const createClient = await getSupabaseModule()

  if (!createClient) {
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

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
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
