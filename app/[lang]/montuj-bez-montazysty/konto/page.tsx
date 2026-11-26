import type { Metadata } from "next"
import Link from "next/link"
import { Download } from "lucide-react"
import { MF_BASE_PATH, MF_PRODUCTS, SELLER } from "@/lib/mf/config"
import { ordersForEmail, sql } from "@/lib/mf/db"
import { currentBuyer, githubForShop, mfEnv } from "@/lib/mf/server"
import { GithubForm, LoginForm } from "@/components/mf/account-forms"
import TestModeBar from "@/components/mf/test-mode-bar"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Moje konto | MontageFrames", robots: { index: false, follow: false } }

const ERRORS: Record<string, string> = {
  link: "Ten link wygasł albo był już użyty. Wyślij nowy poniżej.",
  niedostepne: "Konto jest chwilowo niedostępne.",
}

export default async function Konto({ searchParams }: { searchParams: Promise<{ blad?: string }> }) {
  const { blad } = await searchParams
  const { disabled } = mfEnv()
  const email = disabled ? null : await currentBuyer()

  if (!email) {
    return (
      <main className="mx-auto max-w-[640px] px-5 pb-36 pt-12 md:px-10 md:pt-20">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">Twoje konto MontageFrames</h1>
        <p className="mt-4 text-[18px] text-[var(--h-ink-2)]">Logujesz się linkiem z maila, bez hasła. Link działa raz przez 30 minut.</p>
        {blad && ERRORS[blad] && <p role="alert" className="mt-6 rounded-2xl bg-[var(--h-accent)]/15 p-4 font-semibold">{ERRORS[blad]}</p>}
        <div className="mt-8 rounded-[28px] bg-[var(--h-surface)] p-7">{disabled ? <p>{ERRORS.niedostepne}</p> : <LoginForm />}</div>
      </main>
    )
  }

  const orders = await ordersForEmail(sql(), email)
  const active = orders.find((o) => o.status === "delivered")
  const gh = githubForShop()
  const version = gh ? await gh.latestVersion().catch(() => null) : null

  return (
    <main className="mx-auto max-w-[900px] px-5 pb-16 pt-12 md:px-10 md:pt-20">
      <TestModeBar />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">Moje konto</h1>
          <p className="mt-2 text-[16px] text-[var(--h-ink-2)]">{email}</p>
        </div>
        <form action="/api/mf/logout" method="post">
          <button className="rounded-full bg-[var(--h-surface)] px-5 py-2.5 text-[15px] font-semibold hover:bg-[var(--h-surface-hover)]">Wyloguj</button>
        </form>
      </div>

      {!active ? (
        <div className="mt-10 rounded-[28px] bg-[var(--h-surface)] p-7 text-[17px]">
          {orders.length ? "Dostęp do tego zakupu wygasł (zwrot lub spór o płatność)." : "Na ten adres nie ma aktywnego zakupu."} Pytania:{" "}
          <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-3">
          <section className="rounded-[28px] bg-[var(--h-surface)] p-7">
            <h2 className="text-[22px] font-semibold">{MF_PRODUCTS[active.product].name}</h2>
            <p className="mt-2 text-[15px] text-[var(--h-ink-2)]">
              Zakup z {new Date(active.created_at).toLocaleDateString("pl-PL")}. Klucz licencyjny: MF1-…{active.license_hint} (pełny klucz jest w mailu z dostępem).
            </p>
            {active.product === "konsultacja" && <p className="mt-2 text-[15px]">Konsultacja: termin ustalamy mailem.</p>}
          </section>

          <section className="rounded-[28px] bg-[var(--h-surface)] p-7">
            <h2 className="text-[22px] font-semibold">1. Odbierz paczkę</h2>
            <p className="mt-2 text-[16px] text-[var(--h-ink-2)]">
              Najlepiej przez GitHub: dostajesz zaproszenie do prywatnego repozytorium i aktualizujesz program komendą /aktualizacja.
            </p>
            {active.github_status === "invited" && (
              <p className="mt-3 text-[15px] font-semibold">Zaproszenie wysłane do @{active.github_login}. Zaakceptuj je na github.com/notifications.</p>
            )}
            {active.github_status === "failed" && (
              <p className="mt-3 text-[15px] font-semibold text-[var(--h-accent-ink)]">Nie udało się zaprosić @{active.github_login}. Sprawdź login i spróbuj ponownie.</p>
            )}
            {gh ? (
              <>
                <div className="mt-5"><GithubForm current={active.github_login} /></div>
                <div className="mt-6 pt-6">
                  <a href="/api/mf/download" className="mf-press inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--h-bg)] px-6 text-[16px] font-semibold">
                    <Download className="size-5" /> Pobierz ZIP{version ? ` (wersja ${version.sha} z ${new Date(version.date).toLocaleDateString("pl-PL")})` : ""}
                  </a>
                  <p className="mt-2 text-[14px] text-[var(--h-ink-2)]">Link do pliku jest tymczasowy i generuje się przy kliknięciu. Limit: 10 pobrań na dobę.</p>
                </div>
              </>
            ) : (
              <p className="mt-4 rounded-2xl bg-[var(--h-bg)] p-5 text-[16px] leading-[1.6]">
                Dostęp do paczki (zaproszenie do repozytorium GitHub albo plik ZIP) wyślemy osobnym mailem w ciągu 24 godzin od zakupu. Jeśli masz konto GitHub,
                napisz login na <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a>.
              </p>
            )}
          </section>

          <section className="rounded-[28px] bg-[var(--h-surface)] p-7">
            <h2 className="text-[22px] font-semibold">2. Poradnik</h2>
            <p className="mt-2 text-[16px] text-[var(--h-ink-2)]">Instalacja, marka, style, poprawki i komunikacja z AI krok po kroku.</p>
            <Link href={`${MF_BASE_PATH}/poradnik`} className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[var(--h-accent)] px-6 text-[16px] font-bold text-[#111111]">
              Otwórz poradnik
            </Link>
          </section>

          <section className="rounded-[28px] bg-[var(--h-surface)] p-7">
            <h2 className="text-[22px] font-semibold">Mam problem z instalacją</h2>
            <p className="mt-2 text-[16px] text-[var(--h-ink-2)]">
              Napisz na <a className="underline" href={`mailto:${SELLER.email}?subject=MontageFrames%3A%20problem%20z%20instalacj%C4%85`}>{SELLER.email}</a> i dołącz wynik komendy
              /stan. Odpowiadam do 3 dni roboczych.
            </p>
          </section>
        </div>
      )}
    </main>
  )
}
