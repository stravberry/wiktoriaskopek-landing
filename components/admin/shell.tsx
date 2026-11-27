import Link from "next/link"
import type React from "react"

const NAV = [
  ["/admin", "Pulpit"],
  ["/admin/dzien", "Dzień"],
  ["/admin/clickup", "ClickUp"],
  ["/admin/crm", "CRM"],
  ["/admin/sprzedaz", "Sprzedaż"],
  ["/admin/newsletter", "Newsletter"],
  ["/admin/audyty", "Audyty IG"],
] as const

export const zl = (grosze: number) => `${(grosze / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`
export const when = (d: Date | string | null | undefined) => (d ? new Date(d).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw", dateStyle: "short", timeStyle: "short" }) : "—")

export function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[22px] bg-[var(--mf-bg)] p-5">
      <p className="text-[14px] text-[var(--mf-ink-2)]">{label}</p>
      <p className="mt-1 text-[30px] font-bold tracking-[-0.02em] tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-[var(--mf-ink-2)]">{sub}</p>}
    </div>
  )
}

export function Card({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="rounded-[22px] bg-[var(--mf-bg)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[18px] font-bold">{title}</h2>
        {note && <p className="text-[13px] text-[var(--mf-ink-2)]">{note}</p>}
      </div>
      <div className="mt-3 overflow-x-auto">{children}</div>
    </section>
  )
}

export const th = "py-2 pr-4 text-left text-[13px] font-semibold text-[var(--mf-ink-2)] whitespace-nowrap"
export const td = "py-2.5 pr-4 align-top text-[15px]"

export function AdminShell({ email, active, title, children }: { email: string; active: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-[15px] font-bold">Panel · wiktoriaskopek.pl</p>
          <nav aria-label="Moduły panelu" className="flex flex-wrap gap-1 rounded-full bg-[var(--mf-bg)] p-1">
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={active === href ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-[15px] font-semibold ${active === href ? "bg-[var(--mf-ink)] text-[var(--mf-bg)]" : "text-[var(--mf-ink-2)] hover:bg-[var(--mf-surface)]"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <form action="/api/admin/logout" method="post" className="flex items-center gap-3">
          <span className="text-[13px] text-[var(--mf-ink-2)]">{email}</span>
          <button className="min-h-10 rounded-full bg-[var(--mf-bg)] px-4 text-[15px] font-semibold hover:bg-[var(--mf-surface-hover)]">Wyloguj</button>
        </form>
      </header>
      <h1 className="mb-6 text-[32px] font-bold tracking-[-0.02em]">{title}</h1>
      {children}
    </div>
  )
}
