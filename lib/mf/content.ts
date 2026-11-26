import { MF_ENGINE_OPEN_LICENSE } from "./config.ts"

// Treści landingu MontageFrames. „DO UZUPEŁNIENIA” = brak danych; niczego nie zmyślamy.
// Style: z katalogu paczki DKWGroup/MontageFrames-dist (catalog/gallery.html, commit 8aa2ee5).

export const TODO = "DO UZUPEŁNIENIA"

// Katalog stylów z paczki (trial-options.json v2 od Coding Buildera, wydanie 9 / 0k, 26.11.2026: 44 style, w tym 3 proste i 5 wariantów Paper).
// „Inspirowane stylem” oznacza tylko podobny rytm i typografię, bez logo, wizerunku i nagrań twórców.
export type MfStyleUse = "sprzedaz" | "premium" | "edukacja" | "lifestyle" | "rozrywka" | "rozmowa"
// tempo: z katalogu (summary.tempo); use: przeznaczenie do filtrów (z opisów stylów, do potwierdzenia przez Coding Buildera).
export type MfStyle = { slug: string; name: string; text: string; forWhom: string; motion: string; tempo: "spokojne" | "średnie" | "szybkie"; use: MfStyleUse[]; inspired?: string }

export const MF_STYLES: MfStyle[] = [
  { slug: "czysty-minimal", name: "Czysty minimal", text: "Słowa odsłaniają się maską od lewej, hak z rysowanym podkreśleniem, powolny najazd kamery. Do porad, edukacji i marek eksperckich.", forWhom: "Do porad, edukacji i marek eksperckich.", motion: "odsłanianie maską (mask reveal), wejście spod maski", tempo: "średnie", use: ["edukacja"] },
  { slug: "dynamiczny-zakreslacz", name: "Dynamiczny zakreślacz", text: "Wjazdy z boku i pop, „punch” na każdym cięciu, karty w kolorze akcentu. Do energicznych rolek sprzedażowych.", forWhom: "Do energicznych rolek sprzedażowych.", motion: "wjazd z boku (slide-in), pop-out", tempo: "szybkie", use: ["sprzedaz"] },
  { slug: "elegancki-premium", name: "Elegancki premium", text: "Słowa wyostrzają się z rozmycia, miękkie przyciemnienie na cięciach, szklane karty. Do marek premium, beauty i usług doradczych.", forWhom: "Do marek premium, beauty i usług doradczych.", motion: "wyostrzenie z rozmycia (blur-in), wejście spod maski", tempo: "spokojne", use: ["premium"] },
  { slug: "edukacyjny-wysoka-energia", name: "Edukacyjny, wysoka energia", text: "Słowa „rozciągają się” przy wejściu, hak w dwóch liniach, mocne zoomy co drugie ujęcie. Do rolek edukacyjnych z liczbami i listami.", forWhom: "Do rolek edukacyjnych z liczbami i listami.", motion: "kinetic (rozciągnięcie), pop-out, odbicie (bounce)", tempo: "szybkie", use: ["edukacja"] },
  { slug: "podcast-spokojny", name: "Podcast spokojny", text: "Spokojne wejście z dołu, hak na ciemnym pasku, bez zoomów i z dłuższym oddechem między zdaniami. Do wywiadów i podcastów.", forWhom: "Do wywiadów i podcastów.", motion: "wejście spod maski", tempo: "spokojne", use: ["rozmowa"] },
  { slug: "mocny-kontrast", name: "Mocny kontrast", text: "Słowa spadają z góry, hak jak pieczątka, ciemne karty. Do mocnych tez i kontrowersyjnych hooków.", forWhom: "Do mocnych tez i kontrowersyjnych hooków.", motion: "spadanie z góry, pop-out", tempo: "szybkie", use: ["sprzedaz"] },
  { slug: "neon-noc", name: "Neon noc", text: "Litery zalewają się neonem z krótkim glitchem, hak konturem, przejścia „whip” z rozmyciem. Do lifestyle, eventów i treści nocnych.", forWhom: "Do lifestyle, eventów i treści nocnych.", motion: "zalewanie kolorem, glitch", tempo: "średnie", use: ["lifestyle"] },
  { slug: "biznes-granat", name: "Biznes granat", text: "Rzeczowe wjazdy i maska, hak na pasku, przejścia przesunięciem w pionie. Do B2B, finansów i usług profesjonalnych.", forWhom: "Do B2B, finansów i usług profesjonalnych.", motion: "wjazd z boku (slide-in), odsłanianie maską (mask reveal)", tempo: "średnie", use: ["edukacja"] },
  { slug: "cieply-lifestyle", name: "Ciepły lifestyle", text: "Sprężyste odbicia, miękkie przejścia przesunięciem, szklane karty. Do gastronomii, rodziny i marek osobistych.", forWhom: "Do gastronomii, rodziny i marek osobistych.", motion: "odbicie (bounce), wejście spod maski", tempo: "średnie", use: ["lifestyle"] },
  { slug: "news-czerwony", name: "News czerwony", text: "Wjazdy jak w serwisie informacyjnym, hak na pasku, szybkie „whip” między ujęciami, bez zoomów. Do newsów, komentarzy i aktualności.", forWhom: "Do newsów, komentarzy i aktualności.", motion: "wjazd z boku (slide-in)", tempo: "szybkie", use: ["rozrywka"] },
  { slug: "slowo-po-slowie", name: "Słowo po słowie, wersaliki", text: "Jedno–dwa słowa naraz z mocnym popem, zoom „punch” co drugie ujęcie, bardzo szybkie cięcia.", forWhom: "Do rolek sprzedażowych i mocnych hooków, czytelnych na wyciszonym telefonie.", motion: "pop-out", tempo: "szybkie", use: ["sprzedaz"], inspired: "Alex Hormozi" },
  { slug: "luksusowy-dokument", name: "Luksusowy dokument", text: "Cienkie wersaliki odsłaniane maską, hak w dwóch liniach, przyciemnienie na cięciach, oszczędne zoomy. Do edukacji premium i marek osobistych z wysoką ceną.", forWhom: "Do edukacji premium i marek osobistych z wysoką ceną.", motion: "odsłanianie maską (mask reveal)", tempo: "średnie", use: ["premium", "edukacja"], inspired: "Iman Gadzhi" },
  { slug: "monochrom-akcent", name: "Monochrom z jednym akcentem", text: "Słowa zalewają się kolorem z konturu, jeden akcent, spokojne przejścia. Do produktywności, książek i spokojnej edukacji.", forWhom: "Do produktywności, książek i spokojnej edukacji.", motion: "zalewanie kolorem", tempo: "średnie", use: ["edukacja"], inspired: "Ali Abdaal" },
  { slug: "napisy-na-dole", name: "Napisy nisko, nagłówek u góry", text: "Napisy nisko, hak na pasku u góry, twarde cięcia bez efektów. Do szybkich opinii i komentarzy.", forWhom: "Do szybkich opinii i komentarzy.", motion: "wjazd z boku (slide-in), wejście spod maski", tempo: "szybkie", use: ["rozrywka"], inspired: "Gary Vaynerchuk" },
  { slug: "vlog-narracyjny", name: "Vlog narracyjny", text: "Chybotliwe, zabawne wejścia, „whip” i mocne zoomy jak w vlogu. Do vlogów, wyzwań i opowieści w pierwszej osobie.", forWhom: "Do vlogów, wyzwań i opowieści w pierwszej osobie.", motion: "chybotanie, odbicie (bounce)", tempo: "szybkie", use: ["lifestyle"], inspired: "Ryan Trahan" },
  { slug: "hiper-retencja", name: "Hiper-retencja", text: "Ogromne słowo-klucz, popy i litery po kolei, punch na każdym cięciu. Do wyzwań i rozrywki, gdzie liczy się każda sekunda uwagi.", forWhom: "Do wyzwań i rozrywki, gdzie liczy się każda sekunda uwagi.", motion: "pop-out, spadanie z góry, litera po literze", tempo: "szybkie", use: ["rozrywka"], inspired: "MrBeast" },
  { slug: "dokument-reporterski", name: "Dokument reporterski", text: "Napisy pisane jak na maszynie, hak wystukiwany literami, powolne najazdy. Do opowieści dokumentalnych, historii i reportażu.", forWhom: "Do opowieści dokumentalnych, historii i reportażu.", motion: "maszyna do pisania (typewriter)", tempo: "spokojne", use: ["edukacja"], inspired: "Johnny Harris" },
  { slug: "explainer-papierowy", name: "Explainer papierowy", text: "Wydrukowane zakreślacze odsłaniane maską, przejścia „poklatkowe” jak w ręcznej animacji. Do wyjaśniania zjawisk, danych i newsów.", forWhom: "Do wyjaśniania zjawisk, danych i newsów.", motion: "odsłanianie maską (mask reveal), wjazd z boku (slide-in)", tempo: "średnie", use: ["edukacja"], inspired: "Vox" },
  { slug: "karaoke", name: "Karaoke", text: "Słowa zapalają się kolorem dokładnie w chwili, gdy padają; hak konturem. Do rolek z dużą ilością mowy i nauki języka.", forWhom: "Do rolek z dużą ilością mowy i nauki języka.", motion: "zalewanie kolorem", tempo: "średnie", use: ["edukacja"] },
  { slug: "mem-gen-z", name: "Mem / Gen Z", text: "Glitch, chybotanie i pop, pieczątka na haku, szybkie „whip”. Do humoru, trendów i luźnych marek.", forWhom: "Do humoru, trendów i luźnych marek.", motion: "glitch, chybotanie, pop-out", tempo: "szybkie", use: ["rozrywka"] },
  { slug: "typografia-kinetyczna", name: "Typografia kinetyczna", text: "Słowa rozciągają się i składają z liter, hak w dwóch liniach. Do cytatów, motywacji i krótkich manifestów.", forWhom: "Do cytatów, motywacji i krótkich manifestów.", motion: "kinetic (rozciągnięcie), litera po literze", tempo: "średnie", use: ["rozrywka"] },
  { slug: "kino-szerokie", name: "Kino szerokie", text: "Małe napisy nisko, hak konturem, przyciemnienie na cięciach jak w kinie. Do filmów klimatycznych i opowieści.", forWhom: "Do filmów klimatycznych i opowieści.", motion: "wejście spod maski", tempo: "spokojne", use: ["rozrywka"] },
  { slug: "podcast-dynamiczny", name: "Podcast dynamiczny", text: "Grupy po 3–4 słowa, hak jako karta-pytanie, przejścia przesunięciem. Do fragmentów podcastów i rozmów.", forWhom: "Do fragmentów podcastów i rozmów.", motion: "wjazd z boku (slide-in), pop-out", tempo: "szybkie", use: ["rozmowa"] },
  { slug: "luksus-czarno-bialy", name: "Luksus czarno-biały", text: "Cienkie litery wyłaniające się z rozmycia, kontur na haku, dużo powietrza. Do mody, biżuterii i architektury.", forWhom: "Do mody, biżuterii i architektury.", motion: "wyostrzenie z rozmycia (blur-in)", tempo: "spokojne", use: ["premium"] },
  { slug: "nieruchomosci-premium", name: "Nieruchomości premium", text: "Spokojne wejścia i maska, powolne najazdy na wnętrza. Do ofert nieruchomości, hoteli i inwestycji.", forWhom: "Do ofert nieruchomości, hoteli i inwestycji.", motion: "wejście spod maski, odsłanianie maską (mask reveal)", tempo: "spokojne", use: ["premium", "edukacja"] },
  { slug: "produkt-premium", name: "Produkt premium", text: "Słowa wyostrzają się i wyskakują, pieczątka na haku, najazd na produkt. Do prezentacji produktów i sklepów.", forWhom: "Do prezentacji produktów i sklepów.", motion: "wyostrzenie z rozmycia (blur-in), pop-out", tempo: "średnie", use: ["sprzedaz"] },
  { slug: "sport-akcja", name: "Sport i akcja", text: "Słowa spadają i rozciągają się, „whip” i mocne zoomy. Do sportu, treningów i dynamicznych relacji.", forWhom: "Do sportu, treningów i dynamicznych relacji.", motion: "spadanie z góry, kinetic (rozciągnięcie)", tempo: "szybkie", use: ["lifestyle"] },
  { slug: "pastelowy-lifestyle", name: "Pastelowy lifestyle", text: "Miękkie odbicia i zalewanie kolorem, hak na pastelowym pasku papieru, miękkie przyciemnienia i powolne najazdy. Do beauty, mody, rodziny i codziennych vlogów.", forWhom: "Do beauty, mody, rodziny i codziennych vlogów.", motion: "odbicie (bounce), zalewanie kolorem", tempo: "średnie", use: ["lifestyle"] },
  { slug: "medyczny-spokojny", name: "Medyczny spokojny", text: "Spokojne wejście, hak jako pytanie pacjenta, bez efektów i zoomów. Do zdrowia, medycyny i usług zaufania publicznego.", forWhom: "Do zdrowia, medycyny i usług zaufania publicznego.", motion: "wejście spod maski", tempo: "spokojne", use: ["edukacja"] },
  { slug: "finanse-liczby", name: "Finanse i liczby", text: "Liczby i słowa wystukiwane jak na terminalu, ciemne karty z danymi. Do finansów, inwestycji i rolek z danymi.", forWhom: "Do finansów, inwestycji i rolek z danymi.", motion: "maszyna do pisania (typewriter), wjazd z boku (slide-in)", tempo: "średnie", use: ["edukacja"] },
  { slug: "kurs-online", name: "Kurs online", text: "Litery wjeżdżają po kolei, hak z podkreśleniem jak w notatkach. Do lekcji, kursów i treści edukacyjnych krok po kroku.", forWhom: "Do lekcji, kursów i treści edukacyjnych krok po kroku.", motion: "litera po literze, wejście spod maski", tempo: "średnie", use: ["edukacja", "lifestyle"] },
  { slug: "technologia", name: "Technologia", text: "Glitch i maszyna do pisania, hak wystukiwany jak w terminalu, przejścia „whip”. Do technologii, AI i aplikacji.", forWhom: "Do technologii, AI i aplikacji.", motion: "glitch, maszyna do pisania (typewriter)", tempo: "szybkie", use: ["edukacja"] },
  { slug: "beauty-zloto-rozowe", name: "Beauty różowe złoto", text: "Słowa zalewają się różowym złotem, hak z rysowanym podkreśleniem, miękkie przesunięcia i najazdy. Do kosmetyki, salonów i marek osobistych kobiet.", forWhom: "Do kosmetyki, salonów i marek osobistych kobiet.", motion: "zalewanie kolorem, wejście spod maski", tempo: "spokojne", use: ["premium", "lifestyle"] },
  { slug: "papierowy-kolaz", name: "Paper: kolaż", text: "Słowa na darto wyrwanych skrawkach kremowego papieru z białym rdzeniem krawędzi, wklejane poklatkowo (12 kl./s) z lekkim drżeniem; słowo-klucz na musztardowej kartce z taśmą. Przejście: rozdarcie kartki. Do edukacji, opowieści i marek rzemieślniczych.", forWhom: "Do edukacji, opowieści i marek rzemieślniczych.", motion: "wklejanie skrawków poklatkowo (12 kl./s) z lekkim drżeniem", tempo: "średnie", use: ["edukacja", "lifestyle"] },
  { slug: "pytania-i-odpowiedzi", name: "Pytania i odpowiedzi", text: "Hak jako karta z pytaniem, odpowiedź prostymi napisami, stały kadr bez zoomów. Do biznesu w formie Q&A i odpowiedzi na komentarze.", forWhom: "Do biznesu w formie Q&A i odpowiedzi na komentarze.", motion: "wjazd z boku (slide-in), wejście spod maski", tempo: "średnie", use: ["edukacja"], inspired: "Codie Sanchez" },
  { slug: "adnotacje-odreczne", name: "Adnotacje odręczne", text: "Słowa-klucze pismem odręcznym odsłaniane maską, hak z podkreśleniem jak flamastrem, spokojne przyciemnienia na cięciach. Do poradników i produktywności.", forWhom: "Do poradników i produktywności.", motion: "odsłanianie maską (mask reveal), zalewanie kolorem", tempo: "spokojne", use: ["edukacja"], inspired: "Ali Abdaal (adnotacje)" },
  { slug: "mocna-typografia", name: "Mocna typografia", text: "Bardzo gruby, wąski krój na całej szerokości kadru, słowa rozciągają się przy wejściu, hak w dwóch liniach. Do krótkich, mocnych tez biznesowych.", forWhom: "Do krótkich, mocnych tez biznesowych.", motion: "kinetic (rozciągnięcie), spadanie z góry", tempo: "szybkie", use: ["sprzedaz"], inspired: "Leila Hormozi" },
  { slug: "proste-1-slowo", name: "Proste: 1 słowo", text: "Jedno słowo naraz, duże i wyraźne, z krótkim pop-outem. Bez podkreśleń i ozdobników. Animację zmienisz w „Edytuj styl” (brak, pop, fade, wjazd w górę, maszyna do pisania).", forWhom: "Do szybkich, dynamicznych rolek, w których liczy się każde słowo.", motion: "po 1 słowie, krótki pop-out (do zmiany: brak, fade, wjazd w górę, maszyna do pisania)", tempo: "szybkie", use: ["edukacja", "sprzedaz", "lifestyle"] },
  { slug: "proste-2-slowa", name: "Proste: 2 słowa", text: "Po dwa słowa naraz, bez animacji: słowo pojawia się w chwili, gdy pada. Spokojnie i czytelnie, bez ozdobników. Animację zmienisz w „Edytuj styl”.", forWhom: "Do spokojnych rolek, gdy napisy mają być czytelne i nie odciągać uwagi.", motion: "po 2 słowa, bez animacji (słowo pojawia się, gdy pada)", tempo: "średnie", use: ["edukacja"] },
  { slug: "proste-3-slowa", name: "Proste: 3 słowa", text: "Po trzy słowa naraz z prostym wjazdem w górę. Mocny, miękki cień pod literami, czytelny na jasnym i ciemnym nagraniu. Animację zmienisz w „Edytuj styl”.", forWhom: "Do porad i rozmów, gdy widz ma czytać całe frazy.", motion: "po 3 słowa, prosty wjazd w górę", tempo: "średnie", use: ["edukacja"] },
  { slug: "paper-zeszyt", name: "Paper: zeszyt", text: "Słowa jak zapisane w zeszycie w linie z czerwonym marginesem: tekst odsłania się jak pisany ręcznie, słowo-klucz na żółtym zakreślaczu z taśmą washi. Przejście: przewrócenie kartki. Do porad, nauki i notatek.", forWhom: "Do porad, nauki i notatek.", motion: "tekst odsłania się jak pisany w zeszycie", tempo: "średnie", use: ["edukacja"] },
  { slug: "paper-wycinanki", name: "Paper: wycinanki", text: "Nasycone kolory i gładko cięte kształty jak w ludowych wycinankach: słowa spadają z góry z dosiadem, słowo-klucz na czerwonym wycinku. Bez taśmy. Przejście: przesunięcie warstw papieru. Do energicznych, radosnych rolek.", forWhom: "Do energicznych, radosnych rolek.", motion: "słowa spadają z góry z dosiadem (12 kl./s)", tempo: "szybkie", use: ["lifestyle", "edukacja"] },
  { slug: "paper-gazeta", name: "Paper: gazeta", text: "List z wycinków gazety: każde słowo w innym kroju i na innym skrawku (nigdy dwa takie same obok siebie), słowo-klucz białe na czerwonym. Słowa wskakują twardo, bez płynności. Przejście: zmięta kartka. Do newsów, kontrowersji i ciekawostek.", forWhom: "Do newsów, kontrowersji i ciekawostek.", motion: "list z wycinków gazety, słowa wskakują twardo", tempo: "szybkie", use: ["edukacja"] },
  { slug: "paper-karton", name: "Paper: karton", text: "Etykiety na tekturze falistej: tekst wybijany jak na maszynie do pisania, słowo-klucz odbite czerwonym stemplem, brązowa taśma pakowa. Przejście: klapa kartonu. Do e-commerce, wysyłek, rzemiosła i „unboxingu”.", forWhom: "Do e-commerce, wysyłek, rzemiosła i „unboxingu”.", motion: "maszyna do pisania i stempel na etykietach z kartonu", tempo: "średnie", use: ["sprzedaz", "lifestyle"] },
]

/** Plik wideo w public/mf (skompresowany, bez dźwięku) + poster. Na stronę trafiają tylko pliki, które są w repo. */
export type MfVideo = { src: string; poster: string; aspect: "9/16" | "16/9" }
const vid = (name: string, aspect: MfVideo["aspect"] = "9/16"): MfVideo => ({ src: `/mf/${name}.mp4`, poster: `/mf/${name}.jpg`, aspect })

/** Funkcje z własnym filmem lub zrzutem. Sekcja bez filmu i zrzutu nie trafia na stronę. */
export type MfShowcase = {
  id: string
  title: string
  lead: string
  points: string[]
  video?: MfVideo
  image?: { src: string; alt: string; w: number; h: number }
  /** Nagranie obsługi panelu (0f, Coding Builder): zastępuje zrzut. */
  clip?: MfClip
}

/** Klip z panelu w dwóch kadrach: 16:9 (komputer) i 4:5 (telefon), public/mf/apple/. */
export type MfClip = { name: string; label: string }
export const clip = (name: string, label: string): MfClip => ({ name, label })

// Teksty: „co naprawdę robi” z landing-assets/LISTA.md (Coding Builder, wydanie z 26.11.2026). Filmy: render z programu, bez twarzy i klientów.
const fn = (name: string, aspect: MfVideo["aspect"] = "9/16"): MfVideo =>
  aspect === "16/9" ? { src: `/mf/funkcje/${name}-poziomo.mp4`, poster: `/mf/funkcje/${name}-poziomo.jpg`, aspect } : { src: `/mf/funkcje/${name}.mp4`, poster: `/mf/funkcje/${name}.jpg`, aspect }
const shot = (file: string, alt: string) => ({ src: `/mf/panel-0l/${file}.jpg`, alt, w: 1440, h: 900 })

export const MF_SHOWCASE: MfShowcase[] = [
  {
    id: "kreator-marki",
    title: "Kreator marki",
    lead: "Raz zapisujesz markę, a każda kolejna rolka używa jej automatycznie.",
    points: [
      "Kolory, logo, fonty, styl montażu i preferencje: w Claude Code komendą /marka albo w panelu w zakładce „Twoja marka”.",
      "Ustawienia zostają w folderze marka/. Aktualizacje programu ich nie nadpisują.",
    ],
    video: fn("kreator-marki"),
    image: { src: "/mf/panel-0l/11-twoja-marka.jpg", alt: "Panel MontageFrames: Twoja marka, wybór lub dodanie marki i trzy kroki kreatora", w: 1440, h: 900 },
  },
  {
    id: "style-animacje",
    title: "Style to nie tylko kolor",
    lead: "Każdy styl ma własną animację napisów, hak, przejścia na cięciach, zoomy i tempo cięć.",
    points: [
      "Pop-out, glitch, maszyna do pisania, odsłanianie maską, poklatkowy papierowy kolaż i inne.",
      "Automatyczny test pilnuje, żeby żadne dwa style nie były do siebie zbyt podobne.",
    ],
    video: fn("style-animacje"),
  },
  {
    id: "poprawki",
    title: "Poprawki i „jest git”",
    lead: "Poprawiasz w panelu albo w rozmowie z Claude Code, a zatwierdzony styl zostaje zapamiętany.",
    points: [
      "W panelu klikasz słowo i poprawiasz napis albo prosisz o zmianę w Claude Code.",
      "Gdy powiesz „jest git”, styl zostaje zapamiętany dla marki na stałe i wraca w kolejnych montażach.",
    ],
    video: fn("panel-poprawki"),
    clip: clip("jest-git", "Panel MontageFrames: kliknięcie „Jest git: zatwierdź styl” i zapis stylu dla marki"),
  },
  {
    id: "youtube",
    title: "Film poziomy na YouTube",
    lead: "Ten sam styl działa w montażu poziomym 16:9.",
    points: [
      "Napisy nisko, karty z boku, a krytyk jakości pilnuje skoków obrazu i zasłaniania.",
      "Na filmie: style Mocna typografia i Paper: kolaż.",
    ],
    video: fn("youtube-16x9", "16/9"),
    clip: clip("youtube-16x9", "Render 16:9 w stylu Mocna typografia: hak, napisy nisko, karta licznika z boku"),
  },
  {
    id: "quickcontent",
    title: "QuickContent",
    lead: "Z długiego nagrania program proponuje fragmenty na rolki.",
    points: [
      "Plik albo link YouTube: propozycje fragmentów z początkiem, rozwinięciem i puentą.",
      "Montuje tylko te, które zaznaczysz.",
    ],
    video: fn("quickcontent"),
    clip: clip("quickcontent", "Panel MontageFrames: QuickContent, propozycje fragmentów i zaznaczenie dwóch do montażu"),
  },
  {
    id: "motion-studio",
    title: "Motion Studio",
    lead: "Krótka animacja z Twojego tekstu: intro, plansza albo CTA.",
    points: ["Formaty 9:16, 1:1 albo 16:9.", "Najpierw storyboard i podgląd, potem render."],
    video: fn("motion-studio"),
    image: shot("10-motion-studio", "Panel MontageFrames: Motion Studio, opis filmu i kroki storyboard, podgląd, render"),
  },
  {
    id: "cutraw",
    title: "CutRaw dla podcastów",
    lead: "Surowy podcast z 1–4 kamer bez ręcznego cięcia.",
    points: [
      "Synchronizacja po dźwięku, wycięte cisze i „yyy”.",
      "Eksport XML do Premiere Pro. Oryginały zostają nietknięte.",
    ],
    video: fn("cutraw", "16/9"),
    image: shot("09-cutraw", "Panel MontageFrames: CutRaw, nowy projekt z nagrań kamer i mikrofonów"),
  },
  {
    id: "aktualizacje",
    title: "Aktualizacje jednym klikiem",
    lead: "Program, silnik i skille aktualizujesz w panelu albo komendą /aktualizacja.",
    points: ["Przed aktualizacją robi się kopia zapasowa.", "Zawsze możesz wrócić do wersji zalecanej."],
    video: fn("aktualizacje"),
    image: shot("12-ustawienia", "Panel MontageFrames: ustawienia z wyglądem, kontem Claude i aktualizacjami"),
  },
]

/** Zrzuty panelu (lokalny panel w przeglądarce, komenda /panel). */
export const MF_PANEL_SHOTS = [
  { src: "/mf/panel-0l/03-edytor-slowo.jpg", title: "Edytor napisów", alt: "Panel: edytor rolki, wybrane słowo z opcjami wyróżnienia, lista słów i oś czasu" },
  { src: "/mf/panel-0l/05-edytuj-styl.jpg", title: "Edytuj styl", alt: "Panel: Edytuj styl, ile słów naraz, animacja słów i intensywność ruchu" },
  { src: "/mf/panel-0l/06-gotowe-filmy.jpg", title: "Render i gotowe filmy", alt: "Panel: gotowe filmy i opis do publikacji obok podglądu rolki" },
  { src: "/mf/panel-0l/07-quickcontent.jpg", title: "QuickContent", alt: "Panel: QuickContent, zapisane projekty z propozycjami fragmentów z długiego nagrania" },
]

/** „33 style”, „37 stylów”: liczba stylów z poprawną odmianą. */
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
  | { kind: "clip"; clip: MfClip }
  | { kind: "img"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string; label: string }
export type MfStep = { title: string; text: string; media: MfStepMedia }

/** „Jak to działa krok po kroku” (00-PLAN 0d, pkt 10). Każdy krok: zrzut, rolka z programu albo makieta ekranu. */
export const MF_STEPS: MfStep[] = [
  { title: "Kupujesz", text: "Płacisz 238 zł BLIK-iem albo kartą na stronie Stripe. W kilka minut dostajesz mail z kluczem licencyjnym i linkiem do konta.", media: { kind: "ui", ui: "checkout" } },
  { title: "Odbierasz paczkę", text: "Na koncie podajesz login GitHub i dostajesz zaproszenie do prywatnego repozytorium z paczką i aktualizacjami. Nie masz GitHuba? Pobierasz ZIP z konta.", media: { kind: "ui", ui: "invite" } },
  { title: "Instalujesz w Claude Code", text: "Otwierasz paczkę w Claude Code i wpisujesz /start. Claude sprawdza komputer i po Twojej zgodzie instaluje narzędzia. Bez ręcznych poleceń w Terminalu, realnie 15–30 minut.", media: { kind: "ui", ui: "install" } },
  { title: "Ustawiasz markę", text: "Komenda /marka: Claude pyta o kolory, logo, zdjęcia i preferencje montażu, a na koniec robi próbną rolkę.", media: { kind: "clip", clip: clip("kreator-marki", "Panel MontageFrames: zmiana koloru akcentu marki i podgląd stylu w ruchu") } },
  { title: "Wybierasz styl", text: `Komenda /styl albo galeria w panelu: ${stylesLabel()}, od spokojnych eksperckich po dynamiczne sprzedażowe. Kolor akcentu bierzemy z Twojej marki.`, media: { kind: "clip", clip: clip("wybor-stylu", "Panel MontageFrames: przełączanie stylów montażu, opis animacji zmienia się od razu") } },
  { title: "Montujesz", text: "Komenda /rolka i plik z nagraniem. Program robi transkrypcję, układa napisy w wybranym stylu, a krytyk jakości sprawdza rolkę przed renderem.", media: { kind: "video", src: "/mf/style/dynamiczny-zakreslacz.mp4", poster: "/mf/style/dynamiczny-zakreslacz.jpg", label: "Rolka zmontowana w MontageFrames, styl Dynamiczny zakreślacz" } },
  { title: "Poprawiasz w panelu albo w rozmowie", text: "Piszesz zwykłym językiem: „przesuń napis niżej”, „podświetl słowo promocja”. Albo klikasz słowo w panelu i poprawiasz. Obie drogi zapisują ten sam projekt.", media: { kind: "clip", clip: clip("edycja-napisu", "Panel MontageFrames: poprawka literówki w napisie i podgląd poprawionej rolki") } },
  { title: "Renderujesz i publikujesz", text: "Gotowa rolka to plik MP4 do publikacji. Komenda /opis podpowiada opis pod rolkę.", media: { kind: "clip", clip: clip("render", "Panel MontageFrames: render rolki i gotowy plik w wersjach (środek przyspieszony)") } },
]

export type CaseStudy = { name: string; scope: string; situation: string; result: string; quote: string }

/** Wiktoria ma zgody tych firm (00-PLAN 0c, 25.11.2026). Liczby i cytaty: DO UZUPEŁNIENIA. */
export const MF_CASES: CaseStudy[] = [
  { name: "Paweł Węglarz / GlowUp Nutrition", scope: "sklep i social media", situation: TODO, result: TODO, quote: TODO },
  { name: "Vital Hormone", scope: TODO, situation: TODO, result: TODO, quote: TODO },
  { name: "Kacper Bisanz", scope: TODO, situation: TODO, result: TODO, quote: TODO },
]

/** Pas „Z MontageFrames montują już” (zlecenie Wiktorii, 26.11): loga z oficjalnych stron firm, tylko kolor i rozmiar zmienione na stronie.
 *  Pliki w public/mf/klienci/, źródła: montageframes-produkt/sklep-landing/pokaz/runda2/loga/ZRODLA.md.
 *  ratio = szerokość / wysokość pliku; wysokość na stronie liczymy tak, żeby loga miały podobną powierzchnię (równa waga optyczna). */
export type MfClient = { name: string; logo?: { src: string; ratio: number; optical?: number }; site?: string }
export const MF_CLIENTS: MfClient[] = [
  { name: "GlowUp Nutrition (Paweł Węglarz)", logo: { src: "/mf/klienci/glowup-nutrition.webp", ratio: 581 / 160, optical: 0.88 }, site: "https://nutriglowup.pl" },
  { name: "Vital Hormone, centrum medyczne", logo: { src: "/mf/klienci/vital-hormone.webp", ratio: 692 / 160 }, site: "https://vital-hormone.pl" },
  { name: "DKW Group", logo: { src: "/mf/klienci/dkw-group.webp", ratio: 388 / 160 }, site: "https://dkwgroup.net/pl" },
  { name: "WebDKW", logo: { src: "/mf/klienci/webdkw.svg", ratio: 159.15 / 27.3, optical: 0.85 }, site: "https://webdkw.net" },
  { name: "PodcastKatowice.pl", logo: { src: "/mf/klienci/podcast-katowice.webp", ratio: 933 / 160 }, site: "https://podcastkatowice.pl" },
  // Bez strony z logo: znak tekstowy w tym samym stylu.
  { name: "Kacper Bisanz" },
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
