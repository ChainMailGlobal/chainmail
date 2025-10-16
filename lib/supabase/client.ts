export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase not configured. Auth features are disabled.")
    return null
  }

  try {
    // Dynamic import to prevent blocking if package isn't available
    const { createBrowserClient } = require("@supabase/ssr")
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn("[v0] Supabase package not available. Auth features are disabled.")
    return null
  }
}
