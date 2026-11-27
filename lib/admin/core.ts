// Panel admina: czysta logika (bez Next.js), testowana przez `node --test`.
import { createHmac, timingSafeEqual } from "node:crypto"

type Env = Record<string, string | undefined>

/** Sesja admina: 8 godzin, potem ponowne logowanie linkiem. */
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60
/** Link z maila: 15 minut, działa raz. */
export const ADMIN_TOKEN_SECONDS = 15 * 60
/** Na produkcji przedrostek __Host- (tylko HTTPS, bez domeny, ścieżka /). */
export const adminCookieName = (env: Env = process.env) => (env.NODE_ENV === "production" ? "__Host-adm_session" : "adm_session")
// Osobna domena podpisu: ciasteczko kupującego (mf_session) nie przejdzie jako admin i odwrotnie.
const SIG = "adm-session-v1"

/** Allowlista z ADMIN_EMAILS (po przecinku); bez zmiennej tylko adres Wiktorii. */
export function adminEmails(env: Env = process.env) {
  const raw = env.ADMIN_EMAILS?.trim() || "wskopek.all@gmail.com"
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
}
export const isAdminEmail = (email: string, env: Env = process.env) => adminEmails(env).includes(email.trim().toLowerCase())

const b64 = (s: string) => Buffer.from(s).toString("base64url")
const sign = (data: string, secret: string) => createHmac("sha256", secret).update(`${SIG}:${data}`).digest("base64url")
const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** Ciasteczko sesji: e-mail, czas wydania i wygaśnięcia oraz wersja sesji z bazy (wylogowanie ją podbija). */
export function createAdminCookie(email: string, secret: string, nowMs = Date.now(), ttl = ADMIN_SESSION_SECONDS, version = 1) {
  const payload = b64(JSON.stringify({ e: email.toLowerCase(), i: nowMs, x: nowMs + ttl * 1000, v: version }))
  return `${payload}.${sign(payload, secret)}`
}

/** Sesja z ważnego ciasteczka (adres nadal na allowliście); inaczej null. Wersję porównuje serwer z bazą. */
export function verifyAdminSession(value: string | undefined, secret: string, env: Env = process.env, nowMs = Date.now()) {
  if (!value || value.length > 600) return null
  const [payload, sig] = value.split(".")
  if (!payload || !sig || !safeEqual(sign(payload, secret), sig)) return null
  try {
    const d = JSON.parse(Buffer.from(payload, "base64url").toString()) as { e?: unknown; i?: unknown; x?: unknown; v?: unknown }
    if (typeof d.e !== "string" || typeof d.x !== "number" || typeof d.i !== "number") return null
    if (d.x <= nowMs || d.i > nowMs + 60_000 || d.x - d.i > ADMIN_SESSION_SECONDS * 1000) return null
    return isAdminEmail(d.e, env) ? { email: d.e, version: typeof d.v === "number" ? d.v : 1 } : null
  } catch {
    return null
  }
}
export const verifyAdminCookie = (value: string | undefined, secret: string, env: Env = process.env, nowMs = Date.now()) =>
  verifyAdminSession(value, secret, env, nowMs)?.email ?? null

/** CSRF dla POST: nagłówek Origin musi wskazywać ten sam serwis (przeglądarki wysyłają go przy fetch/formularzach). */
export function sameOrigin(originHeader: string | null, allowed: string[]) {
  if (!originHeader) return false
  try {
    const o = new URL(originHeader).origin
    return allowed.some((a) => { try { return new URL(a).origin === o } catch { return false } })
  } catch {
    return false
  }
}

export const validEmail = (e: string) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
