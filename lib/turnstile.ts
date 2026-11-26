// Cloudflare Turnstile (anty-bot) dla formularzy: próba, kontakt, odstąpienie. Decyzja z Coding Builderem 26.11:
// tryb managed, sprawdzenie tokenu na serwerze; gdy Cloudflare nie odpowiada, odmawiamy (fail closed).
// Włącza się dopiero, gdy w Vercel są oba klucze: NEXT_PUBLIC_TURNSTILE_SITE_KEY i TURNSTILE_SECRET_KEY.
type Env = Record<string, string | undefined>
export type TurnstileResult = { ok: true } | { ok: false; status: number; error: string }

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export const turnstileEnabled = (env: Env) => Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export async function verifyTurnstile(token: unknown, ip: string | null, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<TurnstileResult> {
  if (!turnstileEnabled(env)) return { ok: true }
  if (typeof token !== "string" || !token || token.length > 2048) {
    return { ok: false, status: 400, error: "Potwierdź, że nie jesteś botem (okienko nad przyciskiem), i wyślij jeszcze raz." }
  }
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY as string, response: token })
  if (ip) body.set("remoteip", ip)
  try {
    const res = await fetchImpl(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`siteverify ${res.status}`)
    const data = (await res.json()) as { success?: boolean }
    if (data.success === true) return { ok: true }
    return { ok: false, status: 400, error: "Weryfikacja przed botami nie przeszła. Odśwież stronę i spróbuj jeszcze raz." }
  } catch (e) {
    console.error("[turnstile] verify failed:", e instanceof Error ? e.message : e)
    return { ok: false, status: 503, error: "Nie udało się sprawdzić zabezpieczenia przed botami. Odśwież stronę i spróbuj za chwilę." }
  }
}

/** IP klienta z nagłówków Vercel (tylko do siteverify, nigdzie nie zapisujemy). */
export const clientIp = (h: Headers) => h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null
