import { AdminShell, Card, Tile, when, zl } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

export default async function AdminHome() {
  const email = await requireAdmin()
  const db = sql()
  // Zapytania po kolei: równoległe połączenia przez pooler Supabase wieszały renderowanie strony.
  const [o] = await db`select count(*) filter (where status = 'delivered' and session_id not like 'cs_test_%')::int as paid,
              coalesce(sum(amount_total) filter (where status = 'delivered' and session_id not like 'cs_test_%'), 0)::bigint as revenue,
              count(*) filter (where status = 'delivered' and session_id not like 'cs_test_%' and created_at > now() - interval '30 days')::int as paid30,
              coalesce(sum(amount_total) filter (where status = 'delivered' and session_id not like 'cs_test_%' and created_at > now() - interval '30 days'), 0)::bigint as revenue30
       from mf_orders`
  const [t] = await db`select count(*)::int as all, count(*) filter (where created_at > now() - interval '7 days')::int as week,
              count(*) filter (where status = 'done')::int as ok
       from mf_trials`
  const [w] = await db`select count(*)::int as all, count(*) filter (where marketing_consent)::int as consent from mf_waitlist`
  const [f] = await db`select coalesce(sum(views), 0)::int as views, coalesce(sum(buy_clicks), 0)::int as buy, coalesce(sum(trial_clicks), 0)::int as trial
       from mf_funnel_weekly where week > now() - interval '28 days'`
  const recent = await db`select email, product, amount_total, status, created_at from mf_orders order by created_at desc limit 6`
  const logins = await db`select ts, action, ok from adm_audit where action in ('login_ok', 'login_denied', 'auth_denied', 'page_denied') order by ts desc limit 6`
  return (
    <AdminShell email={email} active="/admin" title="Pulpit">
      <section aria-label="Sprzedaż" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Sprzedaż MontageFrames" value={zl(Number(o.revenue))} sub={`${o.paid} opłaconych zamówień`} />
        <Tile label="Ostatnie 30 dni" value={zl(Number(o.revenue30))} sub={`${o.paid30} zamówień`} />
        <Tile label="Darmowe próby" value={String(t.all)} sub={`${t.week} w tym tygodniu · ${t.ok} gotowych rolek`} />
        <Tile label="Zapisy (lista oczekujących)" value={String(w.all)} sub={`${w.consent} ze zgodą marketingową`} />
      </section>
      <section aria-label="Lejek" className="mt-4 grid gap-4 sm:grid-cols-3">
        <Tile label="Wejścia na stronę (4 tygodnie)" value={String(f.views)} />
        <Tile label="Kliknięcia „Kup”" value={String(f.buy)} />
        <Tile label="Kliknięcia „Wypróbuj”" value={String(f.trial)} />
      </section>
      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card title="Ostatnie zamówienia">
          <ul className="divide-y divide-[var(--mf-surface-hover)]">
            {recent.length === 0 && <li className="py-3 text-[15px] text-[var(--mf-ink-2)]">Brak zamówień.</li>}
            {recent.map((r, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[15px]">
                <span className="min-w-0 break-all">{r.email}</span>
                <span className="text-[var(--mf-ink-2)]">{r.product} · {zl(Number(r.amount_total ?? 0))} · {r.status} · {when(r.created_at)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Logowania do panelu">
          <ul className="divide-y divide-[var(--mf-surface-hover)]">
            {logins.map((l, i) => (
              <li key={i} className="flex justify-between gap-2 py-3 text-[15px]">
                <span className={l.ok ? "" : "font-semibold text-[var(--mf-danger)]"}>{({ login_ok: "Zalogowano", login_denied: "Obcy e-mail", auth_denied: "Zły link", page_denied: "Wejście bez sesji" } as Record<string, string>)[l.action] ?? l.action}</span>
                <span className="text-[var(--mf-ink-2)]">{when(l.ts)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AdminShell>
  )
}
