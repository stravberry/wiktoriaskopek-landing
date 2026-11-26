import { NextResponse, type NextRequest } from "next/server"
import { Resend } from "resend"
import { SELLER } from "@/lib/mf/config"
import { sql } from "@/lib/mf/db"
import { clientIp, mailFrom, rateLimited } from "@/lib/mf/server"
import { resendConfigured } from "@/lib/mf/core"

export const dynamic = "force-dynamic"

// POST /api/mf/withdrawal: oświadczenie o odstąpieniu → zapis + potwierdzenie mailem do kupującego + kopia do sprzedawcy.
export async function POST(request: NextRequest) {
  if (rateLimited(`withdrawal:${clientIp(request.headers)}`, 3, 60 * 60_000)) {
    return NextResponse.json({ error: "Zbyt wiele zgłoszeń. Napisz mailem: " + SELLER.email }, { status: 429 })
  }
  const b = await request.json().catch(() => ({}))
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 120) : ""
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 200) : ""
  const orderRef = typeof b.orderRef === "string" ? b.orderRef.trim().slice(0, 120) : ""
  const statement = typeof b.statement === "string" ? b.statement.trim().slice(0, 2000) : ""
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || statement.length < 10) {
    return NextResponse.json({ error: "Uzupełnij imię i nazwisko, e-mail i treść oświadczenia." }, { status: 400 })
  }
  const outbox = !resendConfigured(process.env.RESEND_API_KEY) && process.env.MF_MAIL_MODE === "outbox" && process.env.VERCEL_ENV !== "production"
  if (!process.env.DATABASE_URL || (!resendConfigured(process.env.RESEND_API_KEY) && !outbox)) {
    return NextResponse.json({ error: `Formularz jest chwilowo niedostępny. Wyślij oświadczenie mailem na ${SELLER.email}.` }, { status: 503 })
  }
  const [row] = await sql()`
    insert into mf_withdrawals (name, email, order_ref, statement) values (${name}, ${email}, ${orderRef || null}, ${statement})
    returning id, created_at`
  const when = new Date(row.created_at).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })
  const text = `Otrzymaliśmy Twoje oświadczenie o odstąpieniu od umowy (${when}, nr ${row.id}).\n\nImię i nazwisko: ${name}\nZamówienie: ${orderRef || "—"}\nTreść: ${statement}\n\nOdpowiemy i rozliczymy zwrot w ciągu 14 dni.\n${SELLER.name}, ${SELLER.address}`
  if (outbox) {
    await sql()`insert into mf_mail_outbox (idempotency_key, to_email, subject, body_text) values
      (${`withdrawal/${row.id}/buyer`}, ${email}, 'Potwierdzenie otrzymania oświadczenia o odstąpieniu', ${text}),
      (${`withdrawal/${row.id}/seller`}, ${SELLER.email}, ${`Odstąpienie od umowy: ${name}`}, ${text})
      on conflict do nothing`
    return NextResponse.json({ ok: true, id: row.id })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({ from: mailFrom(), to: email, replyTo: SELLER.email, subject: "Potwierdzenie otrzymania oświadczenia o odstąpieniu", text })
  await resend.emails.send({ from: mailFrom(), to: SELLER.email, replyTo: email, subject: `Odstąpienie od umowy: ${name}`, text })
  return NextResponse.json({ ok: true, id: row.id })
}
