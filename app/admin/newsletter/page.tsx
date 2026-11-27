import { AdminShell, Card, Tile, td, th, when } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

// Podgląd zapisów: lista oczekujących (mf_waitlist) i zgody marketingowe z prób. Wysyłka kampanii dopiero w kolejnym etapie,
// zawsze po kliknięciu „Wyślij” z liczbą odbiorców i potwierdzeniem.
export default async function Newsletter() {
  const email = await requireAdmin()
  const db = sql()
  // Zapytania po kolei: równoległe połączenia przez pooler Supabase wieszały renderowanie strony.
  const [s] = await db`select (select count(*) from mf_waitlist)::int as waitlist,
              (select count(*) from mf_waitlist where marketing_consent)::int as waitlist_ok,
              (select count(distinct lower(email)) from mf_trials where marketing_consent)::int as trial_ok`
  const list = await db`select lower(email) as email, marketing_consent, created_at from mf_waitlist order by created_at desc limit 300`
  return (
    <AdminShell email={email} active="/admin/newsletter" title="Newsletter">
      <section className="mb-4 grid gap-4 sm:grid-cols-3">
        <Tile label="Zapisy na listę" value={String(s.waitlist)} />
        <Tile label="Ze zgodą marketingową" value={String(s.waitlist_ok)} sub="z listy oczekujących" />
        <Tile label="Zgody z darmowej próby" value={String(s.trial_ok)} />
      </section>
      <Card title="Lista oczekujących" note="Kampanie, segmenty i wypisy dojdą w kolejnym etapie. Nic nie wysyła się samo.">
        <table className="w-full min-w-[560px]">
          <thead><tr><th className={th}>Data</th><th className={th}>E-mail</th><th className={th}>Zgoda marketingowa</th></tr></thead>
          <tbody className="divide-y divide-[var(--mf-surface-hover)]">
            {list.length === 0 && <tr><td className={td} colSpan={3}>Brak zapisów.</td></tr>}
            {list.map((r, i) => (
              <tr key={i}>
                <td className={td}>{when(r.created_at)}</td>
                <td className={`${td} break-all`}>{r.email}</td>
                <td className={td}>{r.marketing_consent ? "Tak" : "Nie"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  )
}
