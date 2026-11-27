import Link from "next/link"
import { AdminShell, Card, Tile, td, th, when } from "@/components/admin/shell"
import { requireAdmin } from "@/lib/admin/server"
import { sql } from "@/lib/mf/db"
import { AUDYT, type Metrics, type Report } from "@/lib/audyt/core"
import { ctaFor, statusLabel } from "@/lib/audyt/server"
import { SEQUENCE } from "@/lib/audyt/sequence"

// Darmowy audyt Instagrama: pierwsze 30 audytów akceptuje Wiktoria (podgląd, poprawki, „Wyślij”). Nic nie wychodzi samo.
const SEG: Record<string, string> = { rozmowa: "firma z budżetem → rozmowa", mf: "robi rolki sama → MontageFrames", porady: "bez budżetu / prywatny → porady" }
const field = "w-full rounded-[14px] border border-[var(--mf-line)] bg-[var(--mf-bg)] px-3 py-2.5 text-[16px] leading-[1.5]"

export default async function Audyty({ searchParams }: { searchParams: Promise<{ id?: string; s?: string }> }) {
  const email = await requireAdmin()
  const q = await searchParams
  const db = sql()
  // Zapytania po kolei (jak w PR #48: równoległe połączenia przez pooler wieszały panel).
  const [stats] = await db`select count(*) filter (where status = 'do_akceptacji')::int as czeka,
              count(*) filter (where status = 'wyslany' and reviewed_at is not null and not tester)::int as zaakceptowane,
              count(*) filter (where created_at > now() - interval '24 hours' and not tester)::int as doba,
              (select coalesce(sum(cost_usd), 0)::float from ws_audit_reports where created_at >= date_trunc('month', now())) as koszt,
              count(*) filter (where status = 'potwierdzony' and note = 'czeka_na_meta')::int as meta
       from ws_audit_requests`
  const list = await db`select id, handle, email, status, segment, source, tester, created_at, note from ws_audit_requests
       where handle is not null order by (status = 'do_akceptacji') desc, created_at desc limit 100`
  const id = /^[0-9a-f-]{36}$/.test(q.id ?? "") ? q.id! : list.find((r) => r.status === "do_akceptacji")?.id
  const [sel] = id ? await db`select q.*, p.metrics, p.report, p.report_edited, p.model, p.cost_usd from ws_audit_requests q left join ws_audit_reports p on p.request_id = q.id where q.id = ${id}` : []
  const report = (sel?.report_edited ?? sel?.report) as Report | undefined
  const metrics = sel?.metrics as Metrics | undefined
  return (
    <AdminShell email={email} active="/admin/audyty" title="Audyty Instagrama">
      {q.s && <p role="status" className="mb-4 rounded-[16px] bg-[var(--mf-accent-soft)] px-4 py-3 text-[15px] font-semibold">{q.s === "wyslany" ? "Audyt wysłany." : q.s === "odrzucony" ? "Audyt odrzucony, nic nie wyszło." : q.s === "zapisany" ? "Poprawki zapisane." : "Nie udało się. Odśwież i spróbuj ponownie."}</p>}
      <section className="mb-4 grid gap-4 sm:grid-cols-4">
        <Tile label="Czeka na akceptację" value={String(stats.czeka)} />
        <Tile label="Zaakceptowane" value={`${stats.zaakceptowane} / ${AUDYT.reviewFirst}`} sub="potem tryb automatyczny (AUDYT_AUTO=1)" />
        <Tile label="Zgłoszenia z 24 h" value={`${stats.doba} / ${process.env.AUDYT_DAILY_CAP || AUDYT.dailyCap}`} sub="limit dzienny pod darmowy Resend" />
        <Tile label="Koszt AI w miesiącu" value={`${Number(stats.koszt).toFixed(2)} USD`} sub={`twardy limit ${process.env.AUDYT_AI_MONTHLY_USD || AUDYT.aiMonthlyUsd} USD`} />
      </section>
      {stats.meta > 0 && <p className="mb-4 rounded-[16px] bg-[var(--mf-bg)] px-4 py-3 text-[15px]">{stats.meta} zgłoszeń czeka na podłączenie aplikacji Meta (instrukcja: Shared/wiktoriaskopek/META-INSTRUKCJA.md).</p>}

      {sel && report && (
        <Card title={`@${sel.handle} · ${statusLabel[sel.status] ?? sel.status}`} note={`${SEG[sel.segment] ?? sel.segment} · źródło: ${sel.source ?? "—"} · ${sel.model ?? ""} ${sel.cost_usd ? `${Number(sel.cost_usd).toFixed(4)} USD` : ""}${sel.tester ? " · TEST" : ""}`}>
          <form method="post" action="/api/admin/audyty" className="flex flex-col gap-4">
            <input type="hidden" name="id" value={sel.id} />
            <label className="flex flex-col gap-1.5 text-[14px] font-semibold">Ocena (1 zdanie)<textarea name="ocena" defaultValue={report.ocena} rows={2} className={field} /></label>
            {report.najlepsza && <label className="flex flex-col gap-1.5 text-[14px] font-semibold">Najlepsza rolka<textarea name="najlepsza" defaultValue={report.najlepsza} rows={2} className={field} /></label>}
            {report.obserwacje.map((o, i) => (
              <label key={i} className="flex flex-col gap-1.5 text-[14px] font-semibold">{i + 1}. {o.tytul}
                <input type="hidden" name={`tytul${i}`} value={o.tytul} />
                <textarea name={`obs${i}`} defaultValue={o.tekst} rows={3} className={field} />
              </label>
            ))}
            <label className="flex flex-col gap-1.5 text-[14px] font-semibold">Zadanie na ten tydzień<textarea name="zadanie" defaultValue={report.zadanie} rows={2} className={field} /></label>
            <p className="text-[14px] text-[var(--mf-ink-2)]">CTA w mailu: „{ctaFor({ id: sel.id, segment: sel.segment, newsletter: false }).label}” · adresat: {sel.email}</p>
            {sel.status === "do_akceptacji" && (
              <div className="flex flex-wrap gap-3">
                <button name="action" value="wyslij" className="min-h-12 rounded-full bg-[var(--mf-accent)] px-6 text-[16px] font-bold text-[var(--mf-on-accent)]">Wyślij audyt</button>
                <button name="action" value="zapisz" className="min-h-12 rounded-full bg-[var(--mf-surface)] px-6 text-[16px] font-semibold">Zapisz poprawki</button>
                <button name="action" value="odrzuc" className="min-h-12 rounded-full px-6 text-[16px] font-semibold text-[var(--mf-danger)]">Odrzuć (nic nie wyjdzie)</button>
              </div>
            )}
          </form>
          {metrics?.criteria?.length ? (
            <details className="mt-6">
              <summary className="cursor-pointer text-[15px] font-semibold">Wszystkie kryteria ({metrics.criteria.length})</summary>
              <table className="mt-3 w-full min-w-[560px]"><tbody className="divide-y divide-[var(--mf-surface-hover)]">
                {metrics.criteria.map((c) => <tr key={c.id}><td className={td}>{c.id}. {c.label}</td><td className={td}>{c.valueText}</td><td className={td}>{c.status}</td></tr>)}
              </tbody></table>
            </details>
          ) : null}
        </Card>
      )}

      <div className="mt-4">
        <Card title="Zgłoszenia" note="Najnowsze 100. Dane kasujemy po 30 dniach (retencja).">
          <table className="w-full min-w-[720px]">
            <thead><tr><th className={th}>Data</th><th className={th}>Profil</th><th className={th}>E-mail</th><th className={th}>Segment</th><th className={th}>Status</th></tr></thead>
            <tbody className="divide-y divide-[var(--mf-surface-hover)]">
              {list.length === 0 && <tr><td className={td} colSpan={5}>Brak zgłoszeń.</td></tr>}
              {list.map((r) => (
                <tr key={r.id}>
                  <td className={td}>{when(r.created_at)}</td>
                  <td className={td}><Link className="font-semibold underline" href={`/admin/audyty?id=${r.id}`}>@{r.handle}</Link>{r.tester ? " · test" : ""}</td>
                  <td className={`${td} break-all`}>{r.email}</td>
                  <td className={td}>{r.segment}</td>
                  <td className={td}>{statusLabel[r.status] ?? r.status}{r.note ? ` (${r.note})` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Porady po audycie (sekwencja)" note={process.env.AUDYT_SEQUENCE === "1" ? "Włączona" : "Wyłączona: włącz AUDYT_SEQUENCE=1 po przeczytaniu treści"}>
          <ol className="flex flex-col gap-3 text-[15px]">
            {SEQUENCE.map((s) => <li key={s.day}><strong>Dzień {s.day}{s.only ? ` (tylko: ${s.only.join(", ")})` : ""}: {s.subject}.</strong> {s.body.join(" ")}</li>)}
          </ol>
        </Card>
      </div>
    </AdminShell>
  )
}
