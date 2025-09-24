"use client"

import type React from "react"

import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSlideRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/request-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
        setEmail("")
      }
    } catch (error) {
      console.error("Error requesting slides:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">MailBox Hero Inc.</h3>
            <p className="text-muted-foreground mb-2 font-semibold">Daniel Kaneshiro</p>
            <p className="text-muted-foreground mb-2">
              <strong>My Mission:</strong> Addressing Your Business Needs.
            </p>
            <p className="text-muted-foreground mb-6">
              <strong>Our Vision:</strong> We focus on your business mail compliance so you can concentrate on your
              business model.
            </p>

            <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-950/20 dark:to-emerald-950/20 rounded-lg p-4 mb-6">
              <p className="text-muted-foreground">
                <strong>Our Manifesto:</strong> Like the O₂H (Zero2Hero) hydroperoxyl radical that transforms
                atmospheric chemistry, our AI-powered authorized employee creates a radical transformation in how
                businesses experience compliance - making it instant, efficient, zero fraud, immutable, compliant,
                effective, and enjoyable to run a business.
              </p>
            </div>

            <div id="about" className="mt-8 pt-8 border-t border-border">
              <h4 className="text-xl font-heading font-bold text-primary mb-4">About</h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 2009 Advocacy Video */}
                <div>
                  <p className="text-muted-foreground mb-3">In 2009 I advocated for the change to live video:</p>
                  <div className="aspect-video w-full">
                    <iframe
                      src="https://www.youtube.com/embed/osUjLTvb6_8?si=er0F1GdvcsyDbP_b"
                      title="2009 Live Video Advocacy"
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-3">Explore our comprehensive presentation:</p>
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-border/50">
                    <div className="flex items-center justify-center h-32 bg-muted/30 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-primary/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h5 className="font-semibold text-card-foreground mb-1">MailboxHero Presentation</h5>
                        <p className="text-sm text-muted-foreground">
                          "From Pain Point to Patent" The real mailbox hero journey
                        </p>
                      </div>
                    </div>

                    {submitted ? (
                      <div className="text-center py-4">
                        <div className="w-8 h-8 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          Slide deck sent to your email!
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSlideRequest} className="space-y-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || !email}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-2 px-4 rounded-lg font-medium"
                        >
                          {isSubmitting ? "Sending..." : "Email Me the Slide Deck"}
                        </button>
                      </form>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Get instant access to our detailed presentation
                    </p>
                  </div>
                </div>
              </div>

              {/* Domestic Mail Manual Evolution */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h5 className="font-semibold text-card-foreground mb-3">Domestic Mail Manual Evolution</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-semibold">Feature</th>
                        <th className="text-left py-2 px-3 font-semibold">Pre-2023</th>
                        <th className="text-left py-2 px-3 font-semibold">2023–2024</th>
                        <th className="text-left py-2 px-3 font-semibold">2025</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3 font-medium">Signature witnessing</td>
                        <td className="py-2 px-3 text-muted-foreground">
                          Required physical presence of the CMRA representative
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          Allows virtual presence via real-time audio and video
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">PATENT PENDING AI WITNESSING™</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-card-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="mailto:Daniel@chainmail.global"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 MailBox Hero Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
