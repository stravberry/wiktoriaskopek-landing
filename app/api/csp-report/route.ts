import { NextResponse, type NextRequest } from "next/server"

export const dynamic = "force-dynamic"

// Raporty naruszeń CSP (report-uri). Do logów Vercel trafia tylko jedna krótka linia: dyrektywa, zablokowany adres
// (sam origin, bez query) i ścieżka strony. Bez danych osobowych i bez pełnych adresów.
const origin = (u: unknown) => {
  if (typeof u !== "string" || !u) return ""
  if (!u.includes("://")) return u.slice(0, 40) // inline, eval, data, blob
  try { return new URL(u).origin } catch { return "?" }
}
const path = (u: unknown) => {
  try { return typeof u === "string" ? new URL(u).pathname.slice(0, 120) : "" } catch { return "" }
}

export async function POST(request: NextRequest) {
  const text = await request.text().catch(() => "")
  if (text.length > 0 && text.length < 16_000) {
    try {
      const body = JSON.parse(text)
      const r = body?.["csp-report"] ?? body?.[0]?.body ?? body
      const directive = String(r?.["effective-directive"] ?? r?.effectiveDirective ?? r?.["violated-directive"] ?? "").slice(0, 40)
      console.warn(`[csp] ${directive} blocked=${origin(r?.["blocked-uri"] ?? r?.blockedURL)} page=${path(r?.["document-uri"] ?? r?.documentURL)}`)
    } catch {
      // zły JSON: ignorujemy
    }
  }
  return new NextResponse(null, { status: 204 })
}
