// Panel admina: sesja, audit i mail z linkiem (tylko serwer).
import { createHash, randomBytes } from "node:crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { Resend } from "resend"
import { sql } from "@/lib/mf/db"
import { clientIp, mailFrom, origin } from "@/lib/mf/server"
import { ADMIN_SESSION_SECONDS, ADMIN_TOKEN_SECONDS, adminCookieName, createAdminCookie, sameOrigin, verifyAdminSession } from "./core.ts"

export const adminSecret = () => {
  const s = process.env.ADMIN_SECRET || process.env.MF_SECRET
  if (!s || s.length < 32) throw new Error("ADMIN_SECRET (albo MF_SECRET) musi mieć 32+ znaki")
  return s
}

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex")
export const newToken = () => randomBytes(32).toString("base64url")
export const ipHashOf = (h: Headers) => createHash("sha256").update(`${adminSecret()}:adm-ip:${clientIp(h)}`).digest("hex").slice(0, 32)

/** Adresy, z których przyjmujemy POST (CSRF): APP_ORIGIN, adres wdrożenia Vercel i wersja z www/bez www. */
export function allowedOrigins() {
  const o = origin()
  const list = [o]
  try {
    const u = new URL(o)
    list.push(`${u.protocol}//${u.host.startsWith("www.") ? u.host.slice(4) : `www.${u.host}`}`)
  } catch {}
  if (process.env.VERCEL_URL) list.push(`https://${process.env.VERCEL_URL}`)
  if (process.env.VERCEL_BRANCH_URL) list.push(`https://${process.env.VERCEL_BRANCH_URL}`)
  return list
}
export const csrfOk = (h: Headers) => sameOrigin(h.get("origin"), allowedOrigins())

/** Dziennik tylko do dopisywania. Wpisy odmowne mają globalny limit (200 na godzinę), żeby anonim nie zapełnił bazy. */
export async function audit(action: string, actor: string | null, ok: boolean, detail: Record<string, unknown> = {}, h?: Headers) {
  try {
    const db = sql()
    if (!ok) {
      const [{ n }] = await db`select count(*)::int as n from adm_audit where not ok and ts > now() - interval '1 hour'`
      if (n >= 200) return
    }
    await db`insert into adm_audit (actor, action, ok, ip_hash, detail) values (${actor}, ${action}, ${ok}, ${h ? ipHashOf(h) : null}, ${db.json(detail as never)})`
  } catch (e) {
    console.error("[admin] audit:", e instanceof Error ? e.message : e)
  }
}

/** Wersja sesji admina z bazy (rola admin) albo null: druga bramka obok allowlisty. */
export async function adminVersion(email: string) {
  const [row] = await sql()`select session_version from adm_users where email = ${email.toLowerCase()} and role = 'admin'`
  return row ? (row.session_version as number) : null
}
export const hasAdminRole = async (email: string) => (await adminVersion(email)) !== null

/** E-mail zalogowanego admina albo null (podpis, ważność, allowlista, rola i wersja sesji przy każdym żądaniu). */
export async function currentAdmin() {
  const jar = await cookies()
  const s = verifyAdminSession(jar.get(adminCookieName())?.value, adminSecret())
  if (!s) return null
  return (await adminVersion(s.email)) === s.version ? s.email : null
}

/** Strony panelu: bez sesji admina → logowanie. Do dziennika trafia tylko nieważne ciasteczko, nie każde wejście. */
export async function requireAdmin() {
  const email = await currentAdmin()
  if (!email) {
    if ((await cookies()).get(adminCookieName())) await audit("page_denied", null, false, {}, await headers())
    redirect("/admin/login")
  }
  return email
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: ADMIN_SESSION_SECONDS,
}
export const adminCookieValue = (email: string, version: number) => createAdminCookie(email, adminSecret(), Date.now(), ADMIN_SESSION_SECONDS, version)

let resendClient: Resend | null = null
export async function sendAdminLoginMail(email: string, url: string) {
  resendClient ??= new Resend(process.env.RESEND_API_KEY)
  const minutes = ADMIN_TOKEN_SECONDS / 60
  const { error } = await resendClient.emails.send({
    from: mailFrom(),
    to: email,
    subject: "Panel wiktoriaskopek.pl: link do logowania",
    text: `Link do panelu admina (ważny ${minutes} minut, działa raz):\n${url}\n\nJeśli to nie Ty prosiłaś o logowanie, zignoruj tę wiadomość. Nikt nie wejdzie bez tego linku.`,
    html: `<p>Link do panelu admina (ważny ${minutes} minut, działa raz):</p><p><a href="${url}">Zaloguj się do panelu</a></p><p style="color:#5c5c62">Jeśli to nie Ty prosiłaś o logowanie, zignoruj tę wiadomość. Nikt nie wejdzie bez tego linku.</p>`,
  })
  if (error) throw new Error(`Resend: ${error.name}`)
}
