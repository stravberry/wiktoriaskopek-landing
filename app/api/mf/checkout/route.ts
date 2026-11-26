import { NextResponse, type NextRequest } from "next/server"
import { MF_BASE_PATH } from "@/lib/mf/config"
import { checkoutParams, consentRecord, InputError, parseCheckoutInput, priceIdFor, shopTestLocked, testerAllowed } from "@/lib/mf/core"
import { getAttribution, saveAttribution, sql } from "@/lib/mf/db"
import { clientIp, currentBuyer, mfEnv, origin, rateLimited, stripe } from "@/lib/mf/server"
import { logEvent } from "@/lib/mf/events"

export const dynamic = "force-dynamic"

// GET /api/mf/checkout: czy formularz ma od razu pokazać zapis na listę (tryb testowy na produkcji, S2).
export async function GET() {
  const { env } = mfEnv()
  if (!shopTestLocked(env)) return NextResponse.json({ waitlist: false })
  const buyer = await currentBuyer()
  return NextResponse.json({ waitlist: !(buyer && testerAllowed(buyer, env)) }, { headers: { "Cache-Control": "no-store" } })
}

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
  // S2: tryb testowy na produkcji. Zakup tylko dla zalogowanego testera; e-mail ustawiamy z sesji (Stripe go nie zmieni).
  if (shopTestLocked(env)) {
    if (!buyer || !testerAllowed(buyer, env)) {
      return NextResponse.json({ error: "Sklep w trybie testowym: zakup wkrótce.", waitlist: true }, { status: 403 })
    }
    input = { ...input, email: buyer }
  }

  const priceId = priceIdFor(input.product, env)
  if (!priceId) return NextResponse.json({ error: "Ten wariant jest chwilowo niedostępny." }, { status: 503 })

  const db = sql()
  // Źródło wejścia (audyt Ecom 2, pkt 4): UTM z tej sesji przeglądarki albo zapisany przy próbie (first-touch), plus id próby.
  const attr = input.email ? await getAttribution(db, input.email) : null
  if (input.email) await saveAttribution(db, input.email, input.utm)
  const trialMeta: Record<string, string> = attr?.trial_id ? { mf_trial_id: attr.trial_id, mf_trial_at: new Date(attr.trial_at ?? Date.now()).toISOString() } : {}
  if (attr && Object.keys(attr.utm ?? {}).length) input = { ...input, utm: { ...attr.utm } }
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
      withMeta(checkoutParams(input, { priceId, consentId, origin: origin(), basePath: MF_BASE_PATH }), trialMeta),
      { idempotencyKey: `mf-checkout/${consentId}` },
    )
    await db`update mf_consents set checkout_session_id = ${session.id} where id = ${consentId}`
    await logEvent("checkout_started", { offer: input.product, from_account: !!buyer, from_trial: !!attr?.trial_id, utm_source: input.utm.utm_source ?? null, utm_campaign: input.utm.utm_campaign ?? null }, input.email || null)
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error("[mf] checkout failed:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "Nie udało się rozpocząć płatności. Spróbuj ponownie." }, { status: 502 })
  }
}

function withMeta<T extends { metadata: Record<string, string> }>(params: T, extra: Record<string, string>): T {
  return { ...params, metadata: { ...params.metadata, ...extra } }
}
