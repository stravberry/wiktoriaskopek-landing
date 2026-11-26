import { NextResponse, type NextRequest } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { checkoutParams, consentRecord, InputError, parseCheckoutInput, priceIdFor } from "@/lib/mf/core"
import { sql } from "@/lib/mf/db"
import { clientIp, currentBuyer, mfEnv, origin, rateLimited, stripe } from "@/lib/mf/server"
import { logEvent } from "@/lib/mf/events"

export const dynamic = "force-dynamic"

// POST /api/mf/checkout: walidacja zgód → zapis zgody → sesja Stripe Checkout → URL przekierowania.
export async function POST(request: NextRequest) {
  const { disabled, env } = mfEnv()
  if (disabled) return NextResponse.json({ error: "Sprzedaż jest chwilowo wyłączona." }, { status: 503 })
  if (rateLimited(`checkout:${clientIp(request.headers)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj za minutę." }, { status: 429 })
  }

  let input
  try {
    input = parseCheckoutInput(await request.json())
  } catch (e) {
    const msg = e instanceof InputError ? e.message : "Nieprawidłowe dane"
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // Zalogowany (np. po darmowej próbie): e-mail wpisujemy za niego w Stripe (audyt Ecom, szybszy zakup).
  const buyer = await currentBuyer()
  if (!input.email && buyer) input = { ...input, email: buyer }

  const priceId = priceIdFor(input.product, env)
  if (!priceId) return NextResponse.json({ error: "Ten wariant jest chwilowo niedostępny." }, { status: 503 })

  const db = sql()
  const c = consentRecord(input)
  const [row] = await db`
    insert into mf_consents (product, email, terms_version, terms_accepted, digital_consent, digital_consent_text,
                             service_start_consent, marketing_consent, github_login, lang)
    values (${c.product}, ${c.email}, ${c.terms_version}, ${c.terms_accepted}, ${c.digital_consent}, ${c.digital_consent_text},
            ${c.service_start_consent}, ${c.marketing_consent}, ${c.github_login}, ${c.lang})
    returning id`
  const consentId = row.id as string

  try {
    const session = await stripe().checkout.sessions.create(
      checkoutParams(input, { priceId, consentId, origin: origin(), basePath: MF_BASE_PATH }),
      { idempotencyKey: `mf-checkout/${consentId}` },
    )
    await db`update mf_consents set checkout_session_id = ${session.id} where id = ${consentId}`
    await logEvent("checkout_started", { offer: input.product, from_account: !!buyer }, input.email || null)
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error("[mf] checkout failed:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "Nie udało się rozpocząć płatności. Spróbuj ponownie." }, { status: 502 })
  }
}
