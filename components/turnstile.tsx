"use client"

import { useEffect, useRef } from "react"

// Okienko Cloudflare Turnstile (tryb managed, zwykle niewidoczne). Bez NEXT_PUBLIC_TURNSTILE_SITE_KEY nic nie renderuje,
// a serwer wtedy nie wymaga tokenu (lib/turnstile.ts). Token ważny ok. 5 min i jednorazowy: po błędzie wywołaj reset().
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

type TurnstileApi = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

let loader: Promise<TurnstileApi> | null = null
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement("script")
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    s.async = true
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")))
    s.onerror = () => { loader = null; reject(new Error("turnstile")) }
    document.head.appendChild(s)
  })
  return loader
}

export function Turnstile({ action, onToken, resetKey = 0 }: { action: string; onToken: (t: string | null) => void; resetKey?: number }) {
  const box = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)
  const cb = useRef(onToken)
  cb.current = onToken

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !box.current) return
    let alive = true
    loadTurnstile()
      .then((t) => {
        if (!alive || !box.current) return
        id.current = t.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action,
          language: "pl",
          appearance: "interaction-only",
          callback: (tok: string) => cb.current(tok),
          "expired-callback": () => cb.current(null),
          "error-callback": () => cb.current(null),
        })
      })
      .catch(() => cb.current(null))
    return () => {
      alive = false
      if (id.current) window.turnstile?.remove(id.current)
      id.current = null
    }
  }, [action])

  useEffect(() => {
    if (resetKey && id.current) { window.turnstile?.reset(id.current); cb.current(null) }
  }, [resetKey])

  if (!TURNSTILE_SITE_KEY) return null
  return <div ref={box} className="mt-4 min-h-0" />
}
