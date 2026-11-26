// MontageFrames: jedno miejsce na ceny, teksty zgód, wersje dokumentów i dane sprzedawcy.
// Zmiana ceny = zmiana `priceLabel` tutaj ORAZ ceny w Stripe (kwotę pobiera Stripe, nie ten plik).
// Bez importów aliasów, żeby `node --test` mógł to czytać bezpośrednio.

export const MF_BASE_PATH = "/pl/montuj-bez-montazysty"

export type MfProductId = "paczka" | "konsultacja"

export type MfProduct = {
  id: MfProductId
  name: string
  priceLabel: string
  amountGrosze: number // tylko do kontroli spójności z ceną w Stripe
  /** Nazwa zmiennej środowiskowej z ID ceny Stripe. */
  priceEnv: "MF_PRICE_PACZKA" | "MF_PRICE_KONSULTACJA"
  short: string
  isService: boolean
}

export const MF_PRODUCTS: Record<MfProductId, MfProduct> = {
  paczka: {
    id: "paczka",
    name: "MontageFrames",
    priceLabel: "238 zł",
    amountGrosze: 23800,
    priceEnv: "MF_PRICE_PACZKA",
    short: "Program do montażu filmów i rolek w Claude Code + poradnik online, bez limitu komputerów",
    isService: false,
  },
  konsultacja: {
    id: "konsultacja",
    name: "MontageFrames + konsultacja 1:1 z instalacją",
    priceLabel: "589 zł",
    amountGrosze: 58900,
    priceEnv: "MF_PRICE_KONSULTACJA",
    short: "Program + spotkanie online z Wiktorią: instalacja na Twoim komputerze i pierwsza rolka",
    isService: true,
  },
}

/** Wersje dokumentów zapisywane przy każdej zgodzie. Zmiana treści = nowa wersja. */
export const MF_TERMS_VERSION = "regulamin-mf-2026-11-26"
export const POLICY_VERSION = "polityka-2026-11-25"
export const BANNER_VERSION = "baner-2026-11-25"

export const MF_TEXT = {
  terms:
    "Akceptuję Regulamin sprzedaży MontageFrames i zapoznałem/-am się z Polityką prywatności.",
  digital:
    "Żądam dostarczenia treści cyfrowej (dostęp do programu i poradnika) natychmiast, przed upływem 14 dni na odstąpienie od umowy, i przyjmuję do wiadomości, że z chwilą rozpoczęcia dostarczania tracę prawo odstąpienia od umowy w części dotyczącej treści cyfrowej.",
  serviceStart:
    "Żądam, aby konsultacja mogła się odbyć przed upływem 14 dni na odstąpienie od umowy. Wiem, że po pełnym wykonaniu usługi tracę prawo odstąpienia, a przy odstąpieniu w trakcie płacę za część wykonaną.",
  marketing:
    "Chcę dostawać maile z nowościami i ofertami Wiktorii Skopek (zgoda dobrowolna, mogę ją cofnąć w każdej chwili).",
  orderButton: "Zamawiam z obowiązkiem zapłaty",
} as const

export const SELLER = {
  name: "Wiktoria Skopek",
  form: "działalność nierejestrowana (art. 5 ust. 1 ustawy Prawo przedsiębiorców)",
  address: "ul. Akacjowa 59b, 43-180 Orzesze",
  email: "wskopek.all@gmail.com",
  phone: "+48 537 168 645",
  phoneHref: "tel:+48537168645",
} as const

export const MF_REQUIREMENTS = {
  claude: "Płatny plan Claude Pro lub Max z Claude Code, bez klucza API (koszt planu po Twojej stronie)",
  system: "macOS 14 lub nowszy: wszystkie funkcje. Windows 10/11 i Linux (Ubuntu): instalacja, transkrypcja, kontrola jakości, render i panel; pozostałe moduły tylko na macOS",
  cpu: "Procesor: Apple Silicon zalecany; Intel i x64 działają wolniej",
  disk: "Min. 15 GB wolnego miejsca (instalacja zajmuje ok. 7,5 GB) plus miejsce na nagrania",
  ram: "RAM: zalecane min. 8 GB, najlepiej 16 GB",
  install: "Instalacja z rozmową w /start: ok. 15–30 min",
  internet: "Stałe połączenie z internetem",
  github: "Darmowe konto GitHub do odbioru paczki i aktualizacji (albo pobranie ZIP z konta na stronie)",
  macOnly: "Poza macOS nie ma automatycznego wykrywania twarzy, maski osoby i efektów na niej opartych: kadr ustawiasz ręcznie",
} as const

/**
 * Silnik montażu na otwartej licencji (HyperFrames, Apache-2.0; decyzja Wiktorii 26.11).
 * ZALEŻNE OD WYDANIA: ustaw true dopiero, gdy Coding Builder potwierdzi wydanie paczki na HyperFrames.
 * Do tego czasu strona nie mówi nic o licencji silnika.
 */
export const MF_ENGINE_OPEN_LICENSE = false

/** Ważność linków (sekundy). */
export const MF_TTL = {
  loginToken: 30 * 60,
  purchaseLoginToken: 72 * 60 * 60,
  session: 30 * 24 * 60 * 60,
  fulfillLease: 120,
} as const
