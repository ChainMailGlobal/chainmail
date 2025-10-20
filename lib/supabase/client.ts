let supabaseClientCache: any = null
let importAttempted = false

async function getSupabaseModule() {
  if (importAttempted) {
    return supabaseClientCache
  }

  importAttempted = true

  try {
    const supabaseModule = await import("@supabase/supabase-js")
    supabaseClientCache = supabaseModule.createClient
    return supabaseClientCache
  } catch (error) {
    console.warn("[v0] Supabase package not available. Auth features are disabled.")
    return null
  }
}

export async function getSupabaseClient() {
  const createClient = await getSupabaseModule()

  if (!createClient) {
    return null
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabaseUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : "https://jvwfqjzwavmkyxwwwidd.supabase.co"
  const supabaseAnonKey = rawKey && rawKey.length > 100 && !rawKey.startsWith("eyJ") ? null : rawKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase not configured. Auth features are disabled.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
