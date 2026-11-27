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

function Nav({ active }: { active: string }) {
  return (
    <nav aria-label="Moduły panelu" className="flex flex-col gap-1">
      {NAV.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={active === href ? "page" : undefined}
          className={`flex min-h-11 items-center rounded-[14px] px-4 text-[15px] font-semibold ${active === href ? "bg-[var(--mf-ink)] text-[var(--mf-bg)]" : "text-[var(--mf-ink-2)] hover:bg-[var(--mf-surface)]"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

function Logout({ email }: { email: string }) {
  return (
    <form action="/api/admin/logout" method="post" className="flex flex-col gap-2">
      <span className="break-all px-4 text-[13px] text-[var(--mf-ink-2)]">{email}</span>
      <button className="min-h-10 rounded-[14px] px-4 text-left text-[15px] font-semibold text-[var(--mf-ink-2)] hover:bg-[var(--mf-surface)]">Wyloguj</button>
    </form>
  )
}

// Lewy pasek boczny od 1024 px; na telefonie przycisk „Menu” wysuwa ten sam pasek (details, bez JavaScriptu).
export function AdminShell({ email, active, title, children }: { email: string; active: string; title: string; children: React.ReactNode }) {
  return (
    <div className="lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col justify-between overflow-y-auto bg-[var(--mf-bg)] px-3 py-5 lg:flex">
        <div className="flex flex-col gap-5">
          <p className="px-4 text-[15px] font-bold">Panel · wiktoriaskopek.pl</p>
          <Nav active={active} />
        </div>
        <Logout email={email} />
      </aside>
      <details className="group sticky top-0 z-20 bg-[var(--mf-bg)] lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
          <span>Panel · wiktoriaskopek.pl</span>
          <span className="rounded-full bg-[var(--mf-surface)] px-4 py-2 text-[14px]"><span className="group-open:hidden">Menu</span><span className="hidden group-open:inline">Zamknij</span></span>
        </summary>
        <div className="flex flex-col gap-4 border-t border-[var(--mf-surface-hover)] px-3 pb-4 pt-3 shadow-lg">
          <Nav active={active} />
          <Logout email={email} />
        </div>
      </details>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="mb-6 text-[32px] font-bold tracking-[-0.02em]">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
