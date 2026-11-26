import { NextResponse, type NextRequest } from "next/server"
import { GITHUB_LOGIN_RE } from "@/lib/mf/core"
import { sql } from "@/lib/mf/db"
import { currentBuyer, githubForShop, mfEnv, notifySellerGithub, rateLimited } from "@/lib/mf/server"

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

  const db = sql()
  // S7 (przegląd 26.11): blokada wiersza zamówienia, żeby równoległe zmiany nie zaprosiły kilku kont.
  type Out = { status: number; body: Record<string, unknown> }
  const out: Out = await db.begin(async (tx) => {
    const [order] = await tx`
      select session_id, github_login, github_status from mf_orders
      where lower(email) = ${email} and status = 'delivered' order by created_at desc limit 1 for update`
    if (!order) return { status: 403, body: { error: "Brak aktywnego zakupu" } }

    const gh = githubForShop()
    if (!gh) {
      // Bez tokenu GitHub: zapisujemy login i prosimy Wiktorię o ręczne zaproszenie (do 24 h).
      await tx`update mf_orders set github_login = ${login}, github_status = 'none', github_error = null where session_id = ${order.session_id}`
      try {
        await notifySellerGithub(email, login, order.session_id)
      } catch (e) {
        console.error("[mf] github notify failed:", e instanceof Error ? e.message : e)
      }
      return { status: 200, body: { ok: true, manual: true } }
    }

    if (order.github_login && order.github_login.toLowerCase() !== login.toLowerCase() && order.github_status === "invited") {
      try {
        await gh.remove(order.github_login) // jedno konto GitHub na zakup
      } catch (e) {
        // Stary login zostaje zapisany: przy zwrocie dostęp nadal da się odebrać.
        const msg = e instanceof Error ? e.message : String(e)
        await tx`update mf_orders set github_error = ${"remove: " + msg} where session_id = ${order.session_id}`
        return { status: 502, body: { error: "Nie udało się zmienić konta GitHub. Spróbuj później." } }
      }
    }
    try {
      await gh.invite(login)
      await tx`update mf_orders set github_login = ${login}, github_status = 'invited', github_error = null where session_id = ${order.session_id}`
      return { status: 200, body: { ok: true } }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      await tx`update mf_orders set github_login = ${login}, github_status = 'failed', github_error = ${msg} where session_id = ${order.session_id}`
      return { status: 502, body: { error: msg.startsWith("GitHub: nie ma") ? msg : "Nie udało się wysłać zaproszenia." } }
    }
  })
  return NextResponse.json(out.body, { status: out.status })
}
