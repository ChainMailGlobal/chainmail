"use client"

import { HelpCircle, MessageSquare, BookOpen, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SupportResources() {
  const resources = [
    {
      title: "Complete Onboarding",
      description: "Step-by-step guide to finish your setup",
      icon: BookOpen,
      href: "/help/onboarding",
    },
    {
      title: "How to Upload ID",
      description: "Learn about acceptable ID documents",
      icon: HelpCircle,
      href: "/help/upload-id",
    },
    {
      title: "Witness Session Guide",
      description: "What to expect during your session",
      icon: MessageSquare,
      href: "/help/witness-session",
    },
  ]

  return (
    <Card className="dashboard-card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Support & Resources</h2>
      </div>

      <div className="mt-6 space-y-3">
        {resources.map((resource) => (
          <Link key={resource.title} href={resource.href}>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <resource.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{resource.title}</p>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Need Help?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Our compliance support team is available to assist you with any questions
            </p>
            <Button size="sm" className="mt-3 gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
