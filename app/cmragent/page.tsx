import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/actions/auth-actions"
import { getCMRADashboardData } from "@/lib/actions/cmra-dashboard-actions"
import { CMRAgentDashboard } from "@/components/cmragent/cmra-dashboard"

export default async function CMRAgentPage() {
  const role = await getUserRole()

  if (!role) {
    redirect("/login")
  }

  if (role !== "cmra_agent") {
    redirect("/dashboard")
  }

  const dashboardData = await getCMRADashboardData()

  if (dashboardData.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h1>
          <p className="mt-2 text-muted-foreground">{dashboardData.error}</p>
        </div>
      </div>
    )
  }

  return <CMRAgentDashboard data={dashboardData} />
}
