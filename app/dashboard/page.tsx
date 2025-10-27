import { redirect } from "next/navigation"
import { getUserDashboardData } from "@/lib/actions/dashboard-actions"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { WelcomePanel } from "@/components/dashboard/welcome-panel"
import { DocumentVault } from "@/components/dashboard/document-vault"
import { SessionManager } from "@/components/dashboard/session-manager"
import { ComplianceTimeline } from "@/components/dashboard/compliance-timeline"
import { NotificationsPanel } from "@/components/dashboard/notifications-panel"
import { SupportResources } from "@/components/dashboard/support-resources"
import { PlanSelector } from "@/components/dashboard/plan-selector"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { invitation_id?: string; openChat?: string }
}) {
  const data = await getUserDashboardData()

  if (data.error) {
    redirect("/login")
  }

  const invitationId = searchParams.invitation_id
  const shouldOpenChat = searchParams.openChat === "true"

  return (
    <DashboardLayout user={data.user} invitationId={invitationId} shouldOpenChat={shouldOpenChat}>
      <div className="space-y-6">
        <WelcomePanel user={data.user} stats={data.stats} />

        {!data.subscription?.hasActiveSubscription && (
          <PlanSelector
            currentPlan={data.subscription?.currentPlan}
            hasActiveSubscription={data.subscription?.hasActiveSubscription || false}
          />
        )}

        {data.subscription?.hasActiveSubscription && (
          <PlanSelector
            currentPlan={data.subscription?.currentPlan}
            hasActiveSubscription={data.subscription?.hasActiveSubscription}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <SessionManager sessions={data.sessions} />
          <NotificationsPanel sessions={data.sessions} />
        </div>

        <DocumentVault sessions={data.sessions} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ComplianceTimeline events={data.events} sessions={data.sessions} />
          </div>
          <div>
            <SupportResources />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
