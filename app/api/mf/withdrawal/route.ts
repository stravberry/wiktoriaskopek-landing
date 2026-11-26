import { NextResponse, type NextRequest } from "next/server"
import { clientIp, verifyTurnstile } from "@/lib/turnstile"
import { Resend } from "resend"
import { SELLER } from "@/lib/mf/config"
import { sql } from "@/lib/mf/db"
import { ipHash, mailFrom } from "@/lib/mf/server"
import { resendConfigured } from "@/lib/mf/core"

export const dynamic = "force-dynamic"

// POST /api/mf/withdrawal: oświadczenie o odstąpieniu → zapis + pełna treść do sprzedawcy (stały odbiorca).
// Kupujący dostaje tylko numer i datę zgłoszenia, i tylko na adres, z którego było zamówienie (przegląd 26.11, S4):
// formularz nie może wysyłać cudzego tekstu na dowolny adres. Limity w bazie: IP 3/h, adres 3/dobę, całość 30/h.
export async function POST(request: NextRequest) {
  const b = await request.json().catch(() => ({}))
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 120) : ""
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 200) : ""
  const orderRef = typeof b.orderRef === "string" ? b.orderRef.trim().slice(0, 120) : ""
  const statement = typeof b.statement === "string" ? b.statement.trim().slice(0, 2000) : ""
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || statement.length < 10) {
    return NextResponse.json({ error: "Uzupełnij imię i nazwisko, e-mail i treść oświadczenia." }, { status: 400 })
  }
  const ts = await verifyTurnstile(b.turnstileToken, clientIp(request.headers))
  if (!ts.ok) return NextResponse.json({ error: ts.error }, { status: ts.status })
  const outbox = !resendConfigured(process.env.RESEND_API_KEY) && process.env.MF_MAIL_MODE === "outbox" && process.env.VERCEL_ENV !== "production"
  if (!process.env.DATABASE_URL || (!resendConfigured(process.env.RESEND_API_KEY) && !outbox)) {
    return NextResponse.json({ error: `Formularz jest chwilowo niedostępny. Wyślij oświadczenie mailem na ${SELLER.email}.` }, { status: 503 })
  }
  const db = sql()
  const ip = ipHash(request.headers)
  const [lim] = await db`
    select count(*) filter (where ip_hash = ${ip} and created_at > now() - interval '1 hour')::int as ip,
           count(*) filter (where lower(email) = ${email} and created_at > now() - interval '1 day')::int as mail,
           count(*) filter (where created_at > now() - interval '1 hour')::int as total
    from mf_withdrawals where created_at > now() - interval '1 day'`
  if (lim.ip >= 3 || lim.mail >= 3 || lim.total >= 30) {
    return NextResponse.json({ error: "Zbyt wiele zgłoszeń. Napisz mailem: " + SELLER.email }, { status: 429 })
  }
  const [row] = await db`
    insert into mf_withdrawals (name, email, order_ref, statement, ip_hash) values (${name}, ${email}, ${orderRef || null}, ${statement}, ${ip})
    returning id, created_at`
  const when = new Date(row.created_at).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })
  // Potwierdzenie tylko dla adresu z zamówienia, bez treści wpisanej w formularz.
  const [order] = await db`select 1 from mf_orders where lower(email) = ${email} limit 1`
  const buyerText = `Otrzymaliśmy oświadczenie o odstąpieniu od umowy złożone w formularzu MontageFrames (nr ${row.id}, ${when}).\n\nOdpowiemy i rozliczymy zwrot w ciągu 14 dni. Jeśli to nie Ty, odpisz na tego maila.\n${SELLER.name}, ${SELLER.address}`
  const sellerText = `Oświadczenie o odstąpieniu nr ${row.id} (${when}).\n\nImię i nazwisko: ${name}\nE-mail: ${email}${order ? " (ma zamówienie)" : " (BRAK zamówienia na ten adres)"}\nZamówienie: ${orderRef || "—"}\nTreść:\n${statement}`
  const mails = [
    { key: `withdrawal/${row.id}/seller`, to: SELLER.email, replyTo: email, subject: `Odstąpienie od umowy nr ${row.id}`, text: sellerText },
    ...(order ? [{ key: `withdrawal/${row.id}/buyer`, to: email, replyTo: SELLER.email, subject: "Potwierdzenie otrzymania oświadczenia o odstąpieniu", text: buyerText }] : []),
  ]
  if (outbox) {
    for (const m of mails) {
      await db`insert into mf_mail_outbox (idempotency_key, to_email, subject, body_text) values (${m.key}, ${m.to}, ${m.subject}, ${m.text}) on conflict do nothing`
    }
    return NextResponse.json({ ok: true, id: row.id })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  for (const m of mails) {
    await resend.emails.send({ from: mailFrom(), to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text }, { idempotencyKey: m.key })
  }
  return NextResponse.json({ ok: true, id: row.id })
}
