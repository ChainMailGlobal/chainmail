"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LogOut } from "@/lib/icons"
import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.log("[v0] Supabase not configured, skipping auth check")
        return
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error("[v0] Error checking auth:", error)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      router.push("/")
    } catch (error) {
      console.error("[v0] Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/">
                <h1 className="text-2xl font-heading font-bold text-primary">MailboxHero</h1>
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="/#features" className="text-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="/#testimonials" className="text-foreground hover:text-primary transition-colors">
                Testimonials
              </a>
              <a href="/#pricing" className="text-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </nav>

          {/* Desktop CTA - Removed CMRAgent button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" className="bg-transparent" asChild>
                  <a href="/dashboard">Dashboard</a>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-primary">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" className="bg-transparent" asChild>
                <a href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </a>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground hover:text-primary">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              <a href="/#about" className="block px-3 py-2 text-foreground hover:text-primary">
                About
              </a>
              <a href="/#features" className="block px-3 py-2 text-foreground hover:text-primary">
                Features
              </a>
              <a href="/#testimonials" className="block px-3 py-2 text-foreground hover:text-primary">
                Testimonials
              </a>
              <a href="/#pricing" className="block px-3 py-2 text-foreground hover:text-primary">
                Pricing
              </a>
              <a href="/contact" className="block px-3 py-2 text-foreground hover:text-primary">
                Contact
              </a>
              <div className="px-3 py-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                      <a href="/dashboard">Dashboard</a>
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
