import type { Metadata } from "next"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wiktoria Skopek - Marketing & Video Production",
  description: "Profesjonalny marketing, produkcja wideo i studio podcastowe w Katowicach",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
