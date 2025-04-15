import type React from "react"
import "./globals.css"
import "../styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "CHRM.ai - Revenue Intelligence",
  description: "AI-powered revenue intelligence platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}