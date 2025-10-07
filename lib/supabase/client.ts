import { createBrowserClient } from "@supabase/ssr"

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase not configured. Auth features are disabled.")
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
