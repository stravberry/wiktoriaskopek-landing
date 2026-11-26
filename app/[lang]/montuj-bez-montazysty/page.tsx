import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MF_BASE_PATH, MF_PRODUCTS, MF_REQUIREMENTS, SELLER } from "@/lib/mf/config"
import { MF_CASES, MF_FAQ, MF_FEATURES, MF_QUALITY_CHECKS, MF_SHOWCASE, MF_STEPS, MF_STYLES, TODO, stylesLabel } from "@/lib/mf/content"
import { PanelShots, ShowcaseBlock, StyleReels } from "@/components/mf/showcase"
import { LazyVideo } from "@/components/mf/lazy-video"
import { Section, WithTodo } from "@/components/mf/ui"
import { BuyButton, BuyDialog, BuyForm, BuyRow, GuaranteeLine, KonsultacjaLink, StickyBuyBar } from "@/components/mf/buy"
import { ReelFrame, StylePicker } from "@/components/mf/reel"
import { Reveal, ScrollScale } from "@/components/mf/motion"
import { StepByStep } from "@/components/mf/steps"

const URL = `https://www.wiktoriaskopek.pl${MF_BASE_PATH}`
const TITLE = "Montuj swoje filmy i rolki w AI! Bez montażysty | MontageFrames"
const DESC = `Montuj rolki i filmy w AI bez montażysty: MontageFrames dla Claude Code, ${stylesLabel()}, kreator marki, krytyk jakości i panel. ${MF_PRODUCTS.paczka.priceLabel} jednorazowo.`
const OG_IMAGE = { url: "/mf/montageframes-promo-16x9.jpg", width: 1920, height: 1080, alt: "MontageFrames: montaż rolek w Claude Code" }

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "website", locale: "pl_PL", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_IMAGE.url] },
}

const p = MF_PRODUCTS.paczka
// Darmowa próba (00-PLAN 0e): MF_TRIAL_ENABLED=1 włącza stronę i API próby, MF_TRIAL_PUBLIC=1 pokazuje linki na landingu
// (najpierw test na produkcji pod adresem /proba, potem linki).
const TRIAL = process.env.MF_TRIAL_ENABLED === "1" && process.env.MF_TRIAL_PUBLIC === "1" ? `${MF_BASE_PATH}/proba` : undefined
const k = MF_PRODUCTS.konsultacja

export default function MontujBezMontazysty() {
  const seller = { "@type": "Person", name: SELLER.name, email: SELLER.email }
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "MontageFrames",
        description: DESC,
        image: `https://www.wiktoriaskopek.pl${OG_IMAGE.url}`,
        brand: { "@type": "Brand", name: "MontageFrames" },
        offers: [p, k].map((x) => ({
          "@type": "Offer",
          name: x.name,
          price: (x.amountGrosze / 100).toFixed(2),
          priceCurrency: "PLN",
          availability: "https://schema.org/InStock",
          url: `${URL}#zamowienie`,
          seller,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: MF_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  }

  return (
    <main className="pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Pierwszy ekran: co to jest, ile kosztuje, co zrobić. Obok kadr rolki z napisem w stylu marki. */}
      <section className="mf-wrap pt-10 md:pt-16" aria-labelledby="hero-title">
        <h1 id="hero-title" className="mf-h1 mf-h1-slogan max-w-[14ch] md:max-w-[22ch]">Montuj swoje filmy i rolki w AI! Bez montażysty</h1>
        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div>
          <p className="mf-lead max-w-[46ch]">
            Dla ekspertów i małych firm, które regularnie publikują rolki. Wrzucasz nagranie z telefonu, wybierasz styl i dostajesz gotową rolkę w kolorach
            swojej firmy. Poprawki piszesz zwykłym językiem albo nanosisz w panelu. Działa w Claude Code na Twoim komputerze.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <BuyButton source="hero">Kupuję za {p.priceLabel}</BuyButton>
            {TRIAL ? (
              <Link href={TRIAL} className="text-[17px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">Wypróbuj za darmo na 1 rolce</Link>
            ) : (
              <a href="#style" className="text-[17px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">Zobacz {stylesLabel()}</a>
            )}
          </div>
          <GuaranteeLine className="mt-5" />
          <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
            Wolisz zainstalować razem z Wiktorią? <KonsultacjaLink>Wersja z konsultacją 1:1 i instalacją: {k.priceLabel}</KonsultacjaLink>.
            Jednorazowo, bez limitu komputerów. Potrzebujesz płatnego planu Claude Pro lub Max i min. 15 GB miejsca.
          </p>
        </div>
        <ReelFrame slug="dynamiczny-zakreslacz" priority className="mx-auto max-w-[360px] lg:max-w-none" />
        </div>
      </section>

      {/* Film promo 16:9 (Coding Builder, 26.11; muzyka wygenerowana, bez cudzych nagrań) */}
      <section className="mf-wrap mt-20 md:mt-28" aria-labelledby="promo-title">
        <h2 id="promo-title" className="sr-only">MontageFrames w 20 sekund</h2>
        <ScrollScale>
          <LazyVideo
            className="aspect-video w-full rounded-[24px] bg-[#050505] object-cover"
            src="/mf/montageframes-promo-16x9.mp4"
            poster="/mf/montageframes-promo-poster.jpg"
            label="Film: MontageFrames w 20 sekund"
            controls
          />
        </ScrollScale>
      </section>

      {/* Problem */}
      <Section id="problem" title="Montażysta kosztuje. Wieczory też." lead="Każda rolka to albo faktura od montażysty i czekanie na poprawki, albo wieczór nad napisami klatka po klatce. MontageFrames przejmuje tę robotę, a Ty zostajesz przy decyzjach.">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-[21px] font-semibold">Z montażystą</p>
            <p className="mt-3 max-w-[44ch] leading-[1.6]">
              Płacisz za każdą rolkę, czekasz na wersję i na poprawki, a przy regularnych publikacjach koszt rośnie z każdym miesiącem.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[21px] font-semibold">Z MontageFrames</p>
            <p className="mt-3 max-w-[44ch] leading-[1.6]">
              Jednorazowo {p.priceLabel}. Rolkę dostajesz w rozmowie, a poprawki nanosisz sam(a), bez czekania na montażystę. Styl zawsze ten sam. Przy dużych produkcjach reklamowych montażysta
              dalej ma sens: proste rolki zrobisz sam(a).
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Jak to działa krok po kroku: od zakupu do publikacji (00-PLAN 0d, pkt 10) */}
      <Section id="jak-to-dziala" title="Jak to działa krok po kroku" lead="Od zakupu do gotowej rolki. Przewiń, a obok zobaczysz każdy krok.">
        <StepByStep steps={MF_STEPS} />
      </Section>

      <BuyRow source="after_steps" trialHref={TRIAL} />

      {/* Rozmowa albo panel */}
      <Section id="panel" title="Poprawiasz tak, jak Ci wygodniej" lead="Obie drogi pracują na tym samym projekcie: zacznij w rozmowie, dokończ w panelu albo odwrotnie. Efekt jest ten sam.">
        <div className="grid gap-12">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="text-[24px] font-semibold">W rozmowie z Claude Code</h3>
              <p className="mt-3 max-w-[46ch] leading-[1.6]">Piszesz: „przesuń napis niżej”, „podświetl słowo promocja”, „wytnij pauzę w 0:20”. Claude nanosi poprawkę i renderuje rolkę.</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="text-[24px] font-semibold">W panelu w przeglądarce</h3>
              <p className="mt-3 max-w-[46ch] leading-[1.6]">Lokalny panel otwierasz komendą /panel. Edytujesz i poprawiasz napisy, zmieniasz styl i stamtąd renderujesz rolkę, bez pisania.</p>
            </Reveal>
          </div>
          <PanelShots />
        </div>
      </Section>

      {/* Style: żywy element */}
      <Section id="style" title={`${stylesLabel()} w paczce`} lead="Style różnią się animacją tekstu, krojem i tempem, nie tylko kolorem. Kolor akcentu bierzemy z Twojej marki. „Inspirowane stylem” opisuje kierunek, nie współpracę z tą osobą.">
        <StyleReels />
        <h3 className="mt-20 text-[24px] font-semibold">Wszystkie style</h3>
        <p className="mt-2 max-w-[56ch] text-[17px] text-[var(--h-ink-2)]">Kliknij nazwę, a kadr pokaże przybliżony podgląd napisu.</p>
        <div className="mt-8">
          <StylePicker styles={MF_STYLES} />
        </div>
      </Section>

      <BuyRow source="after_styles" trialHref={TRIAL} />

      {/* Funkcje: każda z własnym filmem */}
      <section id="funkcje" aria-labelledby="funkcje-title" className="mt-28 scroll-mt-6 md:mt-44">
        <div className="mf-wrap">
          <h2 id="funkcje-title" className="mf-h2 max-w-[18ch]">Funkcje w akcji</h2>
          <p className="mf-lead mt-6 max-w-[56ch]">Filmy poniżej to rolki wyrenderowane programem MontageFrames.</p>
        </div>
        {MF_SHOWCASE.filter((f) => f.video || f.image).map((f, i) => <ShowcaseBlock key={f.id} f={f} flip={i % 2 === 1} />)}
      </section>

      {/* Kontrola jakości */}
      <Section id="jakosc" title="Krytyk jakości pilnuje rolki" tone="ink" lead="Zanim rolka się wyrenderuje, program sprawdza ją pod kątem błędów, które widać od razu na telefonie.">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <ul className="grid gap-x-10 gap-y-5 text-[21px] font-semibold leading-[1.3] sm:grid-cols-2">
            {MF_QUALITY_CHECKS.map((q, i) => (
              <Reveal as="li" key={q} delay={i * 0.04}>{q.charAt(0).toUpperCase() + q.slice(1)}</Reveal>
            ))}
          </ul>
          <Reveal delay={0.1}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
              <Image src="/home-podcast-setup-equipment.jpg" alt="Biurko z laptopem, mikrofonem i kamerą: tyle wystarczy do montażu w Claude Code" fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
            </figure>
            <p className="mt-3 text-[15px] text-[#a1a1a6]">Potrzebujesz komputera, nagrania i płatnego planu Claude Pro lub Max.</p>
          </Reveal>
        </div>
      </Section>

      <BuyRow source="after_quality" trialHref={TRIAL} />

      {/* Case study: nazwy firm (decyzja Wiktorii, 0c); liczby i cytaty po dostarczeniu. Bez „Szczegóły wkrótce” (audyt Kierownika i Ecom). */}
      <section id="case-study" aria-label="Firmy, które montują z MontageFrames" className="mf-wrap mt-20 md:mt-28">
        <p className="text-[15px] font-semibold text-[var(--h-ink-2)]">Z MontageFrames montują już:</p>
        <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-[21px] font-semibold tracking-[-0.01em]">
          {MF_CASES.map((c) => <li key={c.name}>{c.name}</li>)}
        </ul>
      </section>

      {/* Co dostajesz */}
      <Section id="co-dostajesz" title="Wszystkie funkcje od pierwszego dnia">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {MF_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 0.05}>
                <dt className="text-[21px] font-semibold">{f.title}</dt>
                <dd className="mt-2 leading-[1.55] text-[var(--h-ink-2)]">{f.text}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal delay={0.1} className="bg-[var(--h-surface)] p-7 md:p-10">
            <p className="text-[24px] font-semibold">W cenie {p.priceLabel}</p>
            <ul className="mt-6 flex list-disc flex-col gap-3 pl-5 leading-[1.6]">
              <li>Paczka w prywatnym repozytorium GitHub z aktualizacjami komendą /aktualizacja</li>
              <li>Poradnik online po polsku: instalacja, marka, style, poprawki, rozmowa z AI, także w wersji PDF do pobrania</li>
              <li>Aktualizacje programu przez repozytorium, bez utraty ustawień marki</li>
              <li>Wsparcie mailowe w sprawie instalacji, odpowiedź do 3 dni roboczych</li>
              <li>Bez limitu komputerów w Twojej firmie</li>
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Wymagania */}
      <Section id="wymagania" title="Wymagania, zanim kupisz" tone="surface">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <table className="w-full border-collapse text-left text-[17px] leading-[1.5]">
              <tbody>
                {[
                  ["Claude", MF_REQUIREMENTS.claude],
                  ["System", MF_REQUIREMENTS.system],
                  ["Procesor", MF_REQUIREMENTS.cpu.replace("Procesor: ", "")],
                  ["Pamięć", MF_REQUIREMENTS.ram.replace("RAM: ", "")],
                  ["Dysk", MF_REQUIREMENTS.disk],
                  ["Instalacja", MF_REQUIREMENTS.install],
                  ["Konto", MF_REQUIREMENTS.github],
                ].map(([k2, v]) => (
                  <tr key={k2} className="border-b border-black/10 align-top">
                    <th scope="row" className="w-[28%] py-4 pr-6 font-semibold">{k2}</th>
                    <td className="py-4">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[15px] text-[var(--h-ink-2)]">
              Ceny planów Claude: <a className="underline" href="https://claude.com/pricing" target="_blank" rel="noopener noreferrer">claude.com/pricing</a>. Panel i Claude Code
              zużywają ten sam limit planu. {MF_REQUIREMENTS.macOnly}.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-[24px] font-semibold">To nie dla Ciebie, jeśli</h3>
            <ul className="mt-5 flex list-disc flex-col gap-3 pl-5 leading-[1.6]">
              <li>nie chcesz płacić za plan Claude Pro lub Max,</li>
              <li>robisz duże produkcje reklamowe z budżetem na montażystę,</li>
              <li>oczekujesz, że AI nagra film za Ciebie,</li>
              <li>nie masz komputera z min. 15 GB wolnego miejsca,</li>
              <li>chcesz, żeby ktoś montował za Ciebie. Wtedy <Link className="underline" href="/pl#rezerwacja">napisz do Wiktorii o montaż w usłudze</Link>.</li>
            </ul>
            <h3 className="mt-10 text-[24px] font-semibold">Dla Ciebie, jeśli</h3>
            <ul className="mt-5 flex list-disc flex-col gap-3 pl-5 leading-[1.6]">
              <li>publikujesz rolki regularnie i chcesz, żeby wyglądały jak Twoja marka,</li>
              <li>płacisz dziś montażyście albo montujesz wieczorami.</li>
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Autorka */}
      <Section id="autorka" title="Zrobiła to Wiktoria Skopek">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,420px)_1fr]">
          <Reveal>
            <figure className="relative aspect-[3/2] overflow-hidden rounded-[24px]">
              <Image src="/images/wiktoria-photo-b6m510sk.jpg" alt="Wiktoria Skopek nagrywa występ na scenie" fill sizes="(min-width: 768px) 420px, 90vw" className="object-cover" />
            </figure>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-6 md:flex-row md:items-start">
            <Image src="/images/wiktoria-skopek.jpg" alt="Wiktoria Skopek" width={112} height={112} className="size-24 shrink-0 rounded-full object-cover" />
            <p className="max-w-[52ch] text-[21px] leading-[1.6]">
              Twój partner strategiczny w budowaniu autorytetu wideo: łączę produkcję premium z psychologią sprzedaży. Nagrywam i montuję filmy dla
              firm, prowadzę social media i studio nagrań{" "}
              <a className="underline" href="https://podcastkatowice.pl" target="_blank" rel="noopener noreferrer">podcastkatowice.pl</a>. MontageFrames to narzędzie, którym
              sama montuję rolki na AI.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Gwarancja */}
      <Section id="gwarancja" title="Gwarancja działania" tone="accent">
        <Reveal className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <p className="max-w-[48ch] text-[21px] font-semibold leading-[1.45]">
            Jeśli w ciągu 14 dni nie uruchomisz programu na swoim komputerze mimo naszej pomocy, oddaję pieniądze.
          </p>
          <p className="leading-[1.6]">
            Napisz na <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a> z opisem problemu i wynikiem komendy /stan. Pomożemy
            uruchomić program. Gwarancja nie ogranicza Twoich praw z ustawy.
          </p>
        </Reveal>
      </Section>

      <BuyRow source="after_guarantee" trialHref={TRIAL} />

      {/* FAQ */}
      <Section id="faq" title="Pytania przed zakupem">
        <div className="grid gap-x-12 lg:grid-cols-2">
          {[...MF_FAQ, ...(TRIAL ? [{ q: "Czy mogę najpierw zobaczyć efekt na swoim nagraniu?", a: "Tak. W darmowej próbie ustawiasz markę, wgrywasz nagranie do 60 sekund i dostajesz jedną rolkę ze znakiem wodnym, bez karty." }] : [])].map((f) => (
            <details key={f.q} className="group mb-3 bg-[var(--h-surface)] px-6 py-5">
              <summary className="mf-press flex cursor-pointer list-none items-start justify-between gap-4 text-[21px] font-semibold marker:hidden">
                {f.q}
                <svg viewBox="0 0 20 20" aria-hidden className="mt-1.5 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"><path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </summary>
              <p className="mt-3 max-w-[60ch] leading-[1.6] text-[var(--h-ink-2)]"><WithTodo text={f.a} /></p>
            </details>
          ))}
        </div>
      </Section>

      <BuyRow source="after_faq" trialHref={TRIAL} />

      {/* Zamówienie (z konsultacją jako drugim wariantem) */}
      <Section id="zamowienie" title={`MontageFrames za ${p.priceLabel}`} lead={`Albo z konsultacją 1:1 i instalacją razem ze mną za ${k.priceLabel}: termin ustalamy mailem po zakupie.`}>
        <div className="max-w-[760px] rounded-[28px] bg-[var(--h-surface)] p-6 md:p-9">
          <BuyForm />
        </div>
        <p className="mt-6 max-w-[90ch] text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
          Sprzedawca: {SELLER.name}, {SELLER.address}, {SELLER.form}, e-mail {SELLER.email}, tel. {SELLER.phone}. Ceny końcowe, sprzedawca nie jest czynnym podatnikiem
          VAT. <Link className="underline" href={`${MF_BASE_PATH}/regulamin`}>Regulamin sprzedaży</Link> · <Link className="underline" href="/pl/polityka-prywatnosci">Polityka prywatności</Link>
        </p>
      </Section>
      <BuyDialog />
      <StickyBuyBar trialHref={TRIAL} />
    </main>
  )
}
