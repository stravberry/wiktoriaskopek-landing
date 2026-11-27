import { AutoRefresh } from "@/components/admin/auto-refresh"
import { when } from "@/components/admin/shell"

// Wspólne elementy widoków z mostu na Macu: stan synchronizacji, komunikat po akcji, przycisk „Odśwież”.
type Sync = { source: string; last_ok: Date | null; last_error: string | null; last_error_at: Date | null; items: number | null; stale: boolean }
const NAME: Record<string, string> = { calendar: "Kalendarz", tasks: "Google Tasks", clickup: "ClickUp" }
const MSG: Record<string, string> = {
  "w-toku": "Przyjęte. Most na Macu wykonuje to teraz, widok odświeży się sam.",
  limit: "Limit poleceń na godzinę wyczerpany. Spróbuj za chwilę.",
  blad: "Nie udało się. Odśwież stronę i spróbuj ponownie.",
}

export function Notice({ s }: { s?: string }) {
  if (!s || !MSG[s]) return null
  return <p role="status" className="mb-4 rounded-[16px] bg-[var(--mf-accent-soft)] px-4 py-3 text-[15px] font-semibold">{MSG[s]}</p>
}

export function SyncBar({ rows, sources, back, pending, syncing = pending }: { rows: Sync[]; sources: string[]; back: string; pending: boolean; syncing?: boolean }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-[var(--mf-bg)] px-4 py-3">
      <AutoRefresh active={pending} />
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-[var(--mf-ink-2)]">
        {sources.map((src) => {
          const r = rows.find((x) => x.source === src)
          const err = r?.last_error && (!r.last_ok || (r.last_error_at && r.last_error_at > r.last_ok))
          return (
            <li key={src}>
              <span className="font-semibold text-[var(--mf-ink)]">{NAME[src]}</span>{" "}
              {r?.last_ok ? `odświeżone ${when(r.last_ok)}` : "jeszcze bez danych"}
              {err && <span className="text-[var(--mf-danger)]"> · błąd: {r!.last_error}</span>}
              {!err && (!r || r.stale) && <span className="text-[var(--mf-danger)]"> · synchronizacja stoi (Mac wyłączony?)</span>}
            </li>
          )
        })}
      </ul>
      <form method="post" action="/api/admin/most">
        <input type="hidden" name="kind" value="sync_now" />
        <input type="hidden" name="back" value={back} />
        <button disabled={syncing} className="min-h-10 rounded-full bg-[var(--mf-surface)] px-4 text-[15px] font-semibold hover:bg-[var(--mf-surface-hover)] disabled:opacity-60">
          {syncing ? "Odświeżanie…" : "Odśwież teraz"}
        </button>
      </form>
    </div>
  )
}
