import Link from "next/link"
import { AdminShell, Card, td, th, when, zl } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

const SOURCE: Record<string, string> = { zakup: "Zakup", proba: "Darmowa próba", zapis: "Zapis na listę" }
const STAGE: Record<string, string> = { lead: "Lead", oferta: "Oferta", aktywny: "Aktywny", wstrzymany: "Wstrzymany", zakonczony: "Zakończony" }
const FOLDER = "application/vnd.google-apps.folder"
const btn = "min-h-10 rounded-full bg-[var(--mf-surface)] px-4 text-[14px] font-semibold hover:bg-[var(--mf-surface-hover)]"

// Podgląd CRM: jeden wiersz na osobę (deduplikacja po e-mailu) z istniejących źródeł. Tagi, notatki i lejek w kolejnym etapie.
export default async function Crm({ searchParams }: { searchParams: Promise<{ q?: string; s?: string }> }) {
  const email = await requireAdmin()
  const sp = await searchParams
  const q = (sp.q ?? "").trim().toLowerCase().slice(0, 100)
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
  // Klienci (firmy i osoby, z którymi pracuje Wiktoria) z folderami z Dysku. Zapytania po kolei (PR #48).
  const clients = await sql()`select c.id, c.name, c.stage, c.email, c.updated_at, d.name as folder, d.link as folder_link,
       (select count(*) from ws_client_items i where i.client_id = c.id)::int as items
     from ws_clients c left join ws_drive d on d.id = c.drive_folder_id order by c.name`
  const free = await sql()`select d.id, d.name, d.link from ws_drive d where d.depth = 1 and d.mime = ${FOLDER}
     and not exists (select 1 from ws_clients c where c.drive_folder_id = d.id) order by d.name`
  return (
    <AdminShell email={email} active="/admin/crm" title="CRM">
      {sp.s === "blad" && <p role="status" className="mb-4 rounded-[16px] bg-[var(--mf-accent-soft)] px-4 py-3 text-[15px] font-semibold">Nie udało się. Spróbuj ponownie.</p>}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card title={`Klienci (${clients.length})`} note="karta klienta: dane, etap, folder z Dysku, materiały">
          {clients.length === 0 ? <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Jeszcze nikogo. Utwórz klienta z folderu obok albo z formularza.</p> : (
            <table className="w-full min-w-[520px]">
              <thead><tr><th className={th}>Klient</th><th className={th}>Etap</th><th className={th}>Folder</th><th className={th}>Materiały</th></tr></thead>
              <tbody className="divide-y divide-[var(--mf-surface-hover)]">
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td className={td}><Link href={`/admin/crm/klient/${c.id}`} className="font-semibold underline-offset-2 hover:underline">{c.name}</Link>{c.email && <span className="block break-all text-[13px] text-[var(--mf-ink-2)]">{c.email}</span>}</td>
                    <td className={td}>{STAGE[c.stage] ?? c.stage}</td>
                    <td className={td}>{c.folder_link ? <a href={c.folder_link} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{c.folder}</a> : "—"}</td>
                    <td className={`${td} tabular-nums`}>{c.items || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <form method="post" action="/api/admin/crm" className="mt-4 flex flex-wrap gap-2">
            <input type="hidden" name="action" value="create" />
            <input name="name" required maxLength={200} placeholder="Nazwa nowego klienta" aria-label="Nazwa nowego klienta" className="min-h-11 flex-1 rounded-full bg-[var(--mf-surface)] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[var(--mf-accent)]" />
            <input name="email" type="email" maxLength={200} placeholder="E-mail (opcjonalnie)" aria-label="E-mail klienta" className="min-h-11 flex-1 rounded-full bg-[var(--mf-surface)] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[var(--mf-accent)]" />
            <button className="min-h-11 rounded-full bg-[var(--mf-ink)] px-5 text-[15px] font-semibold text-[var(--mf-bg)]">Dodaj klienta</button>
          </form>
        </Card>
        <Card title={`Foldery bez klienta (${free.length})`} note="Dysk: Wspólny dysk MAC / KLIENCI">
          {free.length === 0 ? <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Każdy folder ma klienta.</p> : (
            <ul className="divide-y divide-[var(--mf-surface-hover)]">
              {free.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2">
                  <a href={d.link} target="_blank" rel="noreferrer" className="min-w-0 text-[15px] underline-offset-2 hover:underline">{d.name}</a>
                  <form method="post" action="/api/admin/crm">
                    <input type="hidden" name="action" value="from_folder" />
                    <input type="hidden" name="folder_id" value={d.id} />
                    <button className={btn}>Utwórz klienta</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <form className="mb-4 flex gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Szukaj po e-mailu" aria-label="Szukaj po e-mailu" className="min-h-11 w-full max-w-[360px] rounded-full bg-[var(--mf-bg)] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[var(--mf-accent)]" />
        <button className="min-h-11 rounded-full bg-[var(--mf-ink)] px-5 text-[15px] font-semibold text-[var(--mf-bg)]">Szukaj</button>
      </form>
      <Card title={`Kontakty MontageFrames (${rows.length}${rows.length === 300 ? "+" : ""})`} note="Jedna osoba = jeden wiersz. Tagi, notatki i etapy lejka dojdą w kolejnym etapie.">
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
