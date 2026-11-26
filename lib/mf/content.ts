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

export const MF_STEPS = [
  { title: "Otwierasz paczkę w Claude Code i wpisujesz /start", text: "Claude sprawdza komputer i po Twojej zgodzie instaluje potrzebne narzędzia. Bez ręcznych poleceń w Terminalu." },
  { title: "Ustawiasz markę i styl", text: "Komendą /marka podajesz kolory, logo i zdjęcia. Komendą /styl wybierasz jeden z 33 stylów." },
  { title: "Wrzucasz nagranie i piszesz poprawki zwykłym językiem", text: "Komenda /rolka montuje film. Poprawki piszesz w rozmowie albo nanosisz w panelu." },
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
  ? [{ q: "Czy muszę kupić licencję na silnik montażu?", a: "Silnik montażu jest na otwartej licencji, nie płacisz dodatkowo za licencję." }]
  : []

export const MF_FAQ: { q: string; a: string }[] = [
  ...ENGINE_FAQ,
  { q: "Czy zadziała na moim komputerze?", a: "Na macOS 14 i nowszym działają wszystkie funkcje (najszybciej na procesorach Apple, na Intelu wolniej). Na Windows 10/11 i Linuksie (Ubuntu) działają instalacja, transkrypcja, kontrola jakości, render i panel; pozostałe moduły są tylko na macOS. Poza macOS nie ma automatycznego wykrywania twarzy i maski osoby, więc kadr ustawiasz ręcznie. Potrzebujesz min. 15 GB wolnego miejsca i zalecane 8–16 GB RAM." },
  { q: "Ile kosztuje Claude?", a: "Potrzebujesz płatnego planu Claude Pro albo Max z Claude Code. Klucz API nie jest potrzebny: montaż i opisy mieszczą się w subskrypcji. Opłatę za plan płacisz sam(a) firmie Anthropic, ceny są na claude.com/pricing." },
  { q: "Ile trwa instalacja?", a: "Realnie 15–30 minut razem z rozmową w /start. Samo pobieranie narzędzi i modeli to kilka minut przy szybkim łączu (w teście: ok. 6 min przy 40 MB/s). Instalację prowadzi Claude Code krok po kroku." },
  { q: "Czy muszę umieć montować?", a: "Nie. Opisujesz, co chcesz, zwykłym językiem. Poradnik pokazuje, jak pisać poprawki, żeby AI dobrze je zrozumiało." },
  { q: "Na ilu komputerach mogę używać programu?", a: "Bez limitu komputerów, na potrzeby Twojej firmy. Nie wolno udostępniać ani odsprzedawać programu innym osobom." },
  { q: "Jak dostanę program?", a: "Po płatności dostajesz mail z kluczem i linkiem do konta. Podajesz login GitHub i dostajesz zaproszenie do prywatnego repozytorium z paczką i aktualizacjami. Bez GitHuba pobierzesz ZIP z konta." },
  { q: "Jak działają aktualizacje?", a: "Komenda /aktualizacja pobiera nową wersję i nie rusza Twojej marki. Okres aktualizacji w cenie: DO UZUPEŁNIENIA." },
  { q: "Co, jeśli Claude zmieni zasady?", a: "Program działa przez Twoje konto Claude. Za zmiany cennika i zasad Anthropic nie odpowiadam, ale dostosowuję program w aktualizacjach, jeśli to możliwe." },
  { q: "Czy dostanę fakturę?", a: "Sprzedaję jako działalność nierejestrowana, bez VAT. Potwierdzenie zakupu dostajesz mailem. Sposób dokumentowania sprzedaży dla firm: DO UZUPEŁNIENIA." },
  { q: "Co, jeśli program nie zadziała?", a: "Obowiązuje gwarancja działania opisana wyżej. Napisz na wskopek.all@gmail.com, odpowiadam w sprawie instalacji do 3 dni roboczych." },
]
