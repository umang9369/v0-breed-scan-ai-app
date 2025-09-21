import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BreedScan AI - Intelligent Livestock Management",
  description: "AI-powered breed identification and heat detection for modern livestock management",
  keywords: "livestock, AI, breed identification, heat detection, farming, agriculture",
  authors: [{ name: "BreedScan AI Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#22c55e",
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        {/* Global subtle animated background */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          {/* gradient retains original look under animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background" />
        </div>
        {/* Animated SVG paths */}
        {/** @ts-expect-error Server component including client child is allowed */}
        {require("@/components/ui/background-paths").BackgroundPaths()}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
