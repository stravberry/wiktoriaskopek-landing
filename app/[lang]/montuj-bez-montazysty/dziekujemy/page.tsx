import type { Metadata } from "next"
import Link from "next/link"
import { MF_BASE_PATH, MF_PRODUCTS } from "@/lib/mf/config"
import { mailFrom, mfEnv, stripe } from "@/lib/mf/server"
import { ResendButton } from "@/components/mf/account-forms"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Dziękuję za zakup | MontageFrames", robots: { index: false, follow: false } }

function Box({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto max-w-[820px] px-5 pb-16 pt-12 md:px-10 md:pt-20">{children}</main>
    </>
  )
}

// Nie ufamy adresowi URL: sesję pobieramy ze Stripe po stronie serwera. Niczego tu nie realizujemy (robi to webhook).
export default async function Dziekujemy({ searchParams }: { searchParams: Promise<{ session_id?: string; konto?: string }> }) {
  const { session_id, konto } = await searchParams
  const { disabled } = mfEnv()
  let session = null
  if (!disabled && session_id && /^cs_(test|live)_[A-Za-z0-9]+$/.test(session_id)) {
    try {
      session = await stripe().checkout.sessions.retrieve(session_id)
    } catch {
      session = null
    }
  }

  if (!session) {
    return (
      <Box>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">Nie znaleźliśmy tego zamówienia</h1>
        <p className="mt-5 text-[18px] text-[var(--h-ink-2)]">
          Sprawdź link albo wróć do <Link className="underline" href={MF_BASE_PATH}>strony produktu</Link>. Jeśli zapłaciłeś/-aś, mail z dostępem i tak do Ciebie dojdzie.
        </p>
      </Box>
    )
  }

  const paid = session.payment_status === "paid"
  const product = session.metadata?.mf_product === "konsultacja" ? MF_PRODUCTS.konsultacja : MF_PRODUCTS.paczka
  const from = mailFrom().replace(/^.*<(.+)>$/, "$1")

  return (
    <Box>
      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
        {paid ? "Dziękuję! Płatność przyjęta" : "Czekamy na potwierdzenie płatności"}
      </h1>
      <p className="mt-4 text-[18px] text-[var(--h-ink-2)]">
        {product.name}. {paid ? "Dostęp wysyłamy mailem w ciągu kilku minut." : "Przy BLIK i przelewach potwierdzenie może zająć chwilę. Mail wyślemy, gdy płatność dojdzie."}
      </p>
      <ol className="mt-10 flex flex-col gap-3">
        {[
          `Sprawdź skrzynkę. Nadawca: ${from}. Temat: „MontageFrames: Twój dostęp i klucz licencyjny”. Zajrzyj też do spamu.`,
          "Wejdź na konto przyciskiem poniżej albo z linku w mailu. Tam podasz login GitHub, znajdziesz poradnik i dostęp do paczki.",
          "Otwórz paczkę w Claude Code, wpisz /start i zacznij od rozdziału 1 poradnika.",
        ].map((t, i) => (
          <li key={t} className="flex gap-4 rounded-[24px] bg-[var(--h-surface)] p-6 text-[17px] leading-[1.5]">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] font-bold text-[#111111]">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>
      {paid && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {/* Logowanie od razu po płatności (jednorazowe, 30 min); mail zostaje kopią zapasową. */}
          <a href={`/api/mf/po-zakupie?session_id=${encodeURIComponent(session.id)}`} className="mf-press inline-flex min-h-14 items-center rounded-full bg-[var(--h-accent)] px-7 text-[17px] font-bold text-[#111111]">
            Przejdź do konta
          </a>
          <ResendButton sessionId={session.id} />
        </div>
      )}
      {paid && konto === "czekaj" && (
        <p role="status" className="mt-4 text-[16px] font-semibold">Zamówienie jeszcze się zapisuje. Spróbuj „Przejdź do konta” za kilka sekund.</p>
      )}
      {product.id === "paczka" && paid && (
        <div className="mt-12 rounded-[28px] bg-[var(--h-surface)] p-7">
          <h2 className="text-[22px] font-semibold">Chcesz zainstalować razem ze mną?</h2>
          <p className="mt-2 text-[16px] text-[var(--h-ink-2)]">
            Konsultacja 1:1 z instalacją i pierwszą rolką na Twoim materiale. Napisz na wskopek.all@gmail.com, ustalimy termin i warunki.
          </p>
        </div>
      )}
    </Box>
  )
}
