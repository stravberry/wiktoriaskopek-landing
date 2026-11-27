import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

const zl = (grosze: number) => `${(grosze / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`
const when = (d: Date | string | null) => (d ? new Date(d).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw", dateStyle: "short", timeStyle: "short" }) : "—")

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[22px] bg-[var(--mf-bg)] p-5">
      <p className="text-[14px] text-[var(--mf-ink-2)]">{label}</p>
      <p className="mt-1 text-[30px] font-bold tracking-[-0.02em] tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-[var(--mf-ink-2)]">{sub}</p>}
    </div>
  )
}

export default async function AdminHome() {
  const email = await requireAdmin()
  const db = sql()
  const [[o], [t], [w], [f], recent, logins] = await Promise.all([
    db`select count(*) filter (where status = 'delivered')::int as paid,
              coalesce(sum(amount_total) filter (where status = 'delivered'), 0)::bigint as revenue,
              count(*) filter (where status = 'delivered' and created_at > now() - interval '30 days')::int as paid30,
              coalesce(sum(amount_total) filter (where status = 'delivered' and created_at > now() - interval '30 days'), 0)::bigint as revenue30,
              count(*) filter (where revoked_at is not null)::int as revoked
       from mf_orders`,
    db`select count(*)::int as all, count(*) filter (where created_at > now() - interval '7 days')::int as week,
              count(*) filter (where status = 'done')::int as ok
       from mf_trials`,
    db`select count(*)::int as all, count(*) filter (where marketing_consent)::int as consent from mf_waitlist`,
    db`select coalesce(sum(views), 0)::int as views, coalesce(sum(buy_clicks), 0)::int as buy, coalesce(sum(trial_clicks), 0)::int as trial
       from mf_funnel_weekly where week > now() - interval '28 days'`,
    db`select email, product, amount_total, status, created_at from mf_orders order by created_at desc limit 6`,
    db`select ts, action, ok from adm_audit where action in ('login_ok', 'login_denied', 'auth_denied', 'page_denied') order by ts desc limit 6`,
  ])
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--mf-ink-2)]">Panel · wiktoriaskopek.pl</p>
          <h1 className="text-[32px] font-bold tracking-[-0.02em]">Pulpit</h1>
          <p className="text-[15px] text-[var(--mf-ink-2)]">Zalogowano jako {email}. Sesja wygasa po 8 godzinach.</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="min-h-11 rounded-full bg-[var(--mf-bg)] px-5 text-[15px] font-semibold hover:bg-[var(--mf-surface-hover)]">Wyloguj</button>
        </form>
      </header>

      <section aria-label="Sprzedaż" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Sprzedaż MontageFrames" value={zl(Number(o.revenue))} sub={`${o.paid} opłaconych zamówień`} />
        <Tile label="Ostatnie 30 dni" value={zl(Number(o.revenue30))} sub={`${o.paid30} zamówień`} />
        <Tile label="Darmowe próby" value={String(t.all)} sub={`${t.week} w tym tygodniu · ${t.ok} gotowych rolek`} />
        <Tile label="Lista oczekujących" value={String(w.all)} sub={`${w.consent} ze zgodą marketingową`} />
      </section>

      <section aria-label="Lejek" className="mt-4 grid gap-4 sm:grid-cols-3">
        <Tile label="Wejścia na stronę (4 tygodnie)" value={String(f.views)} />
        <Tile label="Kliknięcia „Kup”" value={String(f.buy)} />
        <Tile label="Kliknięcia „Wypróbuj”" value={String(f.trial)} />
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-[22px] bg-[var(--mf-bg)] p-5">
          <h2 className="text-[18px] font-bold">Ostatnie zamówienia</h2>
          <ul className="mt-3 divide-y divide-[var(--mf-surface-hover)]">
            {recent.length === 0 && <li className="py-3 text-[15px] text-[var(--mf-ink-2)]">Brak zamówień.</li>}
            {recent.map((r, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[15px]">
                <span className="min-w-0 break-all">{r.email}</span>
                <span className="text-[var(--mf-ink-2)]">{r.product} · {zl(Number(r.amount_total ?? 0))} · {r.status} · {when(r.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-[22px] bg-[var(--mf-bg)] p-5">
          <h2 className="text-[18px] font-bold">Logowania do panelu</h2>
          <ul className="mt-3 divide-y divide-[var(--mf-surface-hover)]">
            {logins.map((l, i) => (
              <li key={i} className="flex justify-between gap-2 py-3 text-[15px]">
                <span className={l.ok ? "" : "font-semibold text-[var(--mf-danger)]"}>{({ login_ok: "Zalogowano", login_denied: "Obcy e-mail", auth_denied: "Zły link", page_denied: "Wejście bez sesji" } as Record<string, string>)[l.action] ?? l.action}</span>
                <span className="text-[var(--mf-ink-2)]">{when(l.ts)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-8 text-[13px] text-[var(--mf-ink-2)]">Kolejne moduły (CRM, sprzedaż, newsletter, finanse) dojdą po akceptacji planu.</p>
    </main>
  )
}
