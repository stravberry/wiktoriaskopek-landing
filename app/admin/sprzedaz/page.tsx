import { AdminShell, Card, Tile, td, th, when, zl } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

const STATUS: Record<string, string> = { delivered: "Dostarczone", pending: "W toku", failed: "Błąd dostawy", revoked: "Cofnięte" }

// Podgląd sprzedaży: zamówienia MontageFrames (mf_orders). Zwroty, licencje i ręczny dostęp w kolejnym etapie.
export default async function Sprzedaz() {
  const email = await requireAdmin()
  const db = sql()
  const [[s], orders] = await Promise.all([
    db`select count(*)::int as all, count(*) filter (where status = 'delivered' and session_id not like 'cs_test_%')::int as paid,
              coalesce(sum(amount_total) filter (where status = 'delivered' and session_id not like 'cs_test_%'), 0)::bigint as revenue,
              count(*) filter (where revoked_at is not null)::int as revoked,
              count(*) filter (where github_login is not null)::int as github,
              count(*) filter (where session_id like 'cs_test_%')::int as test
       from mf_orders`,
    db`select session_id, email, product, amount_total, currency, status, github_login, github_status, created_at, delivered_at, revoked_at
       from mf_orders order by created_at desc limit 300`,
  ])
  return (
    <AdminShell email={email} active="/admin/sprzedaz" title="Sprzedaż">
      <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Przychód (dostarczone)" value={zl(Number(s.revenue))} />
        <Tile label="Zamówienia" value={String(s.all)} sub={`${s.paid} dostarczonych`} />
        <Tile label="Dostęp do repo" value={String(s.github)} sub="kupujący z loginem GitHub" />
        <Tile label="Cofnięte" value={String(s.revoked)} sub={`${s.test} testowych (Stripe test, poza przychodem)`} />
      </section>
      <Card title="Zamówienia MontageFrames" note="Ceny ze Stripe, zwroty i ręczne nadanie dostępu dojdą w kolejnym etapie.">
        <table className="w-full min-w-[860px]">
          <thead><tr><th className={th}>Data</th><th className={th}>E-mail</th><th className={th}>Produkt</th><th className={th}>Kwota</th><th className={th}>Status</th><th className={th}>GitHub</th></tr></thead>
          <tbody className="divide-y divide-[var(--mf-surface-hover)]">
            {orders.length === 0 && <tr><td className={td} colSpan={6}>Brak zamówień.</td></tr>}
            {orders.map((o, i) => (
              <tr key={i}>
                <td className={td}>{when(o.created_at)}</td>
                <td className={`${td} break-all`}>{o.email}</td>
                <td className={td}>{o.product}</td>
                <td className={`${td} tabular-nums`}>{zl(Number(o.amount_total ?? 0))}</td>
                <td className={td}>{o.revoked_at ? "Cofnięte" : (STATUS[o.status as string] ?? o.status)}{String(o.session_id).startsWith("cs_test_") ? " · test" : ""}</td>
                <td className={td}>{o.github_login ? `@${o.github_login} · ${o.github_status ?? "—"}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  )
}
