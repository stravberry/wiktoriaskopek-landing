// Darmowy audyt Instagrama: baza, maile, kolejka, akceptacja, retencja (tylko serwer).
import { createHmac, timingSafeEqual } from "node:crypto"
import { Resend } from "resend"
import { render } from "@react-email/components"
import type React from "react"
import { sql } from "@/lib/mf/db"
import { normalizedEmail, randomToken, resendConfigured, sha256 } from "@/lib/mf/core"
import { mailFrom, origin, replyTo, secret } from "@/lib/mf/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { AUDYT, AUDYT_TEXT, audytEnabled, computeManualMetrics, computeMetrics, draftReport, mergeAiReport, type AuditInput, type IgProfile, type ManualData, type Metrics, type Report, segmentFor } from "./core"
import { businessDiscovery, metaConfigured } from "./meta"
import { TEST_HANDLES, testProfile } from "./fixtures"
import { aiConfigured, polishReport } from "./ai"
import { AudytConfirmEmail, AudytNoDataEmail, AudytReportEmail, AudytReviewEmail, audytConfirmText, audytNoDataText, audytReportText, type AudytCta } from "@/emails/audyt-email"

const UTM = "utm_source=audyt_ig&utm_medium=email&utm_campaign=audyt_ig"

// ---------- maile ----------
let resendClient: Resend | null = null
const resend = () => (resendClient ??= new Resend(process.env.RESEND_API_KEY))
const outboxMode = () => !resendConfigured(process.env.RESEND_API_KEY) && process.env.MF_MAIL_MODE === "outbox"

type Mail = { key: string; kind: string; to: string; subject: string; react: React.ReactElement; text: string; marketing?: boolean; unsubscribeUrl?: string | null }

/** Każdy mail raz (ws_mail_log) i w dziennym budżecie maili funkcji (sprzedażowe czekają, gdy budżet się skończy). */
export async function sendAudytMail(m: Mail): Promise<"ok" | "juz" | "budzet"> {
  const db = sql()
  if (m.marketing) {
    const [{ n }] = await db`select count(*)::int as n from ws_mail_log where created_at > now() - interval '24 hours'`
    if (n >= Number(process.env.AUDYT_MAIL_DAILY || AUDYT.mailDaily)) return "budzet"
  }
  const ins = await db`insert into ws_mail_log (idempotency_key, kind) values (${m.key}, ${m.kind}) on conflict (idempotency_key) do nothing returning 1`
  if (!ins.length) return "juz"
  try {
    if (outboxMode()) {
      await db`insert into mf_mail_outbox (idempotency_key, to_email, subject, body_text, body_html)
               values (${m.key}, ${m.to}, ${m.subject}, ${m.text}, ${await render(m.react)}) on conflict (idempotency_key) do nothing`
      return "ok"
    }
    const headers = m.unsubscribeUrl ? { "List-Unsubscribe": `<${m.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : undefined
    const { error } = await resend().emails.send({ from: mailFrom(), to: m.to, replyTo: replyTo(), subject: m.subject, react: m.react, text: m.text, headers }, { idempotencyKey: m.key })
    if (error) throw new Error(`Resend: ${error.name}`)
    return "ok"
  } catch (e) {
    await db`delete from ws_mail_log where idempotency_key = ${m.key}`
    throw e
  }
}

// ---------- podpisy linków ----------
const hmac = (data: string) => createHmac("sha256", secret()).update(`audyt-v1:${data}`).digest("base64url")
const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}
/** Link „Zapisz się na porady” z maila audytu (30 dni). */
export function poradyLink(requestId: string, nowMs = Date.now()) {
  const exp = Math.floor(nowMs / 1000) + 30 * 86400
  return `${origin()}/audyt/porady?r=${requestId}&x=${exp}&s=${hmac(`porady:${requestId}:${exp}`)}`
}
export function verifyPorady(r: string, x: string, s: string, nowMs = Date.now()) {
  if (!/^[0-9a-f-]{36}$/.test(r) || !/^\d{10}$/.test(x) || Number(x) * 1000 < nowMs || typeof s !== "string") return false
  return safeEq(hmac(`porady:${r}:${x}`), s)
}
/** Token wypisu: wyliczany z adresu (do każdego maila), w bazie tylko jego skrót. */
export const unsubToken = (email: string) => hmac(`wypis:${email.toLowerCase()}`)
export const unsubUrl = (email: string) => `${origin()}/audyt/wypis?t=${unsubToken(email)}`

// ---------- zgłoszenie ----------
export type SubmitResult = { ok: true } | { ok: false; status: number; error: string }

export async function submitAudit(input: AuditInput, opts: { ipHash: string; utm: Record<string, string>; tester: boolean }): Promise<SubmitResult> {
  const db = sql()
  const norm = normalizedEmail(input.email)
  const [lim] = await db`
    select count(*) filter (where not tester and created_at > now() - interval '24 hours')::int as day,
           count(*) filter (where ip_hash = ${opts.ipHash} and created_at > now() - interval '24 hours')::int as ip,
           count(*) filter (where (email_norm = ${norm} or handle = ${input.handle}) and status not in ('brak_danych')
                              and not (status = 'czeka' and confirm_expires_at < now()))::int as dup
    from ws_audit_requests where created_at > now() - make_interval(days => ${AUDYT.repeatDays})`
  if (!opts.tester) {
    if (lim.day >= Number(process.env.AUDYT_DAILY_CAP || AUDYT.dailyCap)) return { ok: false, status: 429, error: "Na dziś wszystkie miejsca na audyty są zajęte. Wróć jutro: codziennie robimy ograniczoną liczbę audytów, bo pierwsze czyta osobiście Wiktoria." }
    if (lim.ip >= AUDYT.perIpDay) return { ok: false, status: 429, error: "Z tego połączenia wysłano już kilka zgłoszeń. Spróbuj jutro." }
    if (lim.dup > 0) return { ok: false, status: 409, error: "Ten profil albo ten adres miał już audyt w ostatnich 30 dniach. Sprawdź skrzynkę, także folder Oferty i Spam." }
  }
  const token = randomToken()
  const segment = segmentFor(input)
  const [row] = await db`
    insert into ws_audit_requests (email, email_norm, handle, profile_type, who_makes, budget, manual, owner_declared, newsletter, utm, ip_hash, confirm_hash, confirm_expires_at, segment, tester)
    values (${input.email}, ${norm}, ${input.handle}, ${input.profileType}, ${input.whoMakes}, ${input.budget}, ${input.manual ? db.json(input.manual) : null},
            true, ${input.newsletter}, ${db.json(opts.utm)}, ${opts.ipHash}, ${sha256(token)}, now() + make_interval(hours => ${AUDYT.confirmHours}), ${segment}, ${opts.tester})
    returning id`
  if (input.newsletter) {
    await db`insert into ws_consents (email, kind, text_version, text_snapshot, request_id, ip_hash)
             values (${input.email}, 'newsletter', ${AUDYT_TEXT.newsletterVersion}, ${AUDYT_TEXT.newsletter}, ${row.id}, ${opts.ipHash})`
  }
  const url = `${origin()}/audyt/potwierdz?t=${token}`
  try {
    await sendAudytMail({ key: `audyt-potwierdz/${row.id}`, kind: "potwierdzenie", to: input.email, subject: `Potwierdź adres: audyt @${input.handle}`, react: AudytConfirmEmail({ url, handle: input.handle, newsletter: input.newsletter }), text: audytConfirmText(url, input.handle) })
  } catch (e) {
    console.error("[audyt] confirm mail:", e instanceof Error ? e.message : e)
    await db`delete from ws_audit_requests where id = ${row.id}`
    return { ok: false, status: 502, error: "Nie udało się wysłać maila. Sprawdź adres i spróbuj ponownie." }
  }
  return { ok: true }
}

/** Kliknięcie „Potwierdzam” (POST ze strony, nie sam GET z maila: skanery poczty otwierają linki). */
export async function confirmAudit(token: string) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return null
  const db = sql()
  const [r] = await db`
    update ws_audit_requests set status = 'potwierdzony', confirmed_at = now(), confirm_hash = null
    where confirm_hash = ${sha256(token)} and status = 'czeka' and confirm_expires_at > now()
    returning id, email, newsletter, segment`
  if (!r) return null
  if (r.newsletter) await confirmNewsletter(r.email, r.id, r.segment)
  return r.id as string
}

/** Double opt-in zakończony: zgoda potwierdzona, adres na liście porad (ponowny zapis po wypisie też tędy). */
export async function confirmNewsletter(email: string, requestId: string | null, segment: string | null, consentId: number | null = null) {
  const db = sql()
  const [c] = consentId
    ? await db`update ws_consents set confirmed_at = now() where id = ${consentId} returning id`
    : await db`update ws_consents set confirmed_at = now() where id = (select id from ws_consents where request_id = ${requestId} and kind = 'newsletter' order by id desc limit 1) returning id`
  await db`
    insert into ws_newsletter (email, consent_id, segment, request_id, unsub_hash, confirmed_at)
    values (${email.toLowerCase()}, ${c?.id ?? null}, ${segment}, ${requestId}, ${sha256(unsubToken(email))}, now())
    on conflict (email) do update set consent_id = excluded.consent_id, segment = excluded.segment, request_id = excluded.request_id,
      confirmed_at = now(), unsubscribed_at = null`
}

export async function unsubscribe(token: string) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return false
  const db = sql()
  const [n] = await db`update ws_newsletter set unsubscribed_at = coalesce(unsubscribed_at, now()), next_at = null where unsub_hash = ${sha256(token)} returning email`
  if (!n) return false
  await db`update ws_consents set withdrawn_at = coalesce(withdrawn_at, now()) where lower(email) = ${n.email} and kind = 'newsletter' and withdrawn_at is null`
  return true
}

// ---------- analiza ----------
type Req = {
  id: string; email: string; handle: string; segment: "rozmowa" | "mf" | "porady"; manual: ManualData | null; tester: boolean; newsletter: boolean
}

export function ctaFor(req: Pick<Req, "id" | "segment" | "newsletter"> & { budget?: string; profileType?: string; noWeakness?: boolean }): AudytCta {
  // Profil bez słabości + firma z budżetem = kandydat na reklamy Meta, niezależnie od tego, kto robi rolki (Kierownik, D5).
  const bigBudget = req.budget === "1-5k" || req.budget === "5k+"
  if (req.segment === "rozmowa" || (req.noWeakness && bigBudget && req.profileType !== "prywatny")) return { lead: "Chcesz przejść przez ten audyt razem i ułożyć plan rolek oraz reklam Meta dla Twojej firmy?", label: "Umów 20 min rozmowy o audycie", url: `${origin()}/?${UTM}#rezerwacja` }
  if (req.segment === "mf") return { lead: "Sam(a) montujesz rolki? MontageFrames montuje je w Twoim stylu: 238 zł jednorazowo albo 589 zł z instalacją razem z Wiktorią.", label: "Zobacz MontageFrames", url: `${origin()}${MF_BASE_PATH}?${UTM}` }
  if (req.newsletter) return { lead: "Pierwsza porada przyjdzie za 2 dni. Masz pytanie do audytu? Odpisz na tego maila.", label: "Zobacz, co robi Wiktoria", url: `${origin()}/?${UTM}` }
  return { lead: "Chcesz co tydzień jedną konkretną poradę o rolkach dla firmy?", label: "Zapisz się na porady", url: poradyLink(req.id) }
}

async function monthSpent() {
  const [r] = await sql()`select coalesce(sum(cost_usd), 0)::float as usd from ws_audit_reports where created_at >= date_trunc('month', now())`
  return r.usd as number
}

export type ProcessOutcome = "pusto" | "do_akceptacji" | "wyslany" | "brak_danych" | "czeka_na_meta" | "blad" | "wylaczony"

/** Jeden audyt z kolejki (bezpieczne przy równoległych wywołaniach: blokada wiersza i dzierżawa 3 min). */
export async function processOne(env = process.env): Promise<ProcessOutcome> {
  // Audyt wyłączony (audytEnabled): kolejka stoi, nic nie liczymy i nic nie wysyłamy. Zgłoszenia zostają w bazie.
  if (!audytEnabled(env)) return "wylaczony"
  const db = sql()
  const [req] = (await db`
    update ws_audit_requests set status = 'analiza', lease_until = now() + interval '3 minutes', attempts = attempts + 1
    where id = (
      select id from ws_audit_requests
      where (status = 'potwierdzony' and coalesce(note, '') <> 'czeka_na_meta') or (status = 'analiza' and lease_until < now())
      order by confirmed_at limit 1 for update skip locked)
    returning id, email, handle, segment, manual, tester, newsletter, attempts`) as unknown as (Req & { attempts: number })[]
  if (!req) return "pusto"
  try {
    let profile: IgProfile | null = null
    let metrics: Metrics
    if (req.manual) metrics = computeManualMetrics(req.manual)
    else if (req.tester && (TEST_HANDLES as readonly string[]).includes(req.handle)) {
      profile = testProfile(req.handle)
      metrics = computeMetrics(profile as IgProfile, "test")
    } else if (metaConfigured(env)) {
      const d = await businessDiscovery(req.handle, env)
      if (!d.ok && d.reason === "blad") throw new Error(`Meta: ${d.detail}`)
      if (!d.ok) return await noData(req)
      profile = d.profile
      metrics = computeMetrics(profile, "meta")
    } else {
      // Bez aplikacji Meta zgłoszenie czeka w kolejce (cron spróbuje, gdy pojawi się konfiguracja).
      await db`update ws_audit_requests set status = 'potwierdzony', note = 'czeka_na_meta', attempts = greatest(attempts - 1, 0), lease_until = null where id = ${req.id}`
      return "czeka_na_meta"
    }
    if (!metrics.enough) return await noData(req)

    const draft = draftReport(metrics, req.handle)
    let report: Report = draft
    let tokens = { input: 0, output: 0, cost: 0, model: "bez modelu" }
    const cap = Number(env.AUDYT_AI_MONTHLY_USD || AUDYT.aiMonthlyUsd)
    if (aiConfigured(env) && (await monthSpent()) + 0.05 < cap) {
      const ai = await polishReport(draft, metrics, profile, env)
      tokens = { input: ai.inputTokens, output: ai.outputTokens, cost: ai.cost, model: env.AUDYT_MODEL || AUDYT.model }
      if (ai.ok) report = mergeAiReport(draft, ai.json).report
      else console.error("[audyt] AI:", ai.error)
    }
    await db`
      insert into ws_audit_reports (request_id, data, metrics, report, model, input_tokens, output_tokens, cost_usd)
      values (${req.id}, ${profile ? db.json(profile as never) : null}, ${db.json(metrics as never)}, ${db.json(report as never)}, ${tokens.model}, ${tokens.input}, ${tokens.output}, ${tokens.cost})
      on conflict (request_id) do update set data = excluded.data, metrics = excluded.metrics, report = excluded.report, model = excluded.model,
        input_tokens = ws_audit_reports.input_tokens + excluded.input_tokens, output_tokens = ws_audit_reports.output_tokens + excluded.output_tokens,
        cost_usd = ws_audit_reports.cost_usd + excluded.cost_usd`

    const [{ reviewed }] = await db`select count(*)::int as reviewed from ws_audit_requests where status = 'wyslany' and reviewed_at is not null and not tester`
    const auto = env.AUDYT_AUTO === "1" && reviewed >= AUDYT.reviewFirst
    await db`update ws_audit_requests set status = 'do_akceptacji', source = ${metrics.source}, analysed_at = now(), lease_until = null, note = null where id = ${req.id}`
    if (auto) {
      await sendReport(req.id, null)
      return "wyslany"
    }
    await notifyReview(req)
    return "do_akceptacji"
  } catch (e) {
    console.error("[audyt] process:", e instanceof Error ? e.message : e)
    await db`update ws_audit_requests set status = case when attempts >= 3 then 'blad' else 'potwierdzony' end, lease_until = null, note = ${String(e instanceof Error ? e.message : e).slice(0, 200)} where id = ${req.id}`
    return "blad"
  }
}

/** Mail do Wiktorii „audyt czeka na akceptację”. Błąd zapisujemy w note; cron ponawia (notifyPendingReviews). */
async function notifyReview(req: Pick<Req, "id" | "handle" | "segment">, env = process.env) {
  const db = sql()
  const [{ n }] = await db`select count(*)::int as n from ws_audit_requests where status = 'do_akceptacji'`
  try {
    await sendAudytMail({
      key: `audyt-przeglad/${req.id}`, kind: "przeglad", to: env.AUDYT_REVIEW_EMAIL || replyTo(), subject: `Audyt @${req.handle} czeka na akceptację`,
      react: AudytReviewEmail({ handle: req.handle, url: `${origin()}/admin/audyty?id=${req.id}`, segment: req.segment, count: n }),
      text: `Audyt @${req.handle} czeka na akceptację (segment: ${req.segment}). Panel: ${origin()}/admin/audyty?id=${req.id}`,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[audyt] review mail:", msg)
    await db`update ws_audit_requests set note = ${`mail_przeglad: ${msg}`.slice(0, 200)} where id = ${req.id}`
  }
}

/** Cron: maile „czeka na akceptację”, które nie wyszły (np. błąd Resend). */
export async function notifyPendingReviews(limit = 5) {
  const rows = await sql()`
    select id, handle, segment from ws_audit_requests q
    where status = 'do_akceptacji' and not exists (select 1 from ws_mail_log m where m.idempotency_key = 'audyt-przeglad/' || q.id::text)
    order by analysed_at limit ${limit}`
  for (const r of rows) await notifyReview(r as unknown as Pick<Req, "id" | "handle" | "segment">)
  return rows.length
}

async function noData(req: Req): Promise<ProcessOutcome> {
  const db = sql()
  await db`update ws_audit_requests set status = 'brak_danych', analysed_at = now(), lease_until = null where id = ${req.id}`
  const formUrl = `${origin()}/?profil=${encodeURIComponent(req.handle)}&dane=1#audyt`
  await sendAudytMail({ key: `audyt-brak/${req.id}`, kind: "brak_danych", to: req.email, subject: `Audyt @${req.handle}: potrzebujemy 4 liczb`, react: AudytNoDataEmail({ handle: req.handle, formUrl }), text: audytNoDataText(req.handle, formUrl) })
  return "brak_danych"
}

/** Wysyłka maila 0 (po akceptacji Wiktorii albo w trybie automatycznym) i start sekwencji porad, jeśli jest zgoda. */
export async function sendReport(id: string, reviewer: string | null, edited?: Report) {
  const db = sql()
  const [r] = await db`
    select q.id, q.email, q.handle, q.segment, q.newsletter, q.status, q.budget, q.profile_type, p.report, p.report_edited
    from ws_audit_requests q join ws_audit_reports p on p.request_id = q.id where q.id = ${id}`
  if (!r || r.status !== "do_akceptacji") return false
  if (edited) await db`update ws_audit_reports set report_edited = ${db.json(edited as never)} where request_id = ${id}`
  const report = (edited ?? r.report_edited ?? r.report) as Report
  const [nl] = await db`select 1 from ws_newsletter where email = ${String(r.email).toLowerCase()} and confirmed_at is not null and unsubscribed_at is null`
  const cta = ctaFor({ id: r.id, segment: r.segment, newsletter: Boolean(nl), budget: r.budget, profileType: r.profile_type, noWeakness: report.obserwacje.length === 0 })
  const unsub = nl ? unsubUrl(r.email) : null
  await sendAudytMail({ key: `audyt-raport/${id}`, kind: "audyt", to: r.email, subject: `Twój audyt Instagrama: @${r.handle}`, react: AudytReportEmail({ handle: r.handle, report, cta, unsubscribeUrl: unsub }), text: audytReportText(r.handle, report, cta, unsub) })
  await db`update ws_audit_requests set status = 'wyslany', sent_at = now(), reviewed_at = ${reviewer ? db`now()` : null} where id = ${id}`
  if (nl) await db`update ws_newsletter set next_at = now() + interval '2 days', sequence_step = 0 where email = ${String(r.email).toLowerCase()} and sequence_step = 0`
  return true
}

export async function rejectAudit(id: string) {
  const [r] = await sql()`update ws_audit_requests set status = 'odrzucony', reviewed_at = now() where id = ${id} and status in ('do_akceptacji', 'potwierdzony', 'blad', 'brak_danych') returning id`
  return Boolean(r)
}

/** Retencja (polityka prywatności, sekcja „Audyt Instagrama”). */
export async function retention() {
  const db = sql()
  const a = await db`delete from ws_audit_requests where status = 'czeka' and created_at < now() - interval '7 days' returning id`
  const b = await db`update ws_audit_reports set data = null, data_purged_at = now() where data is not null and created_at < now() - interval '7 days' returning request_id`
  const c = await db`delete from ws_audit_reports where created_at < now() - interval '30 days' returning request_id`
  const d = await db`
    update ws_audit_requests set email = null, email_norm = null, handle = null, manual = null, ip_hash = null, utm = '{}'::jsonb, anonymized_at = now()
    where anonymized_at is null and created_at < now() - interval '30 days' and status <> 'czeka' returning id`
  await db`delete from ws_mail_log where created_at < now() - interval '7 days'`
  return { usuniete: a.length, dane: b.length, raporty: c.length, anonim: d.length }
}

/** Uwierzytelnienie pg_cron: nagłówek x-cron-key porównany ze skrótem w ws_cron_auth (sekret tylko w Supabase Vault). */
export async function cronAllowed(key: string | null) {
  if (!key || key.length < 32 || key.length > 200) return false
  const [r] = await sql()`select secret_hash from ws_cron_auth where name = 'audyt'`
  return Boolean(r) && safeEq(r.secret_hash, sha256(key))
}

export const statusLabel: Record<string, string> = {
  czeka: "czeka na potwierdzenie maila", potwierdzony: "w kolejce", analiza: "w analizie", do_akceptacji: "do akceptacji",
  wyslany: "wysłany", odrzucony: "odrzucony", brak_danych: "brak danych", blad: "błąd",
}
