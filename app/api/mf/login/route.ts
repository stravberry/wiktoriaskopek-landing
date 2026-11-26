import { NextResponse, type NextRequest } from "next/server"
import { MF_TTL } from "@/lib/mf/config"
import { randomToken, sha256 } from "@/lib/mf/core"
import { hasActiveOrder, recentLoginTokens, sql } from "@/lib/mf/db"
import { clientIp, mfEnv, origin, rateLimited, sendLoginMail } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/mf/login {email}: magic link (jednorazowy, 30 min). Zawsze ta sama odpowiedź (bez ujawniania, kto kupił).
export async function POST(request: NextRequest) {
  const { disabled } = mfEnv()
  if (disabled) return NextResponse.json({ error: "Konto jest chwilowo niedostępne." }, { status: 503 })
  if (rateLimited(`login:${clientIp(request.headers)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj za kilka minut." }, { status: 429 })
  }
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Podaj prawidłowy adres e-mail" }, { status: 400 })
  }

  const db = sql()
  await db`delete from mf_login_tokens where expires_at < now() - interval '1 day'` // czyszczenie wygasłych tokenów
  if ((await hasActiveOrder(db, email)) && (await recentLoginTokens(db, email)) < 5) {
    const token = randomToken()
    await db`
      insert into mf_login_tokens (token_hash, email, purpose, expires_at)
      values (${sha256(token)}, ${email}, 'login', now() + make_interval(secs => ${MF_TTL.loginToken}))`
    try {
      await sendLoginMail(email, `${origin()}/api/mf/auth?token=${token}`)
    } catch (e) {
      console.error("[mf] login mail failed:", e instanceof Error ? e.message : e)
      return NextResponse.json({ error: "Nie udało się wysłać maila. Spróbuj ponownie." }, { status: 502 })
    }
  }
  return NextResponse.json({ ok: true, message: "Jeśli ten adres ma zakup, wysłaliśmy na niego link do logowania." })
}
