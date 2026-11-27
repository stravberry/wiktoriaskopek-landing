"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Gdy w kolejce mostu czeka polecenie, co 4 s odświeża dane strony (bez przeładowania), aż wynik wróci.
export function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => router.refresh(), 4000)
    return () => clearInterval(t)
  }, [active, router])
  return null
}
