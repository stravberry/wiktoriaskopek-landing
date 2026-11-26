import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MF_BASE_PATH, MF_PRODUCTS, MF_REQUIREMENTS, SELLER } from "@/lib/mf/config"
import { MF_CASES, MF_FAQ, MF_FEATURES, MF_QUALITY_CHECKS, MF_STEPS, MF_STYLES } from "@/lib/mf/content"
import { Section, Todo, WithTodo } from "@/components/mf/ui"
import { BuyButton } from "@/components/mf/client-bits"
import { ReelFrame, StylePicker } from "@/components/mf/reel"
import { Reveal } from "@/components/mf/motion"
import ClaudeTranscript from "@/components/mf/claude-transcript"
import OrderForm from "@/components/mf/order-form"

const URL = `https://wiktoriaskopek.pl${MF_BASE_PATH}`
const TITLE = "MontageFrames: montuj filmy i rolki w AI, bez montażysty | Wiktoria Skopek"
const DESC = `Nakładka na Claude Code do montażu filmów i rolek: 33 style, kreator marki, krytyk jakości, panel w przeglądarce i poradnik online. ${MF_PRODUCTS.paczka.priceLabel} jednorazowo.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "website", locale: "pl_PL", images: ["/images/img-2684.jpg"] },
}

const p = MF_PRODUCTS.paczka
const k = MF_PRODUCTS.konsultacja

export default function MontujBezMontazysty() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "MontageFrames",
    description: DESC,
    brand: { "@type": "Person", name: SELLER.name },
    offers: [p, k].map((x) => ({ "@type": "Offer", name: x.name, price: (x.amountGrosze / 100).toFixed(2), priceCurrency: "PLN", availability: "https://schema.org/InStock", url: URL })),
  }

  return (
    <main className="pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Pierwszy ekran: co to jest, ile kosztuje, co zrobić. Obok kadr rolki z napisem w stylu marki. */}
      <section className="mf-wrap pt-10 md:pt-16" aria-labelledby="hero-title">
        <h1 id="hero-title" className="mf-h1 max-w-[12ch] lg:max-w-none">Montuj rolki w AI. Bez montażysty.</h1>
        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div>
          <p className="mf-lead max-w-[46ch]">
            MontageFrames to nakładka na Claude Code: wrzucasz nagranie z telefonu, wybierasz styl i dostajesz gotową rolkę w kolorach swojej firmy.
            Poprawki piszesz zwykłym językiem albo nanosisz w panelu.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <BuyButton>Kupuję za {p.priceLabel}</BuyButton>
            <a href="#style" className="text-[17px] font-semibold underline decoration-[var(--h-accent)] decoration-2 underline-offset-4">Zobacz 33 style</a>
          </div>
          <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
            Jednorazowo, bez limitu komputerów. Gwarancja działania. Potrzebujesz płatnego planu Claude Pro lub Max i min. 15 GB miejsca; instalacja
            z Claude Code trwa ok. 15–30 minut.
          </p>
        </div>
        <ReelFrame slug="dynamiczny-zakreslacz" priority className="mx-auto max-w-[360px] lg:max-w-none" />
        </div>
      </section>

      {/* Film promo 16:9 (Coding Builder, 26.11; muzyka wygenerowana, bez cudzych nagrań) */}
      <section className="mf-wrap mt-20 md:mt-28" aria-labelledby="promo-title">
        <h2 id="promo-title" className="sr-only">MontageFrames w 20 sekund</h2>
        <video
          className="aspect-video w-full rounded-[24px] bg-[#050505] object-cover"
          src="/mf/montageframes-promo-16x9.mp4"
          poster="/mf/montageframes-promo-16x9.jpg"
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          aria-label="Film: MontageFrames w 20 sekund"
        />
      </section>

      {/* Problem */}
      <Section id="problem" title="Montażysta kosztuje. Wieczory też." lead="Każda rolka to albo faktura od montażysty i czekanie na poprawki, albo wieczór nad napisami klatka po klatce. MontageFrames przejmuje tę robotę, a Ty zostajesz przy decyzjach.">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-[21px] font-semibold">Z montażystą</p>
            <p className="mt-3 max-w-[44ch] leading-[1.6]">
              Płacisz za każdą rolkę, czekasz na wersję i na poprawki. Miesięczny koszt przy regularnych publikacjach: <Todo>kwota z doświadczenia Wiktorii</Todo>.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[21px] font-semibold">Z MontageFrames</p>
            <p className="mt-3 max-w-[44ch] leading-[1.6]">
              Jednorazowo {p.priceLabel}. Rolkę dostajesz w rozmowie, poprawki od razu, styl zawsze ten sam. Przy dużych produkcjach reklamowych montażysta
              dalej ma sens: proste rolki zrobisz sam(a).
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Jak to działa: prawdziwy przebieg w Claude Code */}
      <Section id="jak-to-dziala" title="Jak to działa" tone="surface">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <ol className="flex flex-col gap-10">
            {MF_STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08}>
                <h3 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.015em]">{s.title}</h3>
                <p className="mt-3 max-w-[48ch] leading-[1.6]">{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1}>
            <ClaudeTranscript />
          </Reveal>
        </div>
      </Section>

      {/* Rozmowa albo panel */}
      <Section id="panel" title="Poprawiasz tak, jak Ci wygodniej" lead="Obie drogi pracują na tym samym projekcie: zacznij w rozmowie, dokończ w panelu albo odwrotnie. Efekt jest ten sam.">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="flex flex-col gap-10">
            <Reveal>
              <h3 className="text-[24px] font-semibold">W rozmowie z Claude Code</h3>
              <p className="mt-3 max-w-[46ch] leading-[1.6]">Piszesz: „przesuń napis niżej”, „podświetl słowo promocja”, „wytnij pauzę w 0:20”. Claude nanosi poprawkę i renderuje rolkę.</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="text-[24px] font-semibold">W panelu w przeglądarce</h3>
              <p className="mt-3 max-w-[46ch] leading-[1.6]">Lokalny panel otwierasz komendą /panel. Edytujesz i poprawiasz napisy, zmieniasz styl i stamtąd renderujesz rolkę, bez pisania.</p>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <figure>
              <Image src="/mf/panel-edytor-napisow.jpg" alt="Panel MontageFrames: edytor napisów z podglądem rolki i osią czasu" width={1440} height={900} sizes="(min-width: 1024px) 680px, 92vw" className="w-full rounded-[24px]" />
              <figcaption className="mt-3 text-[15px] text-[var(--h-ink-2)]">Panel: klikasz słowo, poprawiasz tekst albo ustawiasz słowo-klucz. Zmiany zapisują się od razu.</figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      {/* Style: żywy element */}
      <Section id="style" title={`${MF_STYLES.length} stylów w paczce`} lead="Kliknij styl, a kadr obok pokaże napis w tym stylu. Kolor akcentu bierzemy z Twojej marki. „Inspirowane stylem” opisuje kierunek, nie współpracę z tą osobą.">
        <ul className="mb-16 grid grid-cols-3 gap-3 md:gap-6" aria-label="Prawdziwe rolki z programu">
          {[
            ["demo-1-slowo-po-slowie", "Słowo po słowie, wersaliki"],
            ["demo-2-elegancki-premium", "Elegancki premium"],
            ["demo-3-neon-noc", "Neon noc"],
          ].map(([f, n]) => (
            <li key={f}>
              <video className="aspect-[9/16] w-full rounded-[20px] bg-[#1d1d1f] object-cover" src={`/mf/${f}.mp4`} poster={`/mf/${f}.jpg`} autoPlay muted loop playsInline preload="metadata" aria-label={`Rolka demo w stylu ${n}`} />
              <p className="mt-3 text-[15px] font-semibold md:text-[17px]">{n}</p>
            </li>
          ))}
        </ul>
        <StylePicker styles={MF_STYLES} />
      </Section>

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
            <p className="mt-3 text-[15px] text-[#a1a1a6]">Tyle wystarczy: komputer, nagranie i Claude Code. Przykład „przed i po” na materiale bez klientów: <Todo>DO UZUPEŁNIENIA</Todo></p>
          </Reveal>
        </div>
      </Section>

      {/* Case study */}
      <Section id="case-study" title="Firmy, które montują już na AI" lead="Wiktoria ma zgody tych firm. Liczby i opinie dodamy, gdy je przekażą.">
        <ul className="flex flex-col gap-3">
          {MF_CASES.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 0.06} className="grid gap-3 bg-[var(--h-surface)] p-6 md:grid-cols-[1.1fr_1fr_1fr] md:items-baseline md:gap-8 md:p-8">
              <div>
                <p className="text-[24px] font-semibold leading-[1.2]">{c.name}</p>
                <p className="mt-1 text-[15px] text-[var(--h-ink-2)]">Zakres: <WithTodo text={c.scope} /></p>
              </div>
              <p className="leading-[1.6]"><b>Efekt w liczbach:</b> <WithTodo text={c.result} /></p>
              <p className="leading-[1.6]"><b>Opinia:</b> <WithTodo text={c.quote} /></p>
            </Reveal>
          ))}
        </ul>
      </Section>

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
              <li>Poradnik online po polsku: instalacja, marka, style, poprawki, rozmowa z AI (wersja do pobrania: <Todo />)</li>
              <li>Aktualizacje bez utraty ustawień marki (okres: <Todo />)</li>
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
              <li>oczekujesz, że AI nagra film za Ciebie.</li>
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
              Nagrywam i montuję filmy dla firm, prowadzę social media i studio nagrań{" "}
              <a className="underline" href="https://podcastkatowice.pl" target="_blank" rel="noopener noreferrer">podcastkatowice.pl</a>. MontageFrames to narzędzie, którym
              sama montuję rolki na AI. <Todo>krótkie bio do zatwierdzenia</Todo>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Gwarancja */}
      <Section id="gwarancja" title="Program działa albo oddaję pieniądze" tone="accent">
        <Reveal className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <p className="max-w-[48ch] text-[21px] font-semibold leading-[1.45]">
            Jeśli po instalacji według poradnika program nie zmontuje rolki na komputerze, który spełnia wymagania, napisz do mnie. Jeśli w ciągu 14 dni od
            zgłoszenia nie usunę problemu, oddam Ci całą kwotę.
          </p>
          <p className="leading-[1.6]">
            Zgłoszenie: mail na <a className="underline" href={`mailto:${SELLER.email}`}>{SELLER.email}</a> z opisem i wynikiem komendy /stan. Gwarancja nie ogranicza
            Twoich praw z ustawy. <span className="rounded bg-white/70 px-1.5 py-0.5 font-semibold">Brzmienie do zatwierdzenia</span>
          </p>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="Pytania przed zakupem">
        <div className="grid gap-x-12 lg:grid-cols-2">
          {MF_FAQ.map((f) => (
            <details key={f.q} className="group mb-3 bg-[var(--h-surface)] px-6 py-5">
              <summary className="mf-press cursor-pointer list-none text-[21px] font-semibold marker:hidden">{f.q}</summary>
              <p className="mt-3 max-w-[60ch] leading-[1.6] text-[var(--h-ink-2)]"><WithTodo text={f.a} /></p>
            </details>
          ))}
        </div>
      </Section>

      {/* Zamówienie (z konsultacją jako drugim wariantem) */}
      <Section id="zamowienie" title={`MontageFrames za ${p.priceLabel}`} lead={`Albo z konsultacją 1:1 i instalacją razem ze mną za ${k.priceLabel}: termin ustalamy mailem po zakupie.`}>
        <OrderForm />
        <p className="mt-6 max-w-[90ch] text-[15px] leading-[1.6] text-[var(--h-ink-2)]">
          Sprzedawca: {SELLER.name}, {SELLER.address}, {SELLER.form}, e-mail {SELLER.email}, tel. {SELLER.phone}. Ceny końcowe, sprzedawca nie jest czynnym podatnikiem
          VAT. <Link className="underline" href={`${MF_BASE_PATH}/regulamin`}>Regulamin sprzedaży</Link> · <Link className="underline" href="/pl/polityka-prywatnosci">Polityka prywatności</Link>
        </p>
      </Section>
    </main>
  )
}
