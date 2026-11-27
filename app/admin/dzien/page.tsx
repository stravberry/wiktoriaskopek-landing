import { AdminShell, Card } from "@/components/admin/shell"
import { Notice, SyncBar } from "@/components/admin/most"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"

// Dzień: Kalendarz Google (dziś i 7 dni) oraz Google Tasks z odhaczaniem. Dane z kopii, którą wkłada most na Macu (Composio).
const TZ = "Europe/Warsaw"
const hour = (d: Date) => new Date(d).toLocaleTimeString("pl-PL", { timeZone: TZ, hour: "2-digit", minute: "2-digit" })
const dayLabel = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("pl-PL", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" })
const dueLabel = (d: string) => (d ? new Date(`${d}T12:00:00Z`).toLocaleDateString("pl-PL", { timeZone: "UTC", day: "numeric", month: "short" }) : null)

type Ev = { id: string; title: string; starts_at: Date; ends_at: Date; all_day: boolean; link: string | null; location: string | null; day: string }

function Event({ e }: { e: Ev }) {
  return (
    <li className="flex gap-4 py-2.5">
      <span className="w-[92px] shrink-0 text-[15px] font-semibold tabular-nums text-[var(--mf-ink-2)]">{e.all_day ? "cały dzień" : `${hour(e.starts_at)}–${hour(e.ends_at)}`}</span>
      <span className="min-w-0 text-[15px]">
        {e.link ? <a href={e.link} target="_blank" rel="noreferrer" className="font-semibold underline-offset-2 hover:underline">{e.title}</a> : <span className="font-semibold">{e.title}</span>}
        {e.location && <span className="block text-[13px] text-[var(--mf-ink-2)]">{e.location}</span>}
      </span>
    </li>
  )
}

export default async function Dzien({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const email = await requireAdmin()
  const q = await searchParams
  const db = sql()
  // Zapytania po kolei (PR #48: równoległe połączenia przez pooler wieszały panel).
  const events = (await db`select id, title, starts_at, ends_at, all_day, link, location,
       to_char(case when all_day then starts_at::date else (starts_at at time zone ${TZ})::date end, 'YYYY-MM-DD') as day
     from ws_calendar
     where ends_at > now() and starts_at < (date_trunc('day', now() at time zone ${TZ}) + interval '8 days') at time zone ${TZ}
     order by all_day desc, starts_at`) as unknown as Ev[]
  const tasks = await db`select id, title, to_char(due, 'YYYY-MM-DD') as due, done, completed_at, list_title from ws_tasks
     where not done or completed_at > now() - interval '3 days'
     order by done, due nulls last, position`
  const pending = await db`select kind, payload->>'task_id' as task_id from ws_commands where status in ('pending', 'running')`
  const sync = await db`select source, last_ok, last_error, last_error_at, items, coalesce(last_ok < now() - interval '45 minutes', true) as stale from ws_sync where source in ('calendar', 'tasks')`
  const [{ today }] = await db`select to_char((now() at time zone ${TZ})::date, 'YYYY-MM-DD') as today`
  const busy = new Set(pending.filter((p) => p.task_id).map((p) => p.task_id as string))
  const days = [...new Set(events.map((e) => e.day))].sort()
  const todays = events.filter((e) => e.day === today)
  const open = tasks.filter((t) => !t.done)
  const late = open.filter((t) => t.due && t.due < today).length
  return (
    <AdminShell email={email} active="/admin/dzien" title="Dzień">
      <Notice s={q.s} />
      <SyncBar rows={sync as never} sources={["calendar", "tasks"]} back="/admin/dzien" pending={pending.some((p) => p.kind === "sync_now")} />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card title="Dziś" note={dayLabel(today)}>
          {todays.length ? <ul className="divide-y divide-[var(--mf-surface-hover)]">{todays.map((e) => <Event key={e.id} e={e} />)}</ul> : <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Na dziś nic w kalendarzu.</p>}
        </Card>
        <Card title={`Zadania (${open.length})`} note={late ? `${late} po terminie` : "Google Tasks"}>
          {tasks.length === 0 && <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Brak zadań.</p>}
          <ul className="divide-y divide-[var(--mf-surface-hover)]">
            {tasks.map((t) => {
              const due = t.due as string | null
              const wait = busy.has(t.id)
              return (
                <li key={t.id} className="flex items-center gap-3 py-2">
                  <form method="post" action="/api/admin/most">
                    <input type="hidden" name="kind" value={t.done ? "task_reopen" : "task_complete"} />
                    <input type="hidden" name="task_id" value={t.id} />
                    <input type="hidden" name="back" value="/admin/dzien" />
                    <button
                      disabled={wait}
                      aria-label={t.done ? `Przywróć: ${t.title}` : `Zrobione: ${t.title}`}
                      className={`grid size-10 place-items-center rounded-full text-[18px] font-bold ${t.done ? "bg-[var(--mf-success-soft)] text-[var(--mf-success)]" : "bg-[var(--mf-surface)] hover:bg-[var(--mf-surface-hover)]"} disabled:opacity-50`}
                    >
                      {wait ? "…" : t.done ? "✓" : ""}
                    </button>
                  </form>
                  <span className={`min-w-0 flex-1 text-[15px] ${t.done ? "text-[var(--mf-ink-2)] line-through" : ""}`}>{t.title}</span>
                  {due && <span className={`shrink-0 text-[13px] tabular-nums ${!t.done && due < today ? "font-semibold text-[var(--mf-danger)]" : "text-[var(--mf-ink-2)]"}`}>{dueLabel(due)}</span>}
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
      <div className="mt-4">
        <Card title="Najbliższy tydzień" note="Kalendarz Google, konto wskopek.all@gmail.com">
          {days.filter((d) => d !== today).map((d) => (
            <div key={d} className="py-2">
              <h3 className="text-[14px] font-semibold capitalize text-[var(--mf-ink-2)]">{dayLabel(d)}</h3>
              <ul className="divide-y divide-[var(--mf-surface-hover)]">{events.filter((e) => e.day === d).map((e) => <Event key={e.id} e={e} />)}</ul>
            </div>
          ))}
          {days.filter((d) => d !== today).length === 0 && <p className="py-2 text-[15px] text-[var(--mf-ink-2)]">Pusty tydzień.</p>}
        </Card>
      </div>
    </AdminShell>
  )
}
