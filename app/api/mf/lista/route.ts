import { NextResponse, type NextRequest } from "next/server"
import { MF_TEXT } from "@/lib/mf/config"
import { sql } from "@/lib/mf/db"
import { ipHash } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/mf/lista {email, marketing}: zapis „daj znać, gdy sprzedaż ruszy” (sklep w trybie testowym, S2).
// Bez wysyłki maila (żadnego bombardowania cudzych skrzynek); limit w bazie: 5 zapisów na godzinę z jednego IP.
export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Zapis chwilowo niedostępny." }, { status: 503 })
  const b = await request.json().catch(() => ({}))
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 200) : ""
  if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "Podaj poprawny e-mail." }, { status: 400 })
  if (b.marketing !== true) return NextResponse.json({ error: "Zaznacz zgodę na maila o starcie sprzedaży." }, { status: 400 })
  const ip = ipHash(request.headers)
  const db = sql()
  const [{ n }] = await db`select count(*)::int as n from mf_waitlist where ip_hash = ${ip} and created_at > now() - interval '1 hour'`
  if (n >= 5) return NextResponse.json({ error: "Zbyt wiele zapisów. Spróbuj za godzinę." }, { status: 429 })
  await db`insert into mf_waitlist (email, marketing_consent, consent_text, ip_hash) values (${email}, true, ${MF_TEXT.marketing}, ${ip})
           on conflict (lower(email)) do nothing`
  return NextResponse.json({ ok: true })
}
