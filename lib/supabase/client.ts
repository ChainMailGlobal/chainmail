let createClient: any = null

try {
  // Try to import Supabase, but don't fail if it's not available
  const supabaseModule = await import("@supabase/supabase-js")
  createClient = supabaseModule.createClient
} catch (error) {
  console.warn("[v0] Supabase package not available. Auth features are disabled.")
}

export function getSupabaseClient() {
  // If Supabase package isn't available, return null
  if (!createClient) {
    return null
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If the URL is encrypted (doesn't start with http), use fallback
  const supabaseUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : "https://jvwfqjzwavmkyxwwwidd.supabase.co"

  // If the key is encrypted (contains base64-like characters without proper format), return null
  const supabaseAnonKey = rawKey && rawKey.length > 100 && !rawKey.startsWith("eyJ") ? null : rawKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase not configured. Auth features are disabled.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
