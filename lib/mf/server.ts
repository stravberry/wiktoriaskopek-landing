import { createHash } from "node:crypto"
import Stripe from "stripe"
import { cookies } from "next/headers"
import { Resend } from "resend"
import { render } from "@react-email/components"
import { MF_BASE_PATH, MF_PRODUCTS, MF_TTL } from "./config.ts"
import { mfDisabledReason, resendConfigured, verifySessionCookie, createSessionCookie, type AccessMail, type MfDeps } from "./core.ts"
import { pgStore, sql } from "./db.ts"
import { githubAccess, githubConfig } from "./github.ts"
import MfAccessEmail, { accessEmailText } from "@/emails/mf-access-email"
import MfTrialReadyEmail from "@/emails/mf-trial-ready-email"
import MfLoginEmail from "@/emails/mf-login-email"
import { termsPlainText } from "./legal.ts"

export const SESSION_COOKIE = "mf_session"

export function mfEnv() {
  const env = process.env
  const disabled = mfDisabledReason(env)
  return { disabled, env }
}

let stripeClient: Stripe | null = null
export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is missing")
  if (!stripeClient) stripeClient = new Stripe(key)
  return stripeClient
}

export const secret = () => {
  const s = process.env.MF_SECRET
  if (!s || s.length < 32) throw new Error("MF_SECRET must have 32+ chars")
  return s
}

export const origin = () =>
  (process.env.APP_ORIGIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")).replace(/\/$/, "")

/** Nadawca maili sklepu: osobny od formularza kontaktowego. */
export const mailFrom = () => process.env.MF_EMAIL_FROM || process.env.EMAIL_FROM || "kontakt@wiktoriaskopek.pl"
export const replyTo = () => process.env.MF_REPLY_TO || "wskopek.all@gmail.com"

let resendClient: Resend | null = null
const resend = () => (resendClient ??= new Resend(process.env.RESEND_API_KEY))

/** Tryb testowy bez klucza Resend: zapis do mf_mail_outbox (idempotentny po kluczu). */
const outboxMode = () => !resendConfigured(process.env.RESEND_API_KEY) && process.env.MF_MAIL_MODE === "outbox"
async function toOutbox(key: string, to: string, subject: string, text: string, html: string | null = null) {
  await sql()`insert into mf_mail_outbox (idempotency_key, to_email, subject, body_text, body_html)
              values (${key}, ${to}, ${subject}, ${text}, ${html}) on conflict (idempotency_key) do nothing`
}

/** Podgląd maili w przeglądarce: tylko tryb outbox na lokalnym adresie, nigdy na Vercelu. */
export const outboxPreviewAllowed = () =>
  outboxMode() && !process.env.VERCEL && /^http:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(origin())

/** Resend: bez śledzenia otwarć i kliknięć (ustawienie domeny w Resend; tu nie dodajemy pikseli ani przekierowań). */
export async function sendAccessMail(mail: AccessMail, idempotencyKey = `mf-access/${mail.sessionId}`) {
  const product = MF_PRODUCTS[mail.product]
  const props = { ...mail, productName: product.name, accountUrl: `${origin()}${MF_BASE_PATH}/konto`, origin: origin() }
  if (outboxMode()) {
    return toOutbox(idempotencyKey, mail.email, "MontageFrames: Twój dostęp i klucz licencyjny", accessEmailText(props), await render(MfAccessEmail(props)))
  }
  const { error } = await resend().emails.send(
    {
      from: mailFrom(),
      to: mail.email,
      replyTo: replyTo(),
      subject: "MontageFrames: Twój dostęp i klucz licencyjny",
      react: MfAccessEmail(props),
      text: accessEmailText(props),
      attachments: [{ filename: "regulamin-montageframes.txt", content: Buffer.from(termsPlainText(), "utf-8").toString("base64") }],
    },
    { idempotencyKey },
  )
  if (error) throw new Error(`Resend: ${error.name}`)
}

/** Kopia dla Wiktorii: nowe zamówienie (bez klucza), żeby wysłać dostęp ręcznie, gdy nie ma tokenu GitHub. */
export async function notifySeller(mail: AccessMail) {
  const to = replyTo()
  const text = [
    `Nowe zamówienie MontageFrames (${MF_PRODUCTS[mail.product].name}).`,
    `Kupujący: ${mail.email}`,
    `Login GitHub: ${mail.githubLogin ?? "brak"}`,
    mail.githubInvited ? "Zaproszenie do repozytorium zostało wysłane automatycznie." : "Dostęp do paczki trzeba wysłać ręcznie w ciągu 24 h (zaproszenie do DKWGroup/MontageFrames-dist albo ZIP).",
    mail.product === "konsultacja" ? `Konsultacja: ustal termin. Zgoda na wcześniejsze wykonanie: ${mail.serviceStart ? "tak" : "nie (po 14 dniach)"}.` : "",
    `ID sesji Stripe: ${mail.sessionId}`,
  ].filter(Boolean).join("\n")
  const key = `mf-seller/${mail.sessionId}`
  if (outboxMode()) return toOutbox(key, to, `Nowe zamówienie MontageFrames: ${mail.email}`, text)
  const { error } = await resend().emails.send({ from: mailFrom(), to, replyTo: mail.email, subject: `Nowe zamówienie MontageFrames: ${mail.email}`, text }, { idempotencyKey: key })
  if (error) throw new Error(`Resend: ${error.name}`)
}

/** Kupujący podał login GitHub na koncie, a zaproszenia automatyczne są wyłączone (brak tokenu): mail do Wiktorii. */
export async function notifySellerGithub(email: string, login: string, sessionId: string) {
  const to = replyTo()
  const text = `Kupujący ${email} podał login GitHub: ${login}\nZaproś go ręcznie do DKWGroup/MontageFrames-dist (uprawnienie: Read).\nID sesji Stripe: ${sessionId}`
  const key = `mf-seller-gh/${sessionId}/${login.toLowerCase()}`
  if (outboxMode()) return toOutbox(key, to, `MontageFrames: login GitHub od ${email}`, text)
  const { error } = await resend().emails.send({ from: mailFrom(), to, replyTo: email, subject: `MontageFrames: login GitHub od ${email}`, text }, { idempotencyKey: key })
  if (error) throw new Error(`Resend: ${error.name}`)
}

/** Mail „rolka z próby gotowa” (albo nieudana) z jednorazowym linkiem do strony próby. */
export async function sendTrialReadyMail(email: string, url: string, ok: boolean, until: string | null) {
  const subject = ok ? "MontageFrames: Twoja rolka z próby jest gotowa" : "MontageFrames: montaż próbnej rolki się nie udał"
  const text = `${ok ? "Twoja rolka z próby jest gotowa" : "Nie udało się zmontować rolki"}. ${ok && until ? `Pobierz ją do ${until}. ` : ""}Link (działa raz): ${url}`
  if (outboxMode()) return toOutbox(`mf-trial-ready/${Date.now()}`, email, subject, text, await render(MfTrialReadyEmail({ url, ok, until })))
  const { error } = await resend().emails.send({ from: mailFrom(), to: email, replyTo: replyTo(), subject, react: MfTrialReadyEmail({ url, ok, until }), text })
  if (error) throw new Error(`Resend: ${error.name}`)
}

export async function sendLoginMail(email: string, url: string, trial = false) {
  const subject = trial ? "MontageFrames: link do darmowej próby" : "MontageFrames: link do logowania"
  if (outboxMode()) {
    const html = await render(MfLoginEmail({ url, minutes: MF_TTL.loginToken / 60, trial }))
    return toOutbox(`mf-login/${Date.now()}/${Math.random()}`, email, subject, `Link (30 min, działa raz): ${url}`, html)
  }
  const { error } = await resend().emails.send({
    from: mailFrom(),
    to: email,
    replyTo: replyTo(),
    subject,
    react: MfLoginEmail({ url, minutes: MF_TTL.loginToken / 60, trial }),
    text: `${trial ? "Twój link do darmowej próby MontageFrames" : "Twój link do konta MontageFrames"} (ważny ${MF_TTL.loginToken / 60} minut, działa raz):\n${url}\n\nJeśli to nie Ty, zignoruj tę wiadomość.`,
  })
  if (error) throw new Error(`Resend: ${error.name}`)
}

export function githubForShop() {
  const cfg = githubConfig()
  return cfg ? githubAccess(cfg) : null
}

export function mfDeps(): MfDeps {
  return {
    store: pgStore(sql()),
    secret: secret(),
    origin: origin(),
    basePath: MF_BASE_PATH,
    env: process.env,
    sendAccessMail: (m) => sendAccessMail(m),
    notifySeller: (m) => notifySeller(m),
    github: githubForShop(),
    log: (m) => console.log(`[mf] ${m}`),
  }
}

/** E-mail zalogowanego kupującego albo null. */
export async function currentBuyer() {
  const s = process.env.MF_SECRET
  if (!s) return null
  const jar = await cookies()
  return verifySessionCookie(jar.get(SESSION_COOKIE)?.value, s)
}

export function sessionCookieValue(email: string) {
  return createSessionCookie(email, MF_TTL.session, secret())
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MF_TTL.session,
}

/** Prosty limit zapytań w pamięci instancji (jak w /api/contact). */
const hits = new Map<string, { n: number; reset: number }>()
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const e = hits.get(key)
  if (!e || now > e.reset) {
    hits.set(key, { n: 1, reset: now + windowMs })
    return false
  }
  e.n++
  return e.n > max
}

/** Skrót IP do limitów w bazie (bez zapisu samego adresu). */
export function ipHash(headers: Headers) {
  return createHash("sha256").update(`${secret()}:ip:${clientIp(headers)}`).digest("hex").slice(0, 32)
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
}
