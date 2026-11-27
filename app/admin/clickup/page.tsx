import Link from "next/link"
import { AdminShell, Card, td, th } from "@/components/admin/shell"
import { Notice, SyncBar } from "@/components/admin/most"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

// ClickUp „Moje zadania” (otwarte zadania przypisane do Wiktorii w obu przestrzeniach). Tylko odczyt; zmiana statusu w kolejnym kroku.
const TZ = "Europe/Warsaw"
const TEAM: Record<string, string> = { "9012544963": "DKW Group", "90122131182": "Świeża Bryka Ameryka" }
const FILTERS = [
  ["", "Wszystkie"],
  ["po-terminie", "Po terminie"],
  ["tydzien", "Ten tydzień"],
  ["bez-terminu", "Bez terminu"],
] as const
const date = (d: Date | null) => (d ? new Date(d).toLocaleString("pl-PL", { timeZone: TZ, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—")

export default async function ClickUp({ searchParams }: { searchParams: Promise<{ f?: string; bloki?: string; s?: string }> }) {
  const email = await requireAdmin()
  const q = await searchParams
  const f = FILTERS.some(([k]) => k === q.f) ? q.f ?? "" : ""
  const blocks = q.bloki === "1"
  const db = sql()
  // Bloki „Dostępność Wiktorii” to wpisy kalendarzowe z automatyzacji, domyślnie ukryte.
  const rows = await db`select id, team, name, status, due, starts_at, list_name, folder_name, url, priority, due < now() as late from ws_clickup
     where (${blocks} or coalesce(list_name, '') <> 'Dostępność Wiktorii')
       and (${f} <> 'po-terminie' or due < now())
       and (${f} <> 'tydzien' or (due >= date_trunc('week', now() at time zone ${TZ}) at time zone ${TZ} and due < (date_trunc('week', now() at time zone ${TZ}) + interval '7 days') at time zone ${TZ}))
       and (${f} <> 'bez-terminu' or due is null)
     order by due nulls last, name limit 500`
  const [c] = await db`select count(*) filter (where due < now() and coalesce(list_name, '') <> 'Dostępność Wiktorii')::int as late,
       count(*) filter (where coalesce(list_name, '') <> 'Dostępność Wiktorii')::int as all, count(*) filter (where list_name = 'Dostępność Wiktorii')::int as blocks from ws_clickup`
  const sync = await db`select source, last_ok, last_error, last_error_at, items, coalesce(last_ok < now() - interval '45 minutes', true) as stale from ws_sync where source = 'clickup'`
  const [p] = await db`select count(*)::int as n from ws_commands where kind = 'sync_now' and status in ('pending', 'running')`
  const href = (nf: string, nb = blocks) => `/admin/clickup?${new URLSearchParams({ ...(nf ? { f: nf } : {}), ...(nb ? { bloki: "1" } : {}) })}`
  return (
    <AdminShell email={email} active="/admin/clickup" title="ClickUp · moje zadania">
      <Notice s={q.s} />
      <SyncBar rows={sync as never} sources={["clickup"]} back="/admin/clickup" pending={p.n > 0} />
      <nav aria-label="Filtry" className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map(([k, label]) => (
          <Link key={k} href={href(k)} aria-current={f === k ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-full px-4 text-[15px] font-semibold ${f === k ? "bg-[var(--mf-ink)] text-[var(--mf-bg)]" : "bg-[var(--mf-bg)] text-[var(--mf-ink-2)] hover:bg-[var(--mf-surface-hover)]"}`}>
            {label}{k === "po-terminie" && c.late ? ` (${c.late})` : ""}
          </Link>
        ))}
        <Link href={href(f, !blocks)} className="ml-auto text-[14px] font-semibold text-[var(--mf-accent-ink)] underline-offset-2 hover:underline">
          {blocks ? "Ukryj bloki dostępności" : `Pokaż bloki dostępności (${c.blocks})`}
        </Link>
      </nav>
      <Card title={`Zadania (${rows.length})`} note={`otwarte: ${c.all} · źródło: ClickUp, przypisane do Wiktorii`}>
        <table className="w-full min-w-[760px]">
          <thead><tr><th className={th}>Zadanie</th><th className={th}>Status</th><th className={th}>Termin</th><th className={th}>Lista</th><th className={th}>Przestrzeń</th></tr></thead>
          <tbody className="divide-y divide-[var(--mf-surface-hover)]">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className={td}>{r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="font-semibold underline-offset-2 hover:underline">{r.name}</a> : r.name}</td>
                <td className={`${td} whitespace-nowrap`}>{r.status ?? "—"}</td>
                <td className={`${td} whitespace-nowrap tabular-nums ${r.late ? "font-semibold text-[var(--mf-danger)]" : ""}`}>{date(r.due)}</td>
                <td className={td}>{r.list_name ?? "—"}{r.folder_name && r.folder_name !== "hidden" ? <span className="block text-[13px] text-[var(--mf-ink-2)]">{r.folder_name}</span> : null}</td>
                <td className={`${td} whitespace-nowrap`}>{TEAM[r.team] ?? r.team}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className={td} colSpan={5}>Brak zadań dla tego filtra.</td></tr>}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  )
}
