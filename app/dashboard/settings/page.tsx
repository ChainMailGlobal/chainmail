import { redirect } from "next/navigation"
import { getUserDashboardData } from "@/lib/actions/dashboard-actions"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PasswordChangeForm } from "@/components/dashboard/password-change-form"
import { ProfileSettings } from "@/components/dashboard/profile-settings"

export default async function SettingsPage() {
  const data = await getUserDashboardData()

  if (data.error) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={data.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileSettings user={data.user} />
          <PasswordChangeForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
