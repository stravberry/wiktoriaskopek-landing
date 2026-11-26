import { MF_ENGINE_OPEN_LICENSE } from "./config.ts"

// Treści landingu MontageFrames. „DO UZUPEŁNIENIA” = brak danych; niczego nie zmyślamy.
// Style: z katalogu paczki DKWGroup/MontageFrames-dist (catalog/gallery.html, commit 8aa2ee5).

export const TODO = "DO UZUPEŁNIENIA"

export type MfStyle = { slug: string; name: string; text: string; tags: string[]; inspired?: string }

export const MF_STYLES: MfStyle[] = [
  { slug: "czysty-minimal", name: "Czysty minimal", text: "Spokojne białe napisy, cienka kreska pod słowem-kluczem. Do porad, edukacji i marek eksperckich.", tags: ["spokojny", "ekspercki"] },
  { slug: "dynamiczny-zakreslacz", name: "Dynamiczny zakreślacz", text: "Duże słowo-klucz na zakreślaczu, szybkie wejścia z boków. Do energicznych rolek sprzedażowych.", tags: ["dynamiczny", "sprzedażowy"] },
  { slug: "elegancki-premium", name: "Elegancki premium", text: "Szeryfowa kursywa w słowach-kluczach, ciepły krem i złoto, łagodny ruch. Do marek premium, beauty i doradztwa.", tags: ["elegancki", "premium"] },
  { slug: "edukacyjny-wysoka-energia", name: "Edukacyjny, wysoka energia", text: "Wąskie, wysokie wersaliki na limonkowym zakreślaczu, żywe wejścia. Do rolek z liczbami i listami.", tags: ["dynamiczny", "edukacyjny"] },
  { slug: "podcast-spokojny", name: "Podcast spokojny", text: "Równe, czytelne napisy, delikatne wejście z dołu. Do wywiadów i podcastów.", tags: ["spokojny", "rozmowa"] },
  { slug: "mocny-kontrast", name: "Mocny kontrast", text: "Bardzo grube wersaliki, czarne słowo-klucz na białym zakreślaczu. Do mocnych tez i hooków.", tags: ["dynamiczny", "mocny"] },
  { slug: "neon-noc", name: "Neon noc", text: "Różowy neon z poświatą na słowach-kluczach. Do lifestyle, eventów i treści nocnych.", tags: ["dynamiczny", "lifestyle"] },
  { slug: "biznes-granat", name: "Biznes granat", text: "Rzeczowy krój, białe słowo-klucz na granatowym zakreślaczu. Do B2B, finansów i usług profesjonalnych.", tags: ["ekspercki", "biznes"] },
  { slug: "cieply-lifestyle", name: "Ciepły lifestyle", text: "Zaokrąglony krój, koralowy akcent, miękkie wejścia. Do gastronomii, rodziny i marek osobistych.", tags: ["lifestyle", "przyjazny"] },
  { slug: "news-czerwony", name: "News czerwony", text: "Wersaliki w stylu wiadomości, czerwony zakreślacz, krótkie wejścia z boku. Do newsów i komentarzy.", tags: ["dynamiczny", "news"] },
  { slug: "slowo-po-slowie", name: "Słowo po słowie, wersaliki", inspired: "Alex Hormozi", text: "Jedno–dwa słowa naraz, bardzo grube wersaliki, słowo-klucz w zielonym akcencie. Czytelne na wyciszonym telefonie.", tags: ["dynamiczny", "sprzedażowy"] },
  { slug: "luksusowy-dokument", name: "Luksusowy dokument", inspired: "Iman Gadzhi", text: "Cienkie, szeroko rozstawione wersaliki, złoty akcent, spokojne wejścia. Do edukacji premium.", tags: ["premium", "edukacyjny"] },
  { slug: "monochrom-akcent", name: "Monochrom z jednym akcentem", inspired: "Ali Abdaal", text: "Kremowy tekst, jeden ciepły akcent, mało ruchu. Do produktywności i spokojnej edukacji.", tags: ["spokojny", "edukacyjny"] },
  { slug: "napisy-na-dole", name: "Napisy nisko, nagłówek u góry", inspired: "Gary Vaynerchuk", text: "Napisy w dolnej części kadru i hook na górze przez całą rolkę. Do szybkich opinii.", tags: ["dynamiczny", "komentarz"] },
  { slug: "vlog-narracyjny", name: "Vlog narracyjny", inspired: "Ryan Trahan", text: "Zaokrąglony font, sprężyste wejścia, ciepły pomarańcz. Do vlogów i opowieści w pierwszej osobie.", tags: ["lifestyle", "dynamiczny"] },
  { slug: "hiper-retencja", name: "Hiper-retencja", inspired: "MrBeast", text: "Ogromne słowo-klucz, szybkie popy i ciasne grupy. Do rozrywki, gdzie liczy się każda sekunda.", tags: ["dynamiczny", "rozrywka"] },
  { slug: "dokument-reporterski", name: "Dokument reporterski", inspired: "Johnny Harris", text: "Szeryfowe słowa-klucze, kremowy tekst, powolny ruch. Do opowieści dokumentalnych.", tags: ["spokojny", "dokument"] },
  { slug: "explainer-papierowy", name: "Explainer papierowy", inspired: "Vox", text: "Ciemny tekst na kremowych zakreślaczach jak na wydruku. Do wyjaśniania zjawisk i danych.", tags: ["edukacyjny", "ekspercki"] },
  { slug: "karaoke", name: "Karaoke", text: "Słowa zapalają się kolorem w chwili, gdy padają. Do rolek z dużą ilością mowy.", tags: ["czytelny", "edukacyjny"] },
  { slug: "mem-gen-z", name: "Mem / Gen Z", text: "Dwa kolory zakreślaczy na przemian, glitch i chybotanie. Do humoru i trendów.", tags: ["rozrywka", "dynamiczny"] },
  { slug: "typografia-kinetyczna", name: "Typografia kinetyczna", text: "Litery wjeżdżają po kolei, duży kontrast wielkości. Do cytatów i krótkich manifestów.", tags: ["kreatywny", "dynamiczny"] },
  { slug: "kino-szerokie", name: "Kino szerokie", text: "Małe, spokojne napisy nisko w kadrze, szerokie odstępy. Do filmów klimatycznych.", tags: ["spokojny", "filmowy"] },
  { slug: "podcast-dynamiczny", name: "Podcast dynamiczny", text: "Białe napisy z mocnym słowem-kluczem, grupy po 3–4 słowa. Do fragmentów rozmów.", tags: ["rozmowa", "dynamiczny"] },
  { slug: "luksus-czarno-bialy", name: "Luksus czarno-biały", text: "Biel, czerń i dużo powietrza, wolne przejścia. Do mody, biżuterii i architektury.", tags: ["premium", "elegancki"] },
  { slug: "nieruchomosci-premium", name: "Nieruchomości premium", text: "Granat i złoto, nowoczesny bezszeryf, spokojne najazdy. Do nieruchomości i hoteli.", tags: ["premium", "biznes"] },
  { slug: "produkt-premium", name: "Produkt premium", text: "Wyraźny kontrast, czarny tekst na białym zakreślaczu, szybkie wejścia. Do prezentacji produktów.", tags: ["sprzedażowy", "produkt"] },
  { slug: "sport-akcja", name: "Sport i akcja", text: "Wąskie, wysokie wersaliki, czerwień i czerń, ostre wejścia. Do sportu i treningów.", tags: ["dynamiczny", "sport"] },
  { slug: "pastelowy-lifestyle", name: "Pastelowy lifestyle", text: "Pudrowy róż, zaokrąglone zakreślacze, miękki ruch. Do beauty, mody i codziennych vlogów.", tags: ["lifestyle", "przyjazny"] },
  { slug: "medyczny-spokojny", name: "Medyczny spokojny", text: "Turkus, dużo kontrastu, bez agresywnych efektów. Do zdrowia i usług zaufania publicznego.", tags: ["ekspercki", "spokojny"] },
  { slug: "finanse-liczby", name: "Finanse i liczby", text: "Zielony akcent dla liczb i wyników, kreska pod kluczem. Do finansów i rolek z danymi.", tags: ["ekspercki", "biznes"] },
  { slug: "kurs-online", name: "Kurs online", text: "Fiolet, czytelne grupy, spokojne podkreślenie. Do lekcji i kursów krok po kroku.", tags: ["edukacyjny", "przyjazny"] },
  { slug: "technologia", name: "Technologia", text: "Chłodny cyjan na ciemnym tle, szybkie wejścia. Do technologii, AI i aplikacji.", tags: ["ekspercki", "dynamiczny"] },
  { slug: "beauty-zloto-rozowe", name: "Beauty różowe złoto", text: "Szeryfowa kursywa, różowe złoto, łagodny ruch. Do kosmetyki i salonów.", tags: ["elegancki", "lifestyle"] },
]

/** Plik wideo w public/mf (skompresowany, bez dźwięku) + poster. Na stronę trafiają tylko pliki, które są w repo. */
export type MfVideo = { src: string; poster: string; aspect: "9/16" | "16/9" }
const vid = (name: string, aspect: MfVideo["aspect"] = "9/16"): MfVideo => ({ src: `/mf/${name}.mp4`, poster: `/mf/${name}.jpg`, aspect })

/** Pokaz stylów: prawdziwe rolki z programu (render HyperFrames). Opis i dopisek „inspirowane stylem” z MF_STYLES. */
export const MF_STYLE_REELS: { slug: string; motion: string; video: MfVideo }[] = [
  { slug: "slowo-po-slowie", motion: "słowa wskakują pojedynczo", video: vid("demo-1-slowo-po-slowie") },
  { slug: "elegancki-premium", motion: "łagodne wejście, szeryfowa kursywa", video: vid("demo-2-elegancki-premium") },
  { slug: "neon-noc", motion: "neonowa poświata na słowie-kluczu", video: vid("demo-3-neon-noc") },
]

/** Funkcje z własnym filmem lub zrzutem. Sekcja bez filmu i zrzutu nie trafia na stronę. */
export type MfShowcase = {
  id: string
  title: string
  lead: string
  points: string[]
  video?: MfVideo
  image?: { src: string; alt: string; w: number; h: number }
}

export const MF_SHOWCASE: MfShowcase[] = [
  {
    id: "kreator-marki",
    title: "Kreator marki",
    lead: "Raz ustawiasz markę, a każda kolejna rolka się jej trzyma.",
    points: [
      "Komenda /marka: Claude pyta o kolory, logo, zdjęcia i preferencje montażu, a potem robi próbną rolkę.",
      "Kolor akcentu stylu bierzemy z Twojej marki: napisy, podkreślenia i grafiki w rolce mają Twoje kolory.",
      "Ustawienia zostają w folderze marka/. Aktualizacje programu ich nie nadpisują.",
    ],
    video: vid("funkcja-marka"),
    image: { src: "/mf/poradnik/04-marka.jpg", alt: "Panel MontageFrames: ustawienia marki z kolorami, logo i zdjęciami", w: 1440, h: 900 },
  },
  {
    id: "quickcontent",
    title: "QuickContent",
    lead: "Szybka rolka z gotowego nagrania, bez ustawiania wszystkiego od zera.",
    points: [
      "Komenda /quickcontent albo ekran QuickContent w panelu.",
      "Wskazujesz nagranie, a program robi transkrypcję i układa napisy w stylu Twojej marki.",
    ],
    video: vid("funkcja-quickcontent"),
    image: { src: "/mf/poradnik/05-quickcontent.jpg", alt: "Panel MontageFrames: ekran QuickContent", w: 1440, h: 900 },
  },
]

/** Zrzuty panelu (lokalny panel w przeglądarce, komenda /panel). */
export const MF_PANEL_SHOTS = [
  { src: "/mf/panel-edytor-napisow.jpg", title: "Edytor napisów", alt: "Panel: edytor napisów z podglądem rolki i osią czasu" },
  { src: "/mf/poradnik/01-lista-rolek.jpg", title: "Lista rolek", alt: "Panel: lista rolek" },
  { src: "/mf/poradnik/10-galeria-stylow.jpg", title: "Galeria stylów", alt: "Panel: galeria stylów montażu" },
  { src: "/mf/poradnik/04-marka.jpg", title: "Marka", alt: "Panel: ustawienia marki" },
]

/** „33 style”, „25 stylów”: liczba stylów z poprawną odmianą. */
export const stylesLabel = (n = MF_STYLES.length) =>
  `${n} ${n === 1 ? "styl" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "style" : "stylów"}`

export const MF_FEATURES = [
  { title: "Nowa rolka", text: "Wrzucasz nagranie z telefonu, wybierasz styl i dostajesz gotową rolkę z napisami." },
  { title: "QuickContent", text: "Szybkie rolki z gotowych fragmentów, bez ustawiania wszystkiego od zera." },
  { title: "Film poziomy", text: "Dłuższe filmy w poziomie, np. na YouTube." },
  { title: "Motion Studio", text: "Animowane grafiki i plansze w stylu Twojej marki." },
  { title: "CutRaw", text: "Wycinanie pauz i pomyłek z surowego nagrania." },
  { title: "Opisy publikacji", text: "Propozycje opisów pod rolkę." },
  { title: "Panel w przeglądarce", text: "Poprawiasz napisy i renderujesz rolki w panelu albo piszesz to samo w Claude Code. Efekt jest ten sam." },
  { title: "Kreator marki", text: "Claude pyta o kolory, logo, zdjęcia i preferencje. Każda rolka trzyma się Twojej marki." },
  { title: "Krytyk jakości", text: "Przed renderem sprawdza kadr, płynność i czytelność. Zatrzymuje rolkę, która ma błąd." },
]

export const MF_QUALITY_CHECKS = [
  "kadr nie skacze między ujęciami",
  "zdarzenia na ekranie nie są za częste (bez oczopląsu)",
  "bez migotania i zacięć animacji",
  "płynne krzywe ruchu",
  "tekst w strefie bezpiecznej, nie pod interfejsem aplikacji",
  "równa głośność",
  "bez uciętych słów",
]

export type MfStepMedia =
  | { kind: "ui"; ui: "checkout" | "invite" | "install" }
  | { kind: "img"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; label: string }
export type MfStep = { title: string; text: string; media: MfStepMedia }

/** „Jak to działa krok po kroku” (00-PLAN 0d, pkt 10). Każdy krok: zrzut, rolka z programu albo makieta ekranu. */
export const MF_STEPS: MfStep[] = [
  { title: "Kupujesz", text: "Płacisz 238 zł BLIK-iem albo kartą na stronie Stripe. W kilka minut dostajesz mail z kluczem licencyjnym i linkiem do konta.", media: { kind: "ui", ui: "checkout" } },
  { title: "Odbierasz paczkę", text: "Na koncie podajesz login GitHub i dostajesz zaproszenie do prywatnego repozytorium z paczką i aktualizacjami. Nie masz GitHuba? Pobierasz ZIP z konta.", media: { kind: "ui", ui: "invite" } },
  { title: "Instalujesz w Claude Code", text: "Otwierasz paczkę w Claude Code i wpisujesz /start. Claude sprawdza komputer i po Twojej zgodzie instaluje narzędzia. Bez ręcznych poleceń w Terminalu, realnie 15–30 minut.", media: { kind: "ui", ui: "install" } },
  { title: "Ustawiasz markę", text: "Komenda /marka: Claude pyta o kolory, logo, zdjęcia i preferencje montażu, a na koniec robi próbną rolkę.", media: { kind: "img", src: "/mf/poradnik/04-marka.jpg", alt: "Panel MontageFrames: ustawienia marki" } },
  { title: "Wybierasz styl", text: `Komenda /styl albo galeria w panelu: ${stylesLabel()}, od spokojnych eksperckich po dynamiczne sprzedażowe. Kolor akcentu bierzemy z Twojej marki.`, media: { kind: "img", src: "/mf/poradnik/10-galeria-stylow.jpg", alt: "Panel MontageFrames: galeria stylów" } },
  { title: "Montujesz", text: "Komenda /rolka i plik z nagraniem. Program robi transkrypcję, układa napisy w wybranym stylu, a krytyk jakości sprawdza rolkę przed renderem.", media: { kind: "video", src: "/mf/demo-1-slowo-po-slowie.mp4", poster: "/mf/demo-1-slowo-po-slowie.jpg", label: "Rolka zmontowana w MontageFrames" } },
  { title: "Poprawiasz w panelu albo w rozmowie", text: "Piszesz zwykłym językiem: „przesuń napis niżej”, „podświetl słowo promocja”. Albo klikasz słowo w panelu i poprawiasz. Obie drogi zapisują ten sam projekt.", media: { kind: "img", src: "/mf/panel-edytor-napisow.jpg", alt: "Panel MontageFrames: edytor napisów z podglądem i osią czasu" } },
  { title: "Renderujesz i publikujesz", text: "Gotowa rolka to plik MP4 do publikacji. Komenda /opis podpowiada opis pod rolkę.", media: { kind: "video", src: "/mf/demo-3-neon-noc.mp4", poster: "/mf/demo-3-neon-noc.jpg", label: "Gotowa rolka w stylu Neon noc" } },
]

export type CaseStudy = { name: string; scope: string; situation: string; result: string; quote: string }

/** Wiktoria ma zgody tych firm (00-PLAN 0c, 25.11.2026). Liczby i cytaty: DO UZUPEŁNIENIA. */
export const MF_CASES: CaseStudy[] = [
  { name: "Paweł Węglarz / GlowUp Nutrition", scope: "sklep i social media", situation: TODO, result: TODO, quote: TODO },
  { name: "Vital Hormone", scope: TODO, situation: TODO, result: TODO, quote: TODO },
  { name: "Kacper Bisanz", scope: TODO, situation: TODO, result: TODO, quote: TODO },
]

/** FAQ zależne od wydania paczki na HyperFrames (patrz MF_ENGINE_OPEN_LICENSE). */
const ENGINE_FAQ = MF_ENGINE_OPEN_LICENSE
  ? [{ q: "Czy muszę kupić licencję na silnik montażu?", a: "Nie. Silnik montażu jest na otwartej licencji, nie płacisz dodatkowo za licencję. Silnik renderowania HyperFrames ma licencję Apache-2.0: z programu możesz korzystać komercyjnie, także w firmie dowolnej wielkości." }]
  : []

export const MF_FAQ: { q: string; a: string }[] = [
  ...ENGINE_FAQ,
  { q: "Czy rolki nie będą wyglądać szablonowo?", a: `Każda rolka dostaje kolory i logo Twojej marki, a każdy z ${MF_STYLES.length} stylów ma inną animację, krój i tempo. Poprawki nanosisz zwykłym językiem, aż rolka będzie Twoja.` },
  { q: "Czy zadziała na moim komputerze?", a: "Na macOS 14 i nowszym działają wszystkie funkcje (najszybciej na procesorach Apple, na Intelu wolniej). Na Windows 10/11 i Linuksie (Ubuntu) działają instalacja, transkrypcja, kontrola jakości, render i panel; pozostałe moduły są tylko na macOS. Poza macOS nie ma automatycznego wykrywania twarzy i maski osoby, więc kadr ustawiasz ręcznie. Potrzebujesz min. 15 GB wolnego miejsca i zalecane 8–16 GB RAM." },
  { q: "Ile kosztuje Claude?", a: "Potrzebujesz płatnego planu Claude Pro albo Max z Claude Code. Klucz API nie jest potrzebny: montaż i opisy mieszczą się w subskrypcji. Opłatę za plan płacisz sam(a) firmie Anthropic, ceny są na claude.com/pricing." },
  { q: "Ile trwa instalacja?", a: "Realnie 15–30 minut razem z rozmową w /start. Samo pobieranie narzędzi i modeli to kilka minut przy szybkim łączu (w teście: ok. 6 min przy 40 MB/s). Instalację prowadzi Claude Code krok po kroku." },
  { q: "Czy muszę umieć montować?", a: "Nie. Opisujesz, co chcesz, zwykłym językiem. Poradnik pokazuje, jak pisać poprawki, żeby AI dobrze je zrozumiało." },
  { q: "Na ilu komputerach mogę używać programu?", a: "Bez limitu komputerów, na potrzeby Twojej firmy. Nie wolno udostępniać ani odsprzedawać programu innym osobom." },
  { q: "Jak dostanę program?", a: "Po płatności dostajesz mail z kluczem i linkiem do konta. Podajesz login GitHub i dostajesz zaproszenie do prywatnego repozytorium z paczką i aktualizacjami. Bez GitHuba pobierzesz ZIP z konta." },
  { q: "Jak działają aktualizacje?", a: "Komenda /aktualizacja pobiera nową wersję i nie rusza Twojej marki." },
  { q: "Co, jeśli Claude zmieni zasady?", a: "Program działa przez Twoje konto Claude. Za zmiany cennika i zasad Anthropic nie odpowiadam, ale dostosowuję program w aktualizacjach, jeśli to możliwe." },
  { q: "Czy dostanę fakturę?", a: "Sprzedaję jako działalność nierejestrowana, bez VAT. Potwierdzenie zakupu i treść umowy dostajesz mailem." },
  { q: "Co, jeśli program nie zadziała?", a: "Gwarancja działania: jeśli w ciągu 14 dni nie uruchomisz programu na swoim komputerze mimo naszej pomocy, oddaję pieniądze. Napisz na wskopek.all@gmail.com, w sprawie instalacji odpowiadam do 3 dni roboczych." },
]
