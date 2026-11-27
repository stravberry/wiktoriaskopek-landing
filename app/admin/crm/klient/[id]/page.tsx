import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminShell, Card, td, th, when, zl } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

// Karta klienta: dane, etap, folder z Dysku (KLIENCI), przypisane materiały, zamówienia i próby po e-mailu, historia zmian.
const STAGE: Record<string, string> = { lead: "Lead", oferta: "Oferta", aktywny: "Aktywny", wstrzymany: "Wstrzymany", zakonczony: "Zakończony" }
const FOLDER = "application/vnd.google-apps.folder"
const MSG: Record<string, string> = { zapisany: "Zapisane.", jest: "Ten folder ma już klienta, otwieram jego kartę.", "folder-zajety": "Ten folder jest przypisany do innego klienta.", blad: "Nie udało się. Sprawdź pola i spróbuj ponownie." }
const field = "min-h-11 w-full rounded-[14px] border border-[var(--mf-line)] bg-[var(--mf-bg)] px-3 text-[16px]"
const label = "flex flex-col gap-1.5 text-[14px] font-semibold"
const kind = (m: string | null) => (m === FOLDER ? "Folder" : m?.includes("document") ? "Dokument" : m?.includes("spreadsheet") ? "Arkusz" : m?.includes("presentation") ? "Prezentacja" : m?.startsWith("image/") ? "Obraz" : m?.startsWith("video/") ? "Wideo" : m === "application/pdf" ? "PDF" : "Plik")

export default async function Klient({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ s?: string }> }) {
  const email = await requireAdmin()
  const { id } = await params
  const q = await searchParams
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) notFound()
  const db = sql()
  // Zapytania po kolei (PR #48).
  const [c] = await db`select * from ws_clients where id = ${id}`
  if (!c) notFound()
  const folders = await db`select id, name from ws_drive where depth = 1 and mime = ${FOLDER} order by name`
  const [folder] = c.drive_folder_id ? await db`select id, name, link from ws_drive where id = ${c.drive_folder_id}` : []
  const files = c.drive_folder_id ? await db`select d.id, d.name, d.mime, d.modified_at, d.link, i.client_id is not null as assigned
       from ws_drive d left join ws_client_items i on i.drive_id = d.id and i.client_id = ${id}
       where d.parent_id = ${c.drive_folder_id} order by (d.mime = ${FOLDER}) desc, d.modified_at desc nulls last limit 300` : []
  const extra = await db`select i.drive_id, d.name, d.link, d.mime from ws_client_items i left join ws_drive d on d.id = i.drive_id
       where i.client_id = ${id} and (d.parent_id is distinct from ${c.drive_folder_id ?? ""}) order by i.added_at desc`
  const orders = c.email ? await db`select product, amount_total, status, created_at from mf_orders where lower(email) = ${c.email} order by created_at desc limit 20` : []
  const trials = c.email ? await db`select status, created_at from mf_trials where lower(email) = ${c.email} order by created_at desc limit 20` : []
  const history = await db`select ts, action, actor from adm_audit where detail->>'client' = ${id} order by ts desc limit 30`
  return (
    <AdminShell email={email} active="/admin/crm" title={c.name}>
      <p className="mb-4 text-[15px]"><Link href="/admin/crm" className="font-semibold text-[var(--mf-accent-ink)] underline-offset-2 hover:underline">← CRM</Link></p>
      {q.s && MSG[q.s] && <p role="status" className="mb-4 rounded-[16px] bg-[var(--mf-accent-soft)] px-4 py-3 text-[15px] font-semibold">{MSG[q.s]}</p>}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card title="Dane klienta" note={`od ${when(c.created_at)}`}>
          <form method="post" action="/api/admin/crm" className="flex flex-col gap-4">
            <input type="hidden" name="action" value="update" />
            <input type="hidden" name="id" value={c.id} />
            <label className={label}>Nazwa<input name="name" required maxLength={200} defaultValue={c.name} className={field} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>E-mail<input name="email" type="email" maxLength={200} defaultValue={c.email ?? ""} className={field} /></label>
              <label className={label}>Telefon<input name="phone" maxLength={40} defaultValue={c.phone ?? ""} className={field} /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>Etap
                <select name="stage" defaultValue={c.stage} className={field}>{Object.entries(STAGE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              </label>
              <label className={label}>Folder na Dysku (KLIENCI)
                <select name="folder_id" defaultValue={c.drive_folder_id ?? ""} className={field}>
                  <option value="">— brak —</option>
                  {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </label>
            </div>
            <label className={label}>Notatki<textarea name="note" rows={5} maxLength={4000} defaultValue={c.note ?? ""} className={`${field} py-2.5`} /></label>
            <button className="min-h-12 self-start rounded-full bg-[var(--mf-accent)] px-6 text-[16px] font-bold text-[var(--mf-on-accent)]">Zapisz</button>
          </form>
        </Card>
        <Card title="Materiały z Dysku" note={folder ? "zaznacz, co należy do klienta" : "przypisz folder w danych klienta"}>
          {folder && <p className="mb-2 text-[15px]"><a href={folder.link} target="_blank" rel="noreferrer" className="font-semibold underline-offset-2 hover:underline">Otwórz folder „{folder.name}”</a></p>}
          {files.length > 0 && (
            <ul className="divide-y divide-[var(--mf-surface-hover)]">
              {files.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-2">
                  <form method="post" action="/api/admin/crm">
                    <input type="hidden" name="action" value={d.assigned ? "unassign" : "assign"} />
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="drive_id" value={d.id} />
                    <button aria-label={d.assigned ? `Odepnij: ${d.name}` : `Przypisz: ${d.name}`}
                      className={`grid size-10 place-items-center rounded-full text-[16px] font-bold ${d.assigned ? "bg-[var(--mf-success-soft)] text-[var(--mf-success)]" : "bg-[var(--mf-surface)] hover:bg-[var(--mf-surface-hover)]"}`}>
                      {d.assigned ? "✓" : "+"}
                    </button>
                  </form>
                  <span className="min-w-0 flex-1 text-[15px]">
                    {d.link ? <a href={d.link} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{d.name}</a> : d.name}
                    <span className="block text-[13px] text-[var(--mf-ink-2)]">{kind(d.mime)} · {when(d.modified_at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {folder && files.length === 0 && <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Folder jest pusty.</p>}
          {extra.length > 0 && (
            <>
              <h3 className="mt-4 text-[14px] font-semibold text-[var(--mf-ink-2)]">Przypisane spoza folderu</h3>
              <ul>{extra.map((x) => <li key={x.drive_id} className="py-1 text-[15px]">{x.link ? <a href={x.link} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{x.name}</a> : (x.name ?? "usunięte z Dysku")}</li>)}</ul>
            </>
          )}
          <p className="mt-3 text-[13px] text-[var(--mf-ink-2)]">Przypisanie zapisuje się tylko w panelu. Uprawnienia na Dysku się nie zmieniają.</p>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Zamówienia i próby" note={c.email ? `po adresie ${c.email}` : "dodaj e-mail, żeby powiązać"}>
          {orders.length + trials.length === 0 ? <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Brak.</p> : (
            <table className="w-full">
              <thead><tr><th className={th}>Co</th><th className={th}>Status</th><th className={th}>Kiedy</th></tr></thead>
              <tbody className="divide-y divide-[var(--mf-surface-hover)]">
                {orders.map((o, i) => <tr key={`o${i}`}><td className={td}>{o.product} · {zl(Number(o.amount_total ?? 0))}</td><td className={td}>{o.status}</td><td className={td}>{when(o.created_at)}</td></tr>)}
                {trials.map((t, i) => <tr key={`t${i}`}><td className={td}>Darmowa próba</td><td className={td}>{t.status}</td><td className={td}>{when(t.created_at)}</td></tr>)}
              </tbody>
            </table>
          )}
        </Card>
        <Card title="Historia zmian">
          {history.length === 0 ? <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Brak.</p> : (
            <ul className="divide-y divide-[var(--mf-surface-hover)]">{history.map((h, i) => <li key={i} className="py-2 text-[15px]">{when(h.ts)} · {String(h.action).replace("crm_", "").replaceAll("_", " ")}</li>)}</ul>
          )}
        </Card>
      </div>
    </AdminShell>
  )
}
