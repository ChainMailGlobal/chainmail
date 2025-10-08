import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"
import CMRAChatWidget from "@/components/CMRAChatWidget"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "700"],
})

const sourceSansPro = Source_Sans_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "CMRAgent - CMRA Compliance Made Simple",
  description:
    "The compliance-first solution for CMRA operators. Turn 2-week compliance processes into 3 minutes with AI witness and blockchain audit trails.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSansPro.variable}`}>
      <body className="font-body antialiased">
        <Suspense fallback={null}>
          {children}
          <CMRAChatWidget />
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
