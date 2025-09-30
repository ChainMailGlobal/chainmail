"use server"

import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function getCurrentUser() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getUserRole() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  // Check if user is a CMRA agent
  const { data: cmraAgent } = await supabase.from("cmra_agents").select("id").eq("id", user.id).single()

  if (cmraAgent) {
    return "cmra_agent"
  }

  // Check if user is a regular customer
  const { data: customer } = await supabase.from("users").select("id").eq("id", user.id).single()

  if (customer) {
    return "customer"
  }

  return null
}
