import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { AuditForm } from "./audit-form"
import { Booking, CallFab, PHONE, PHONE_HREF, ThemeToggle } from "./home-client"
import { ClientLogos } from "@/components/mf/clients"
import { Reveal } from "@/components/mf/motion"
import { MF_BASE_PATH, MF_PRODUCTS, SELLER } from "@/lib/mf/config"
import CookieSettingsLink from "@/components/mf/cookie-settings-link"
import { nobr } from "@/lib/typo"
import { audytEnabled } from "@/lib/audyt/core"

// Strona główna (plan C, kolejność Kierownika): hero z audytem → liczby → przykładowy audyt → trzy drogi → Wiktoria i studio
// → rozmowa → pytania → końcowy formularz. Wygląd: design system MontageFrames (tokeny, Fustat, pomarańcz marki).
// Audyt IG wyłączony (27.11, Wiktoria): bez flagi AUDYT_ENABLED=1 nie ma formularza, przykładu audytu, pytań o audyt
// ani końcowego formularza; w ich miejscu prowadzimy do rozmowy. Kod audytu zostaje, przywrócenie = flaga + wdrożenie.

// Przykład na FIKCYJNYM profilu (lib/audyt/fixtures.ts, test_salon_ania), wygenerowany silnikiem audytu 27.11.2026.
const SAMPLE = {
  handle: "salon.ania (przykład)",
  ocena: "Zwykłą rolkę ogląda 2050 osób, czyli 85% obserwujących, ale żaden z 6 ostatnich podpisów nie mówi widzowi, co ma zrobić dalej.",
  najlepsza: "Najlepsza rolka: „3 błędy przy demakijażu, które robisz…”, 6100 wyświetleń, 3× więcej niż zwykle. Ten temat i format powtórz.",
  obserwacje: [
    { tytul: "Wezwanie w podpisach", tekst: "0 z 6 podpisów ma wezwanie. Dopisz na końcu każdego jedno zdanie, np. „Umów wizytę: link w bio”." },
    { tytul: "Rozmowa pod rolkami", tekst: "Pod rolkami jest 0,7 komentarza na 1000 wyświetleń. Kończ każdą rolkę pytaniem, na które da się odpowiedzieć jednym słowem." },
    { tytul: "Bio", tekst: "Bio mówi, co robisz, ale nie mówi, co ma zrobić odwiedzający. Dopisz na końcu: „Umów wizytę: [link]”." },
  ],
  zadanie: "W 6 kolejnych rolkach dopisz w podpisie jeden krok dla widza.",
}

const WAYS = [
  {
    name: "Zrób sam",
    what: "MontageFrames",
    text: "Program, który montuje Twoje rolki w stylu Twojej marki: napisy, cięcia, kolory. Na Twoim komputerze, bez abonamentu.",
    price: `${MF_PRODUCTS.paczka.priceLabel} jednorazowo`,
    cta: "Zobacz MontageFrames",
    href: MF_BASE_PATH,
  },
  {
    name: "Z pomocą",
    what: "Konsultacja 1:1 z instalacją",
    text: "Instalujemy MontageFrames razem na Twoim komputerze i robimy pierwszą rolkę na Twoim nagraniu.",
    price: `${MF_PRODUCTS.konsultacja.priceLabel} z programem`,
    cta: "Wersja z konsultacją",
    href: `${MF_BASE_PATH}#zamowienie`,
  },
  {
    name: "Zrobimy za Ciebie",
    what: "Nagrania, social media i reklamy Meta",
    text: "Nagrywamy w studiu albo u Ciebie, montujemy, publikujemy i puszczamy najlepsze rolki jako reklamy.",
    price: "wycena po 20-minutowej rozmowie",
    cta: "Umów rozmowę",
    href: "#rezerwacja",
  },
]

const ALSO = [
  { label: "Szkolenia filmowe i z AI" },
  { label: "Automatyzacje i wdrożenia AI w firmie" },
  { label: "Strony internetowe", href: "https://webdkw.net" },
]

const LINKS = [
  { label: "Instagram", handle: "@wiktoriaskopek", href: "https://www.instagram.com/wiktoriaskopek/" },
  { label: "Studio nagrań", handle: "podcastkatowice.pl", href: "https://podcastkatowice.pl" },
  { label: "Agencja kreatywna", handle: "dkwgroup.net", href: "https://dkwgroup.net/pl" },
  { label: "Strony internetowe", handle: "webdkw.net", href: "https://webdkw.net" },
  { label: "Agencja marketingowa i sprzedażowa", handle: "adify.pl", href: "https://adify.pl" },
  { label: "Facebook", handle: "stravberryx", href: "https://www.facebook.com/stravberryx/" },
]

const ALL_FAQ: { q: string; a: string; audyt?: true }[] = [
  { audyt: true, q: "Czy audyt jest naprawdę darmowy?", a: "Tak. Bez karty i bez zobowiązań. Dostajesz mail z oceną profilu, najlepszą rolką, 3 obserwacjami z liczbami i jednym zadaniem na ten tydzień. Na końcu jest jedna propozycja współpracy, którą możesz zignorować." },
  { audyt: true, q: "Skąd bierzecie dane i co z nimi robicie?", a: "Z publicznych danych Twojego konta firmowego lub twórcy przez oficjalne API Meta. Nie logujemy się na Twoje konto i nie widzimy statystyk z panelu. Pobrane dane kasujemy po 7 dniach, a audyt po 30. Szczegóły są w polityce prywatności." },
  { audyt: true, q: "Mam konto prywatne. Co wtedy?", a: "Przełącz je na konto profesjonalne w aplikacji Instagram (Ustawienia → Typ konta i narzędzia) albo wpisz w formularzu 4 liczby z panelu: obserwujący, średnie wyświetlenia rolki, publikacje i rolki z ostatnich 30 dni." },
  { audyt: true, q: "Ile czeka się na audyt?", a: "Pierwsze audyty czyta osobiście Wiktoria, zanim wyjdą, więc zwykle do 2 dni roboczych od potwierdzenia adresu." },
  { q: "Ile kosztują usługi?", a: `MontageFrames kosztuje ${MF_PRODUCTS.paczka.priceLabel} jednorazowo, a wersja z konsultacją i instalacją ${MF_PRODUCTS.konsultacja.priceLabel}. Nagrania, prowadzenie social mediów i reklamy Meta wyceniamy po krótkiej rozmowie, bo cena zależy od liczby rolek i budżetu reklamowego.` },
  { q: "Dla jakich firm pracujecie?", a: "Głównie dla małych firm usługowych i ekspertów z marką osobistą: salony, gabinety, trenerzy, doradcy, sklepy. Tam, gdzie klienci przychodzą z Instagrama, a rolki mają przyprowadzać zapytania." },
]

/** Pytania na stronie i w danych FAQPage: bez pytań o audyt, gdy audyt jest wyłączony. */
export const homeFaq = (audyt = audytEnabled()) => ALL_FAQ.filter((f) => audyt || !f.audyt).map(({ q, a }) => ({ q, a }))

export default function Home() {
  const audyt = audytEnabled()
  const faq = homeFaq(audyt)
  return (
    <div className="home mf-page min-h-dvh bg-[var(--h-bg)] text-[17px] text-[var(--h-ink)] transition-colors duration-300">
      <header className="mf-wrap flex items-center justify-between gap-4 pt-5 md:pt-8">
        <Link href="/" className="inline-flex min-h-11 items-center text-[17px] font-bold tracking-[-0.01em]">Wiktoria Skopek</Link>
        <nav aria-label="Menu" className="flex items-center gap-1 text-[15px] font-semibold">
          <a href="#uslugi" className="hidden min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)] md:inline-flex">Usługi</a>
          <Link href={MF_BASE_PATH} className="hidden min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)] sm:inline-flex">MontageFrames</Link>
          <a href="#rezerwacja" className="hidden min-h-11 items-center rounded-full px-4 hover:bg-[var(--h-surface)] md:inline-flex">Umów rozmowę</a>
          <ThemeToggle />
        </nav>
      </header>

      <main>
        {/* 1. Hero (z formularzem audytu, gdy audyt włączony) */}
        <section id={audyt ? "audyt" : "start"} aria-labelledby="home-title" className="mf-wrap scroll-mt-6 pt-10 md:pt-16 lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <h1 id="home-title" className="max-w-[16ch] text-balance text-[clamp(2.6rem,7vw,5.6rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
              Rolki, które przyprowadzają klientów do Twojej firmy
            </h1>
            {audyt ? (
              <>
                <p className="mf-lead mt-6 max-w-[46ch]">Nagrania, montaż i reklamy Meta dla firm. Zacznij od darmowego audytu Twojego Instagrama: liczby z Twojego profilu i jedno zadanie na ten tydzień.</p>
                <div className="mt-8 max-w-[760px]">
                  <AuditForm place="hero" />
                </div>
              </>
            ) : (
              <>
                <p className="mf-lead mt-6 max-w-[46ch]">Nagrania, montaż i reklamy Meta dla małych firm. Zacznij od 20 minut rozmowy o Twoich rolkach.</p>
                <a href="#rezerwacja" className="mf-press mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--h-ink)] px-7 text-[16px] font-bold text-[var(--h-bg)] hover:opacity-90">
                  Umów rozmowę <ArrowRight className="size-[18px]" strokeWidth={2.25} aria-hidden />
                </a>
              </>
            )}
            <a href="#uslugi" className="mt-5 flex w-fit min-h-11 items-center gap-2 text-[16px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">
              Usługi dla firm <ArrowRight className="size-[18px]" strokeWidth={2.25} aria-hidden />
            </a>
          </div>
          <figure className="relative mt-12 hidden overflow-hidden rounded-[28px] bg-[var(--h-surface)] lg:sticky lg:top-8 lg:mt-4 lg:block">
            <Image src="/images/dsc5980-enhanced-nr.jpg" alt="Wiktoria Skopek" width={1368} height={2048} priority sizes="(min-width: 1024px) 34vw, 0px" className="aspect-[4/5] w-full object-cover object-[50%_25%]" />
            <figcaption className="absolute inset-x-3 bottom-3 rounded-[20px] bg-black/55 px-4 py-3 text-[15px] leading-[1.4] text-white backdrop-blur-md">
              <strong className="font-semibold">Wiktoria Skopek</strong> · nagrania, montaż i reklamy Meta dla małych firm
            </figcaption>
          </figure>
        </section>

        {/* 2. Dowód w liczbach */}
        <section aria-labelledby="liczby-title" className="mf-wrap mt-28 md:mt-40">
          <Reveal>
            <h2 id="liczby-title" className="max-w-[22ch] text-balance text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.04] tracking-[-0.035em]">
              Ponad <span className="text-[var(--h-accent-ink)]">50 projektów</span> i <span className="text-[var(--h-accent-ink)]">4,3 mln</span> zasięgu.
            </h2>
          </Reveal>
        </section>
        <ClientLogos />

        {/* 3. Przykładowy audyt */}
        {audyt && (
        <section id="przyklad" aria-labelledby="przyklad-title" className="mf-wrap mt-28 scroll-mt-6 md:mt-44">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <h2 id="przyklad-title" className="mf-h2 max-w-[14ch]">Co dostaniesz w audycie</h2>
              <p className="mf-lead mt-6 max-w-[40ch]">Każde zdanie z liczbą z Twojego profilu. Bez ogólników w stylu „publikuj wartościowe treści”.</p>
              <ol className="mt-10 flex flex-col gap-5 text-[17px] leading-[1.5]">
                {[
                  ["Ocena w jednym zdaniu", "ile osób ogląda Twoje rolki na tle obserwujących"],
                  ["Twoja najlepsza rolka", "i ile razy wypadła lepiej niż zwykle"],
                  ["3 obserwacje z liczbami", "z 10 kryteriów: regularność, przerwy, haki, komentarze, bio, wezwania"],
                  ["1 zadanie na ten tydzień", "jedna rzecz, która da najwięcej"],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <span aria-hidden className="mt-[9px] size-2.5 shrink-0 rounded-full bg-[var(--h-accent)]" />
                    <span><strong className="font-semibold">{t}</strong> <span className="text-[var(--h-ink-2)]">{d}</span></span>
                  </li>
                ))}
              </ol>
            </div>
            <Reveal>
              <figure>
                <div className="rounded-[28px] bg-[var(--h-surface)] p-3 md:p-5">
                  <div className="rounded-[22px] bg-[var(--h-bg)] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] md:p-8">
                    <p className="text-[13px] text-[var(--h-ink-2)]">Od: Wiktoria Skopek · Temat: Twój audyt Instagrama</p>
                    <p className="mt-4 text-[22px] font-bold leading-[1.2] tracking-[-0.02em]">Audyt Instagrama: @{SAMPLE.handle}</p>
                    <p className="mt-3 text-[16px] leading-[1.55]">{SAMPLE.ocena}</p>
                    <p className="mt-4 rounded-[14px] bg-[var(--mf-accent-soft)] px-4 py-3 text-[16px] leading-[1.5]">{SAMPLE.najlepsza}</p>
                    <ol className="mt-5 flex flex-col gap-4">
                      {SAMPLE.obserwacje.map((o, i) => (
                        <li key={o.tytul} className="text-[16px] leading-[1.5]"><strong className="font-semibold">{i + 1}. {o.tytul}.</strong> <span className="text-[var(--h-ink-2)]">{o.tekst}</span></li>
                      ))}
                    </ol>
                    <p className="mt-5 border-t border-[var(--h-surface-hover)] pt-4 text-[16px] leading-[1.5]"><strong className="font-semibold">Zadanie na ten tydzień:</strong> {SAMPLE.zadanie}</p>
                  </div>
                </div>
                <figcaption className="mt-3 px-2 text-[14px] text-[var(--h-ink-2)]">Przykład na fikcyjnym profilu salonu kosmetycznego. Twój audyt dostaniesz mailem.</figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
        )}

        {/* 4. Trzy drogi */}
        <section id="uslugi" aria-labelledby="uslugi-title" className="mf-wrap mt-28 scroll-mt-6 md:mt-44">
          <h2 id="uslugi-title" className="mf-h2 max-w-[16ch]">Trzy drogi do rolek, które sprzedają</h2>
          <ul className="mt-12 flex flex-col gap-3 md:mt-16">
            {WAYS.map((w, i) => (
              <Reveal as="li" key={w.name} delay={i * 0.06}>
                <div className="grid gap-5 rounded-[28px] bg-[var(--h-surface)] p-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-10 md:p-10">
                  <div>
                    <p className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">{w.name}</p>
                    <p className="mt-2 text-[17px] font-semibold text-[var(--h-accent-ink)]">{w.what}</p>
                  </div>
                  <div>
                    <p className="max-w-[52ch] text-[17px] leading-[1.55] text-[var(--h-ink-2)]">{w.text}</p>
                    <p className="mt-3 text-[19px] font-bold">{w.price}</p>
                  </div>
                  <a href={w.href} className="mf-press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--h-ink)] px-6 text-center md:whitespace-nowrap md:px-7 text-[16px] font-bold text-[var(--h-bg)] hover:opacity-90">
                    {w.cta} <ArrowRight className="size-[18px]" strokeWidth={2.25} aria-hidden />
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 max-w-[70ch] text-[17px] leading-[1.6] text-[var(--h-ink-2)]">
            Robimy też:{" "}
            {ALSO.map((a, i) => (
              <span key={a.label}>
                {a.href ? <a href={a.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--h-ink)] underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">{a.label}</a> : <span className="font-semibold text-[var(--h-ink)]">{a.label}</span>}
                {i < ALSO.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </section>

        {/* 6. Wiktoria i studio */}
        <section aria-labelledby="studio-title" className="mf-tone-dark mt-28 py-20 md:mt-44 md:py-32">
          <div className="mf-wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="overflow-hidden rounded-[28px]">
              <Image src="/images/studio-podcast.webp" alt="Nagranie wywiadu w studiu PodcastKatowice" width={1920} height={1440} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div>
              <h2 id="studio-title" className="mf-h2 max-w-[14ch]">Własne studio nagrań w Katowicach</h2>
              <p className="mf-lead mt-6 max-w-[44ch]">Rolki, wywiady i materiały eksperckie nagrywamy w studiu albo u Ciebie. Prompter, reżyseria i montaż są po naszej stronie.</p>
              <ul className="mt-10 flex flex-col gap-2">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="home-tile group flex min-h-[64px] items-center justify-between gap-4 rounded-full bg-[var(--h-surface)] py-3 pl-6 pr-3">
                      <span className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                        <span className="text-[17px] font-semibold">{l.label}</span>
                        <span className="truncate text-[15px] text-[var(--h-ink-2)]">{l.handle}</span>
                      </span>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] text-[#111111]"><ArrowUpRight className="home-tile-arrow size-5" strokeWidth={2.25} aria-hidden /></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Rozmowa */}
        <section id="rezerwacja" aria-labelledby="rezerwacja-title" className="mf-wrap mt-28 scroll-mt-6 md:mt-44">
          <h2 id="rezerwacja-title" className="mf-h2 max-w-[16ch]">Porozmawiajmy 20 minut</h2>
          <p className="mf-lead mt-6 max-w-[48ch]">
            {audyt ? "O Twoim audycie, rolkach albo reklamach Meta." : "O Twoich rolkach albo reklamach Meta."} Wybierz termin albo zadzwoń:{" "}
            <a href={PHONE_HREF} className="whitespace-nowrap font-semibold text-[var(--h-ink)] underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">{PHONE}</a>
          </p>
          <div className="mt-12"><Booking /></div>
        </section>

        {/* 8. Pytania */}
        <section id="faq" aria-labelledby="faq-title" className="mf-wrap mt-28 scroll-mt-6 md:mt-44">
          <h2 id="faq-title" className="mf-h2">Pytania</h2>
          <div className="mt-12 flex max-w-[860px] flex-col gap-2">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-[22px] bg-[var(--h-surface)] px-6 open:pb-5">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--h-bg)] text-[20px] leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[68ch] text-[17px] leading-[1.6] text-[var(--h-ink-2)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 9. Końcowy formularz (audyt włączony) albo zaproszenie do rozmowy */}
        <section aria-labelledby="koniec-title" className="mf-wrap mt-28 pb-24 md:mt-44 md:pb-32">
          {audyt ? (
          <div className="rounded-[36px] bg-[var(--h-accent)] p-7 text-[#111111] md:p-14">
            <h2 id="koniec-title" className="max-w-[18ch] text-[clamp(2.2rem,5vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">Zacznij od darmowego audytu</h2>
            <p className="mt-5 max-w-[46ch] text-[19px] leading-[1.5] text-[#3a1a06]">Profil i e-mail wystarczą na start. Resztę zapytamy w trzech kliknięciach.</p>
            <div className="mt-8 max-w-[760px] [--h-surface:rgb(255_255_255/0.55)]">
              <AuditForm place="end" />
            </div>
          </div>
          ) : (
          <div className="rounded-[36px] bg-[var(--h-accent)] p-7 text-[#111111] md:p-14">
            <h2 id="koniec-title" className="max-w-[18ch] text-[clamp(2.2rem,5vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">Porozmawiajmy o Twoich rolkach</h2>
            <p className="mt-5 max-w-[46ch] text-[19px] leading-[1.5] text-[#3a1a06]">20 minut, bez zobowiązań. Wybierz termin w kalendarzu albo zadzwoń.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#rezerwacja" className="mf-press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#111111] px-7 text-[16px] font-bold text-white hover:opacity-90">
                Umów rozmowę <ArrowRight className="size-[18px]" strokeWidth={2.25} aria-hidden />
              </a>
              <a href={PHONE_HREF} className="mf-press inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#111111] px-7 text-[16px] font-bold">{PHONE}</a>
            </div>
          </div>
          )}
        </section>
      </main>
      <footer className="bg-[var(--h-surface)] py-12">
        <div className="mf-wrap flex flex-col gap-6 text-[15px] leading-[1.6] text-[var(--h-ink-2)] md:flex-row md:items-start md:justify-between">
          <p className="max-w-[48ch]">{SELLER.name}, {nobr(SELLER.address)} · <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a> · <a className="underline" href={PHONE_HREF}>{PHONE}</a></p>
          <ul className="flex flex-wrap gap-x-5 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline [&_button]:min-h-11">
            <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
            <li><Link href="/regulamin">Regulamin strony</Link></li>
            <li><Link href={`${MF_BASE_PATH}/regulamin`}>Regulamin sprzedaży</Link></li>
            <li><CookieSettingsLink /></li>
          </ul>
        </div>
      </footer>
      <CallFab />
    </div>
  )
}
