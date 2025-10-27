"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, FileText, Video, Clock, Shield, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "@/lib/actions/auth-actions"
import CMRAChatWidget from "@/components/CMRAChatWidget"

interface DashboardLayoutProps {
  children: ReactNode
  user: {
    id: string
    email?: string
    fullName: string
  }
  invitationId?: string
  shouldOpenChat?: boolean
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Sessions", href: "/dashboard/sessions", icon: Video },
  { name: "Timeline", href: "/dashboard/timeline", icon: Clock },
  { name: "Compliance", href: "/dashboard/compliance", icon: Shield },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children, user, invitationId, shouldOpenChat }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/") // Redirect to home page after logout
  }

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <Shield className="h-6 w-6" />
          <span>CMRAgent</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
          <p className="text-sm font-medium text-sidebar-accent-foreground">{user.fullName}</p>
          <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-border lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6" />
            <span>CMRAgent</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>

      <CMRAChatWidget invitationId={invitationId} autoOpen={shouldOpenChat} />
    </div>
  )
}
