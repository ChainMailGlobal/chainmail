import { createClient } from "@supabase/supabase-js"

export function getSupabaseClient() {
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
