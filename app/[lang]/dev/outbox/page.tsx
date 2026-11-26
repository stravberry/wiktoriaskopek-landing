import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { sql } from "@/lib/mf/db"
import { outboxPreviewAllowed } from "@/lib/mf/server"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Skrzynka testowa | MontageFrames", robots: { index: false, follow: false } }

// Podgląd maili z trybu testowego (MF_MAIL_MODE=outbox). Działa wyłącznie lokalnie: poza localhost → 404.
export default async function Outbox({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  if (!outboxPreviewAllowed()) notFound()
  const { id } = await searchParams
  const mails = await sql()<{ idempotency_key: string; created_at: Date; to_email: string; subject: string; body_text: string; body_html: string | null }[]>`
    select idempotency_key, created_at, to_email, subject, body_text, body_html from mf_mail_outbox order by created_at desc limit 50`
  const current = mails.find((m) => m.idempotency_key === id) ?? mails[0]

  return (
    <main className="mx-auto grid max-w-[1240px] gap-6 px-5 py-10 md:px-10 lg:grid-cols-[340px_1fr]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <section>
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Skrzynka testowa</h1>
        <p className="mt-2 text-[14px] text-[#5c5c62]">Tryb testowy: te maile nie wyszły do nikogo. Strona działa tylko lokalnie.</p>
        <ol className="mt-6 flex flex-col gap-2">
          {mails.map((m) => (
            <li key={m.idempotency_key}>
              <a
                href={`?id=${encodeURIComponent(m.idempotency_key)}`}
                className={`block rounded-2xl p-4 text-[14px] ${m === current ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] hover:bg-[#e8e8ed]"}`}
              >
                <span className="block font-semibold">{m.subject}</span>
                <span className="block opacity-70">{m.to_email}</span>
                <span className="block opacity-70">{new Date(m.created_at).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}</span>
              </a>
            </li>
          ))}
          {!mails.length && <li className="text-[15px]">Brak maili. Zrób zakup testowy.</li>}
        </ol>
      </section>
      <section className="min-h-[70vh] overflow-hidden rounded-3xl bg-[#f5f5f7]">
        {current &&
          (current.body_html ? (
            <iframe title={current.subject} srcDoc={current.body_html} sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation" className="h-[85vh] w-full bg-white" />
          ) : (
            <pre className="whitespace-pre-wrap p-6 text-[14px] leading-[1.6]">{current.body_text}</pre>
          ))}
      </section>
    </main>
  )
}
