import { NextResponse, type NextRequest } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { sql } from "@/lib/mf/db"
import { mfEnv, origin, SESSION_COOKIE, sessionCookieOptions, sessionCookieValue, stripe } from "@/lib/mf/server"

export const dynamic = "force-dynamic"

// GET /api/mf/po-zakupie?session_id=cs_…: „Przejdź do konta” ze strony podziękowania (audyt Ecom P2.14).
// Loguje tylko raz, do 30 min po płatności, gdy Stripe potwierdza opłaconą sesję i zamówienie jest dostarczone.
// Mail z linkiem logowania zostaje drogą zapasową.
export async function GET(request: NextRequest) {
  const account = `${origin()}${MF_BASE_PATH}/konto`
  if (mfEnv().disabled) return NextResponse.redirect(account)
  const id = request.nextUrl.searchParams.get("session_id") ?? ""
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return NextResponse.redirect(account)

  let paid = false
  try {
    const s = await stripe().checkout.sessions.retrieve(id)
    paid = s.payment_status === "paid" && Date.now() / 1000 - s.created < 30 * 60
  } catch {
    paid = false
  }
  if (!paid) return NextResponse.redirect(account)

  const rows = await sql()`
    update mf_orders set instant_login_at = now()
    where session_id = ${id} and status = 'delivered' and instant_login_at is null and created_at > now() - interval '30 minutes'
    returning email`
  if (!rows.length) {
    // Webhook mógł jeszcze nie zapisać zamówienia (zwykle ok. 1 s): wracamy na podziękowanie z prośbą o chwilę.
    const [o] = await sql()`select status, instant_login_at from mf_orders where session_id = ${id}`
    if (!o || (o.status !== "delivered" && !o.instant_login_at)) {
      return NextResponse.redirect(`${origin()}${MF_BASE_PATH}/dziekujemy?session_id=${encodeURIComponent(id)}&konto=czekaj`)
    }
    return NextResponse.redirect(`${account}?blad=link`)
  }

  const res = NextResponse.redirect(account)
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(rows[0].email as string), sessionCookieOptions)
  return res
}
