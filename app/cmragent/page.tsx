import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/actions/auth-actions"
import { CMRAgentDashboard } from "@/components/cmragent/cmra-dashboard"

export default async function CMRAgentPage() {
  const role = await getUserRole()

  if (!role) {
    redirect("/login")
  }

  if (role !== "cmra_agent") {
    redirect("/dashboard") // Regular users go to customer dashboard
  }

  return <CMRAgentDashboard />
}
