import { AdminShell, Card, td, th, when, zl } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

const SOURCE: Record<string, string> = { zakup: "Zakup", proba: "Darmowa próba", zapis: "Zapis na listę" }

// Podgląd CRM: jeden wiersz na osobę (deduplikacja po e-mailu) z istniejących źródeł. Tagi, notatki i lejek w kolejnym etapie.
export default async function Crm({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const email = await requireAdmin()
  const q = ((await searchParams).q ?? "").trim().toLowerCase().slice(0, 100)
  const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`
  const rows = await sql()`
    with src as (
      select lower(email) as email, 'zakup' as source, created_at, coalesce(amount_total, 0) as amount, status = 'delivered' and session_id not like 'cs_test_%' as paid from mf_orders
      union all select lower(email), 'proba', created_at, 0, false from mf_trials
      union all select lower(email), 'zapis', created_at, 0, false from mf_waitlist
    )
    select email, array_agg(distinct source) as sources, min(created_at) as first_seen, max(created_at) as last_seen,
           count(*) filter (where source = 'zakup' and paid)::int as orders,
           coalesce(sum(amount) filter (where source = 'zakup' and paid), 0)::bigint as revenue,
           count(*) filter (where source = 'proba')::int as trials
    from src where email is not null and (${q} = '' or email like ${like})
    group by email order by max(created_at) desc limit 300`
  return (
    <AdminShell email={email} active="/admin/crm" title="CRM">
      <form className="mb-4 flex gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Szukaj po e-mailu" aria-label="Szukaj po e-mailu" className="min-h-11 w-full max-w-[360px] rounded-full bg-[var(--mf-bg)] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[var(--mf-accent)]" />
        <button className="min-h-11 rounded-full bg-[var(--mf-ink)] px-5 text-[15px] font-semibold text-[var(--mf-bg)]">Szukaj</button>
      </form>
      <Card title={`Kontakty (${rows.length}${rows.length === 300 ? "+" : ""})`} note="Jedna osoba = jeden wiersz. Tagi, notatki i etapy lejka dojdą w kolejnym etapie.">
        <table className="w-full min-w-[720px]">
          <thead><tr><th className={th}>E-mail</th><th className={th}>Źródła</th><th className={th}>Zakupy</th><th className={th}>Próby</th><th className={th}>Pierwszy kontakt</th><th className={th}>Ostatnio</th></tr></thead>
          <tbody className="divide-y divide-[var(--mf-surface-hover)]">
            {rows.map((r) => (
              <tr key={r.email}>
                <td className={`${td} break-all`}>{r.email}</td>
                <td className={td}>{(r.sources as string[]).map((s) => SOURCE[s] ?? s).join(", ")}</td>
                <td className={`${td} tabular-nums`}>{r.orders ? `${r.orders} · ${zl(Number(r.revenue))}` : "—"}</td>
                <td className={`${td} tabular-nums`}>{r.trials || "—"}</td>
                <td className={td}>{when(r.first_seen)}</td>
                <td className={td}>{when(r.last_seen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  )
}
