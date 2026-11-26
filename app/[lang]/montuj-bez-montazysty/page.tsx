import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { nobr } from "@/lib/typo"
import { MF_BASE_PATH, MF_PRODUCTS, MF_REQUIREMENTS, SELLER } from "@/lib/mf/config"
import { MF_FAQ, MF_FEATURES, MF_QUALITY_CHECKS, MF_SHOWCASE, MF_STEPS, MF_STYLES, TODO, stylesLabel } from "@/lib/mf/content"
import { PanelShots, ShowcaseBlock } from "@/components/mf/showcase"
import { StyleGallery } from "@/components/mf/style-gallery"
import { PaperVariants, SimpleCaptions } from "@/components/mf/simple-captions"
import { shopTestLocked } from "@/lib/mf/core"
import { LazyVideo } from "@/components/mf/lazy-video"
import { Section, WithTodo } from "@/components/mf/ui"
import { BuyButton, BuyDialog, BuyForm, BuyRow, GuaranteeLine, KonsultacjaLink, StickyBuyBar } from "@/components/mf/buy"
import { Reveal, ScrollScale } from "@/components/mf/motion"
import { StepByStep } from "@/components/mf/steps"
import { Compare } from "@/components/mf/compare"
import { ClientLogos } from "@/components/mf/clients"
import { LayerStack, PanelTilt, PhoneSpin } from "@/components/mf/apple"

const URL = `https://www.wiktoriaskopek.pl${MF_BASE_PATH}`
const TITLE = "Montuj filmy i rolki w AI bez montażysty | MontageFrames"
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
          // Tryb testowy na produkcji: zakup jeszcze niemożliwy, więc nie „InStock” (zgodność danych z tym, co widzi klient).
          availability: shopTestLocked(process.env) ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
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

      {/* 0f: pierwszy ekran w stylu Apple. Hasło bez zmian (decyzja Wiktorii), jedno zdanie, dwie akcje, gwarancja. Telefon z rolką obraca się przy przewijaniu. */}
      <section className="mf-wrap pt-14 text-center md:pt-24" aria-labelledby="hero-title">
        <h1 id="hero-title" className="mf-display mx-auto max-w-[13ch] md:max-w-[16ch]">Montuj swoje filmy i rolki w AI! Bez montażysty</h1>
        <p className="mf-lead mx-auto mt-7 max-w-[40ch]">
          Wrzucasz nagranie z telefonu, wybierasz styl i dostajesz gotową rolkę w kolorach swojej firmy. W Claude Code, na Twoim komputerze.
        </p>
        <div id="hero-cta" className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <BuyButton source="hero">Kupuję za {p.priceLabel}</BuyButton>
          {TRIAL ? (
            <Link href={TRIAL} className="inline-flex min-h-11 items-center text-[17px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">Wypróbuj za darmo na 1 rolce</Link>
          ) : (
            <a href="#style" className="inline-flex min-h-11 items-center text-[17px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">Zobacz {stylesLabel()}</a>
          )}
        </div>
        <GuaranteeLine className="mt-5" />
        <p className="mx-auto mt-3 max-w-[56ch] text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
          Wolisz razem z Wiktorią? <span className="whitespace-nowrap"><KonsultacjaLink>Z konsultacją 1:1 i instalacją: {k.priceLabel}</KonsultacjaLink></span>.
        </p>
        <div className="mt-14 md:mt-20">
          <PhoneSpin src="/mf/style/dynamiczny-zakreslacz.mp4" poster="/mf/style/dynamiczny-zakreslacz.jpg" label="Rolka zmontowana w MontageFrames, styl Dynamiczny zakreślacz" />
        </div>
      </section>

      {/* Ciemna scena: film promo na całą szerokość kontenera */}
      <Section id="promo" title="Mówisz. Claude montuje." tone="dark" center lead="Napisy, animacje, cięcia i kolory Twojej marki. Bez osi czasu i bez klatkowania.">
        <ScrollScale>
          <LazyVideo
            className="aspect-video w-full rounded-[24px] bg-[#050505] object-cover"
            src="/mf/montageframes-promo-16x9.mp4"
            poster="/mf/montageframes-promo-poster.jpg"
            label="Film: MontageFrames w 20 sekund"
            controls
          />
        </ScrollScale>
      </Section>

      {/* Liczby jako bohater: tylko fakty z oferty i regulaminu, bez wymyślonych wyników */}
      <section className="mf-wrap mt-28 md:mt-44" aria-labelledby="liczby-title">
        <h2 id="liczby-title" className="sr-only">MontageFrames w liczbach</h2>
        <dl className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [String(MF_STYLES.length), stylesLabel().split(" ")[1], "animacji napisów, każdy z własnym ruchem i tempem"],
            [String(p.amountGrosze / 100), "zł", "jednorazowo, bez abonamentu i bez limitu komputerów w firmie"],
            ["14", "dni", "gwarancji działania: uruchomimy program albo oddam pieniądze"],
            ["15–30", "min", "instalacji z rozmową w /start, krok po kroku"],
          ].map(([n, u, t], i) => (
            <Reveal key={u} delay={i * 0.06}>
              <dt className="mf-num whitespace-nowrap">{n}<span className="ml-2 text-[0.38em] tracking-[-0.02em]">{u}</span></dt>
              <dd className="mt-4 max-w-[26ch] text-[17px] leading-[1.5] text-[var(--h-ink-2)]">{nobr(t)}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Porównanie zamiast akapitów */}
      <Section id="problem" title="Montażysta kosztuje. Wieczory też." center>
        <Compare rows={[
          ["Koszt", "płacisz za każdą rolkę", `${p.priceLabel} jednorazowo`],
          ["Poprawki", "czekasz na kolejną wersję", "piszesz zdanie albo klikasz w panelu"],
          ["Styl", "zależy od osoby i terminu", "zawsze ten sam, w kolorach marki"],
          ["Ma sens przy", "dużych produkcjach reklamowych", "regularnych rolkach eksperta i firmy"],
        ]} />
      </Section>

      {/* Jak to działa krok po kroku: od zakupu do publikacji (00-PLAN 0d, pkt 10), przyklejony podgląd */}
      <Section id="jak-to-dziala" title="Jak to działa krok po kroku" lead="Przewiń, a obok zobaczysz każdy krok.">
        <StepByStep steps={MF_STEPS} />
      </Section>

      <BuyRow source="after_steps" trialHref={TRIAL} />

      {/* Ciemna scena: duże zbliżenie na panel (3D: zrzut prostuje się przy przewijaniu) */}
      <Section id="panel" title="Każde słowo pod ręką." tone="dark" center lead="Poprawiasz w rozmowie z Claude Code albo w panelu w przeglądarce. Oba sposoby działają na tym samym projekcie.">
        <PanelTilt src="/mf/panel-0l/03-edytor-slowo.jpg" alt="Panel: edytor rolki, wybrane słowo z opcjami wyróżnienia, lista słów i oś czasu" />
        <div className="mx-auto mt-16 grid max-w-[920px] gap-10 text-left md:mt-24 md:grid-cols-2">
          <Reveal>
            <h3 className="text-[24px] font-semibold">W rozmowie</h3>
            <p className="mt-3 leading-[1.6] text-[var(--h-ink-2)]">„Przesuń napis niżej”, „podświetl słowo promocja”, „wytnij pauzę w 0:20”.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-[24px] font-semibold">W panelu</h3>
            <p className="mt-3 leading-[1.6] text-[var(--h-ink-2)]">Komenda /panel otwiera edytor: klikasz słowo, zmieniasz styl, renderujesz.</p>
          </Reveal>
        </div>
        <div className="mt-16 md:mt-24"><PanelShots /></div>
      </Section>

      {/* Style: żywy element */}
      <Section id="style" title={`${stylesLabel()} w paczce`} lead="Różnią się animacją tekstu, krojem i tempem, nie tylko kolorem. Kolor akcentu bierzemy z Twojej marki. „Inspirowane stylem” opisuje kierunek, nie współpracę z tą osobą.">
        <LazyVideo
          className="mb-12 aspect-video w-full rounded-[24px] bg-[#1d1d1f] object-cover"
          src="/mf/funkcje/przeglad-stylow-poziomo.mp4"
          poster="/mf/funkcje/przeglad-stylow-poziomo.jpg"
          label="Sześć stylów na tym samym nagraniu: Słowo po słowie, Luksusowy dokument, Elegancki premium, Adnotacje odręczne, Mem / Gen Z, Pytania i odpowiedzi"
        />
        <StyleGallery styles={MF_STYLES} />
      </Section>

      {/* 0k: proste napisy (1/2/3 słowa, 5 animacji) i Paper w 5 wariantach */}
      <Section id="proste-napisy" title="Proste napisy, bez ozdobników" lead="1, 2 albo 3 słowa naraz. Animację wybierasz sam: bez animacji, pop, fade, wjazd w górę albo maszyna do pisania.">
        <SimpleCaptions />
        <h3 className="mt-20 text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-[-0.03em] md:mt-28">Paper w pięciu wariantach</h3>
        <p className="mf-lead mt-3 max-w-[52ch]">Kolaż, zeszyt, wycinanki, gazeta i karton. Faktury i krawędzie są generowane w programie.</p>
        <div className="mt-10"><PaperVariants /></div>
      </Section>

      <BuyRow source="after_styles" trialHref={TRIAL} />

      {/* 3D: warstwy prawdziwej klatki rolki (Coding Builder, 0f) rozsuwają się przy przewijaniu */}
      <Section id="warstwy" title="Kadr, napisy, marka." tone="dark" center lead="Program składa rolkę z trzech warstw: Twoje nagranie, napisy w wybranym stylu i grafiki w kolorach marki.">
        <LayerStack
          label="Klatka rolki rozłożona na trzy warstwy: kadr nagrania, napisy i grafiki z oznaczeniem marki"
          layers={[
            { src: "/mf/apple/warstwa-1-kadr.webp", alt: "" },
            { src: "/mf/apple/warstwa-2-napisy.webp", alt: "" },
            { src: "/mf/apple/warstwa-3-grafiki-marka.webp", alt: "" },
          ]}
        />
      </Section>

      {/* Funkcje: każda z własnym filmem, sceny na zmianę ciemne i jasne */}
      <section id="funkcje" aria-labelledby="funkcje-title" className="mt-28 scroll-mt-6 md:mt-44">
        <div className="mf-wrap pb-4 text-center">
          <h2 id="funkcje-title" className="mf-h2 mx-auto max-w-[16ch]">Funkcje w akcji</h2>
          <p className="mf-lead mx-auto mt-6 max-w-[44ch]">Każdy film poniżej to rolka wyrenderowana programem MontageFrames.</p>
        </div>
        {MF_SHOWCASE.filter((f) => f.video || f.image).map((f, i) => <ShowcaseBlock key={f.id} f={f} flip={i % 2 === 1} dark={i % 2 === 0} />)}
      </section>

      {/* Kontrola jakości */}
      <Section id="jakosc" title="Krytyk jakości pilnuje rolki" tone="dark" lead="Zanim rolka się wyrenderuje, program sprawdza ją pod kątem błędów, które widać od razu na telefonie.">
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

      {/* Klienci: loga z oficjalnych stron (zlecenie Wiktorii 26.11), nazwy zostają (decyzja Wiktorii, 0c) */}
      <ClientLogos />

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
                    <td className="py-4">{nobr(v)}</td>
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
            <details key={f.q} className="group mb-3 bg-[var(--h-surface)] px-6">
              <summary className="mf-press flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-5 text-[21px] font-semibold marker:hidden">
                {f.q}
                <svg viewBox="0 0 20 20" aria-hidden className="mt-1.5 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"><path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              </summary>
              <p className="-mt-2 max-w-[60ch] pb-5 leading-[1.6] text-[var(--h-ink-2)]"><WithTodo text={nobr(f.a)} /></p>
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
          Sprzedawca: {SELLER.name}, {nobr(SELLER.address)}, {SELLER.form}, e-mail {SELLER.email}, tel. {SELLER.phone}. Ceny końcowe, sprzedawca nie jest czynnym podatnikiem
          VAT. <Link className="underline" href={`${MF_BASE_PATH}/regulamin`}>Regulamin sprzedaży</Link> · <Link className="underline" href="/pl/polityka-prywatnosci">Polityka prywatności</Link>
        </p>
      </Section>
      <BuyDialog />
      <StickyBuyBar trialHref={TRIAL} />
    </main>
  )
}
