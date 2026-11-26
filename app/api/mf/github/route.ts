import { NextResponse, type NextRequest } from "next/server"
import { GITHUB_LOGIN_RE } from "@/lib/mf/core"
import { sql } from "@/lib/mf/db"
import { currentBuyer, githubForShop, mfEnv, rateLimited } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// POST /api/mf/github {login}: zalogowany kupujący ustawia/zmienia login GitHub → zaproszenie do repo paczki.
export async function POST(request: NextRequest) {
  const { disabled } = mfEnv()
  if (disabled) return NextResponse.json({ error: "Niedostępne" }, { status: 503 })
  const email = await currentBuyer()
  if (!email) return NextResponse.json({ error: "Zaloguj się" }, { status: 401 })
  if (rateLimited(`github:${email}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Zbyt wiele zmian. Spróbuj za godzinę." }, { status: 429 })
  }
  const body = await request.json().catch(() => ({}))
  const login = typeof body.login === "string" ? body.login.trim().replace(/^@/, "") : ""
  if (!GITHUB_LOGIN_RE.test(login)) return NextResponse.json({ error: "Nieprawidłowy login GitHub" }, { status: 400 })

  const gh = githubForShop()
  if (!gh) return NextResponse.json({ error: "Zaproszenia GitHub są chwilowo wyłączone. Napisz na wskopek.all@gmail.com, wyślemy dostęp ręcznie." }, { status: 503 })

  const db = sql()
  const [order] = await db`
    select session_id, github_login, github_status from mf_orders
    where lower(email) = ${email} and status = 'delivered' order by created_at desc limit 1`
  if (!order) return NextResponse.json({ error: "Brak aktywnego zakupu" }, { status: 403 })

  try {
    if (order.github_login && order.github_login.toLowerCase() !== login.toLowerCase() && order.github_status === "invited") {
      await gh.remove(order.github_login) // jedno konto GitHub na zakup
    }
    await gh.invite(login)
    await db`update mf_orders set github_login = ${login}, github_status = 'invited', github_error = null where session_id = ${order.session_id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await db`update mf_orders set github_login = ${login}, github_status = 'failed', github_error = ${msg} where session_id = ${order.session_id}`
    return NextResponse.json({ error: msg.startsWith("GitHub: nie ma") ? msg : "Nie udało się wysłać zaproszenia." }, { status: 502 })
  }
}
