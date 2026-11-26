// MontageFrames: czysta logika sklepu (bez Next.js i SDK), testowana przez `node --test`.
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { MF_PRODUCTS, MF_TERMS_VERSION, MF_TEXT, type MfProductId } from "./config.ts"

type Env = Record<string, string | undefined>

// ── Konfiguracja i wyłącznik ──

export function resendConfigured(apiKey: string | undefined) {
  return !!apiKey && !apiKey.startsWith("re_XXXX") && apiKey !== "re_placeholder_for_build"
}

/** null = sklep może działać; inaczej powód wyłączenia. Domyślnie wyłączony. */
export function mfDisabledReason(env: Env): string | null {
  if (env.MF_SHOP_ENABLED !== "true") return "MF_SHOP_ENABLED is not true"
  if (!env.APP_ORIGIN && !env.VERCEL_URL) return "APP_ORIGIN is missing"
  for (const key of ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "MF_PRICE_PACZKA", "DATABASE_URL"]) {
    if (!env[key]) return `${key} is missing`
  }
  if ((env.MF_SECRET ?? "").length < 32) return "MF_SECRET must have 32+ chars"
  if (!resendConfigured(env.RESEND_API_KEY)) {
    // Bez Resend tylko tryb testowy „outbox” (maile w bazie), nigdy na produkcji.
    if (env.MF_MAIL_MODE !== "outbox") return "RESEND_API_KEY is not configured"
    if (env.VERCEL_ENV === "production") return "MF_MAIL_MODE=outbox is not allowed in production"
  }
  if (env.NODE_ENV === "production" && env.VERCEL_ENV === "production" && env.MF_ALLOW_LIVE !== "true"
      && (env.STRIPE_SECRET_KEY ?? "").startsWith("sk_live_")) {
    return "live Stripe key blocked (set MF_ALLOW_LIVE=true after approval)"
  }
  return null
}

// ── Tryb testowy na produkcji (przegląd bezpieczeństwa 26.11, S2) ──
// Testowy klucz Stripe na produkcji: karta 4242 „płaci” za darmo, więc produkt dostają tylko testerzy.

/** Produkcja na testowym kluczu Stripe: sklep pokazuje „zakup wkrótce”, a dostawa tylko dla testerów. */
export function shopTestLocked(env: Env) {
  return env.VERCEL_ENV === "production" && (env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_")
}

/** Testerzy: skrzynka Wiktorii z aliasami +… oraz adresy z MF_TEST_ALLOWLIST (po przecinku). */
export function testerAllowed(email: string | null | undefined, env: Env) {
  if (!email) return false
  const [local, domain] = email.trim().toLowerCase().split("@")
  if (!local || !domain) return false
  const base = `${local.split("+")[0]}@${domain}`
  const list = ["wskopek.all@gmail.com", ...(env.MF_TEST_ALLOWLIST ?? "").split(",")].map((x) => x.trim().toLowerCase()).filter(Boolean)
  return list.includes(base) || list.includes(`${local}@${domain}`)
}

export function priceIdFor(product: MfProductId, env: Env): string | null {
  const id = env[MF_PRODUCTS[product].priceEnv]
  return id && id.startsWith("price_") ? id : null
}

// ── Walidacja formularza zamówienia ──

export const GITHUB_LOGIN_RE = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/

export type CheckoutInput = {
  product: MfProductId
  email: string | null
  githubLogin: string | null
  terms: true
  digital: true
  serviceStart: boolean
  marketing: boolean
  utm: Record<string, string>
}

export class InputError extends Error {}

// Źródło wejścia (audyt Ecom 2, pkt 4): first-touch z przeglądarki + fbclid. Do metadata Stripe i rekordu zamówienia.
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]
/** Klucze, które webhook przepisuje z metadata do zamówienia: UTM oraz próba (ustawia serwer, nie przeglądarka). */
export const ATTR_KEYS = [...UTM_KEYS, "mf_trial_id", "mf_trial_at"]

/** UTM z body żądania: tylko znane klucze, krótkie teksty. */
export function parseUtm(raw: unknown): Record<string, string> {
  const utm: Record<string, string> = {}
  if (!raw || typeof raw !== "object") return utm
  for (const k of UTM_KEYS) {
    const v = (raw as Record<string, unknown>)[k]
    if (typeof v === "string" && v.trim()) utm[k] = v.trim().slice(0, 200)
  }
  return utm
}

export function parseCheckoutInput(body: unknown): CheckoutInput {
  if (!body || typeof body !== "object") throw new InputError("Nieprawidłowe dane")
  const b = body as Record<string, unknown>
  const product = b.product
  if (product !== "paczka" && product !== "konsultacja") throw new InputError("Wybierz wariant")
  // Zgody muszą być wprost `true` (pole niezaznaczone domyślnie po stronie formularza).
  if (b.terms !== true) throw new InputError("Zaakceptuj regulamin, żeby przejść do płatności")
  if (b.digital !== true) {
    throw new InputError("Bez zgody na natychmiastowe dostarczenie treści cyfrowej nie możemy wydać programu")
  }
  let email: string | null = null
  if (typeof b.email === "string" && b.email.trim()) {
    email = b.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) throw new InputError("Podaj prawidłowy adres e-mail")
  }
  let githubLogin: string | null = null
  if (typeof b.githubLogin === "string" && b.githubLogin.trim()) {
    githubLogin = b.githubLogin.trim().replace(/^@/, "")
    if (!GITHUB_LOGIN_RE.test(githubLogin)) throw new InputError("Nieprawidłowy login GitHub")
  }
  const utm = parseUtm(b.utm)
  return {
    product,
    email,
    githubLogin,
    terms: true,
    digital: true,
    serviceStart: b.serviceStart === true && product === "konsultacja",
    marketing: b.marketing === true,
    utm,
  }
}

export function consentRecord(input: CheckoutInput) {
  return {
    product: input.product,
    email: input.email,
    terms_version: MF_TERMS_VERSION,
    terms_accepted: input.terms,
    digital_consent: input.digital,
    digital_consent_text: MF_TEXT.digital,
    service_start_consent: input.serviceStart,
    marketing_consent: input.marketing,
    github_login: input.githubLogin,
    lang: "pl",
  }
}

/** Parametry Stripe Checkout. Metody płatności: z konfiguracji konta (BLIK, karta, portfele itd.). */
export function checkoutParams(input: CheckoutInput, opts: { priceId: string; consentId: string; origin: string; basePath: string }) {
  const metadata: Record<string, string> = {
    mf_product: input.product,
    consent_id: opts.consentId,
    terms_version: MF_TERMS_VERSION,
    digital_consent: "true",
    service_start_consent: String(input.serviceStart),
    ...input.utm,
  }
  if (input.githubLogin) metadata.github_login = input.githubLogin
  return {
    mode: "payment" as const,
    currency: "pln",
    locale: "pl" as const,
    line_items: [{ price: opts.priceId, quantity: 1 }],
    customer_email: input.email ?? undefined,
    customer_creation: "always" as const,
    billing_address_collection: "auto" as const,
    // Bez pola NIP: sprzedawca to działalność nierejestrowana, bez faktur firmowych (00-PLAN 0a/0c).
    submit_type: "pay" as const,
    client_reference_id: opts.consentId,
    metadata,
    payment_intent_data: { metadata: { mf_product: input.product, consent_id: opts.consentId } },
    custom_text: {
      submit: {
        message:
          "Zgodę na natychmiastowe dostarczenie treści cyfrowej i regulamin zaakceptowałeś/-aś na wiktoriaskopek.pl. Potwierdzenie przyjdzie mailem.",
      },
    },
    success_url: `${opts.origin}${opts.basePath}/dziekujemy?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}${opts.basePath}#zamowienie`,
  }
}

// ── Klucze, tokeny, podpisy ──

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex")
const hmac = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest()

const KEY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // bez 0/O/1/I

/** Klucz MF1-XXXXX-XXXXX-XXXXX-XXXXX wyliczany z ID sesji: ponowienie daje ten sam klucz (bez przechowywania). */
export function licenseKeyFor(sessionId: string, secret: string) {
  const bytes = hmac(secret, `license:${sessionId}`)
  let chars = ""
  for (let i = 0; i < 20; i++) chars += KEY_ALPHABET[bytes[i] % KEY_ALPHABET.length]
  return `MF1-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}`
}

/** Token logowania z maila zakupowego: deterministyczny, żeby ponowiony mail był identyczny (idempotencja Resend). */
export function purchaseLoginToken(sessionId: string, secret: string) {
  return hmac(secret, `purchase-login:${sessionId}`).toString("base64url")
}

export const randomToken = () => randomBytes(32).toString("base64url")

const b64 = (s: string) => Buffer.from(s).toString("base64url")
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url")

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** Wersja podpisu sesji. Zmiana unieważnia wszystkie wydane sesje (v2: po usunięciu logowania po płatności, S1 26.11). */
export const SESSION_SIG = "session-v2"

/** Ciasteczko sesji konta: e-mail + termin, podpis HMAC. */
export function createSessionCookie(email: string, ttlSeconds: number, secret: string, nowMs = Date.now()) {
  const payload = b64(JSON.stringify({ e: email.toLowerCase(), x: nowMs + ttlSeconds * 1000 }))
  return `${payload}.${sign(`${SESSION_SIG}:${payload}`, secret)}`
}

export function verifySessionCookie(value: string | undefined, secret: string, nowMs = Date.now()): string | null {
  if (!value) return null
  const [payload, sig] = value.split(".")
  if (!payload || !sig || !safeEqual(sign(`${SESSION_SIG}:${payload}`, secret), sig)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { e: string; x: number }
    return typeof data.e === "string" && data.x > nowMs ? data.e : null
  } catch {
    return null
  }
}

// ── Realizacja zamówienia z webhooka ──

export type ClaimOutcome = "claimed" | "busy" | "delivered" | "revoked"

export type PaidSession = {
  id: string
  livemode?: boolean
  payment_status?: string | null
  payment_intent?: string | { id: string } | null
  amount_total?: number | null
  currency?: string | null
  metadata?: Record<string, string> | null
  customer_details?: {
    email?: string | null
    name?: string | null
    tax_ids?: { type: string; value: string }[] | null
  } | null
}

export interface MfStore {
  /** true = zdarzenie nowe albo nieprzetworzone; false = już przetworzone. */
  beginEvent(eventId: string, type: string): Promise<boolean>
  finishEvent(eventId: string, result: string): Promise<void>
  claim(sessionId: string, product: MfProductId, email: string): Promise<ClaimOutcome>
  saveOrderDetails(sessionId: string, d: {
    paymentIntent: string | null; amountTotal: number | null; currency: string | null; name: string | null
    taxId: string | null; consentId: string | null; githubLogin: string | null; licenseHash: string; licenseHint: string
    utm: Record<string, string>
  }): Promise<void>
  /** Zgoda zakupowa z bazy: musi istnieć i mieć digital_consent = true. */
  consentOk(consentId: string, sessionId: string): Promise<boolean>
  storeLoginToken(tokenHash: string, email: string, ttlSeconds: number, purpose: string): Promise<void>
  setGithubStatus(sessionId: string, status: "invited" | "failed" | "removed", error?: string | null): Promise<void>
  markDelivered(sessionId: string): Promise<void>
  markFailed(sessionId: string, error: string): Promise<void>
  revokeByPaymentIntent(paymentIntent: string, status: "refunded" | "disputed"): Promise<{ sessionId: string; githubLogin: string | null } | null>
}

export type AccessMail = {
  sessionId: string
  product: MfProductId
  email: string
  licenseKey: string
  loginUrl: string
  githubLogin: string | null
  githubInvited: boolean
  /** false = brak tokenu GitHub: dostęp do paczki wysyłany ręcznie (do 24 h). */
  githubConfigured: boolean
  serviceStart: boolean
}

export interface MfDeps {
  store: MfStore
  secret: string
  origin: string
  basePath: string
  env: Env
  sendAccessMail(mail: AccessMail): Promise<void>
  /** Powiadomienie sprzedawcy o zamówieniu (np. do ręcznego wysłania dostępu). Idempotentne po ID sesji. */
  notifySeller?(mail: AccessMail): Promise<void>
  /** null = GitHub nieskonfigurowany. Rzuca przy błędzie. */
  github: null | { invite(login: string): Promise<void>; remove(login: string): Promise<void> }
  log?: (msg: string) => void
}

type StripeEvent = { id: string; type: string; data: { object: any } }

const FULFILL = ["checkout.session.completed", "checkout.session.async_payment_succeeded"]

/** Obsługa webhooka. Rzuca → 500 → Stripe ponawia. Wynik → 200. */
export async function handleStripeEvent(event: StripeEvent, deps: MfDeps): Promise<string> {
  const relevant = [...FULFILL, "charge.refunded", "charge.dispute.created"]
  if (!relevant.includes(event.type)) return "ignored"
  const fresh = await deps.store.beginEvent(event.id, event.type)
  if (!fresh) return "duplicate-event"

  let result: string
  if (FULFILL.includes(event.type)) result = await fulfill(event.data.object as PaidSession, deps)
  else if (event.type === "charge.refunded") result = await revoke(event.data.object, "refunded", deps)
  else result = await revoke(event.data.object, "disputed", deps)

  // "busy" nie zamyka zdarzenia: Stripe ponowi, a druga próba skończy realizację.
  if (result !== "busy") await deps.store.finishEvent(event.id, result)
  return result
}

async function fulfill(session: PaidSession, deps: MfDeps): Promise<string> {
  if (session.payment_status !== "paid") return "unpaid"
  const meta = session.metadata ?? {}
  const product = meta.mf_product
  if (product !== "paczka" && product !== "konsultacja") throw new Error(`Unknown product for session ${session.id}`)
  const email = session.customer_details?.email?.toLowerCase()
  if (!email) throw new Error(`Missing customer email for session ${session.id}`)
  const consentId = meta.consent_id ?? null
  // Testowa płatność na produkcji: bez klucza, poradnika, paczki i maila dla adresów spoza listy testerów (S2).
  if (session.livemode === false && deps.env.VERCEL_ENV === "production" && !testerAllowed(email, deps.env)) {
    deps.log?.(`[mf] test-mode purchase blocked for ${session.id}`)
    return "test-blocked"
  }

  const outcome = await deps.store.claim(session.id, product, email)
  if (outcome === "delivered") return "duplicate"
  if (outcome === "revoked") return "revoked"
  if (outcome === "busy") return "busy"

  try {
    // Dostęp tylko po zapisanej zgodzie na natychmiastowe dostarczenie (06, pkt 18).
    const consentOk = consentId ? await deps.store.consentOk(consentId, session.id) : false
    if (!consentOk) throw new Error(`Missing purchase consent for session ${session.id}`)

    const licenseKey = licenseKeyFor(session.id, deps.secret)
    const githubLogin = meta.github_login && GITHUB_LOGIN_RE.test(meta.github_login) ? meta.github_login : null
    const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null
    const taxId = session.customer_details?.tax_ids?.[0]?.value ?? null
    const utm: Record<string, string> = {}
    for (const k of ATTR_KEYS) if (meta[k]) utm[k] = meta[k]
    await deps.store.saveOrderDetails(session.id, {
      paymentIntent: pi, amountTotal: session.amount_total ?? null, currency: session.currency ?? null,
      name: session.customer_details?.name ?? null, taxId, consentId, githubLogin,
      licenseHash: sha256(licenseKey), licenseHint: licenseKey.slice(-5), utm,
    })

    const loginToken = purchaseLoginToken(session.id, deps.secret)
    await deps.store.storeLoginToken(sha256(loginToken), email, 72 * 60 * 60, "purchase")

    let githubInvited = false
    if (githubLogin && deps.github) {
      try {
        await deps.github.invite(githubLogin)
        await deps.store.setGithubStatus(session.id, "invited")
        githubInvited = true
      } catch (e) {
        // Zły login nie blokuje dostawy: kupujący poprawi go na koncie.
        await deps.store.setGithubStatus(session.id, "failed", e instanceof Error ? e.message : String(e))
      }
    }

    const mail: AccessMail = {
      sessionId: session.id, product, email, licenseKey, githubLogin, githubInvited, githubConfigured: deps.github !== null,
      loginUrl: `${deps.origin}/api/mf/auth?token=${loginToken}`,
      serviceStart: meta.service_start_consent === "true",
    }
    await deps.sendAccessMail(mail)
    if (deps.notifySeller) await deps.notifySeller(mail)
  } catch (error) {
    await deps.store.markFailed(session.id, error instanceof Error ? error.message : String(error))
    throw error
  }
  await deps.store.markDelivered(session.id)
  return "delivered"
}

async function revoke(obj: any, status: "refunded" | "disputed", deps: MfDeps): Promise<string> {
  // charge.refunded: unieważniamy tylko przy pełnym zwrocie. charge.dispute.created: zawsze.
  if (status === "refunded" && obj.refunded !== true) return "partial-refund"
  const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : obj.payment_intent?.id
  if (!pi) return "no-payment-intent"
  const order = await deps.store.revokeByPaymentIntent(pi, status)
  if (!order) return "order-not-found"
  if (order.githubLogin && deps.github) {
    await deps.github.remove(order.githubLogin) // rzuca → Stripe ponowi
    await deps.store.setGithubStatus(order.sessionId, "removed")
  }
  return status
}
