import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SessionDetailPage } from "@/components/dashboard/session-detail-page"

export default async function SessionDetailPageRoute({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/signup-v31")
  }

  const { data: session, error } = await supabase
    .from("witness_sessions")
    .select(`
      *,
      cmra_agent:cmra_agents(
        id,
        full_name,
        cmra_name,
        email
      )
    `)
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single()

  if (error || !session) {
    redirect("/dashboard")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <DashboardLayout
      user={{
        id: user.id,
        email: user.email,
        fullName: profile?.full_name || "User",
      }}
    >
      <SessionDetailPage session={session} />
    </DashboardLayout>
  )
}
