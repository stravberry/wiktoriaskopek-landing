// Poradnik MontageFrames (strony za logowaniem). Komendy wg Coding Buildera (25.11.2026), mogą się jeszcze zmienić.
// Zrzuty panelu: Coding Builder, czysta paczka bez klientów (26.11). Brakujące zrzuty i nagrania: lista w DOWOD-PRODUKCJA.md.

export type Block = { p: string } | { code: string } | { list: string[] } | { img: string; alt: string } | { todo: string }
export type Chapter = { slug: string; title: string; lead: string; blocks: Block[] }

export const CHAPTERS: Chapter[] = [
  {
    slug: "zanim-zaczniesz",
    title: "1. Zanim zaczniesz",
    lead: "Sprawdź trzy rzeczy, zanim otworzysz paczkę.",
    blocks: [
      { list: [
        "Płatny plan Claude Pro albo Max i zainstalowany Claude Code (claude.com/claude-code).",
        "macOS 14 lub nowszy: wszystkie funkcje. Windows 10/11 i Linux (Ubuntu): instalacja, transkrypcja, kontrola jakości, render i panel.",
        "Min. 15 GB wolnego miejsca (instalacja zajmuje ok. 7,5 GB) i stabilny internet. Zalecane 8–16 GB RAM.",
        "Darmowe konto GitHub, jeśli chcesz dostawać aktualizacje jedną komendą.",
      ] },
      { p: "Panel w przeglądarce i rozmowa w Claude Code korzystają z tego samego planu Claude, więc oba zużywają jego limit." },
    ],
  },
  {
    slug: "instalacja",
    title: "2. Odbierz paczkę i zainstaluj",
    lead: "Instalację prowadzi Claude Code. Ty tylko potwierdzasz kolejne kroki.",
    blocks: [
      { p: "Przez GitHub (zalecane): na koncie podaj swój login GitHub i zaakceptuj zaproszenie do repozytorium DKWGroup/MontageFrames-dist. Potem w Terminalu:" },
      { code: "git clone https://github.com/DKWGroup/MontageFrames-dist.git MontageFrames\ncd MontageFrames\nclaude" },
      { p: "Bez GitHuba: pobierz ZIP z konta, rozpakuj, otwórz folder w Terminalu i wpisz claude." },
      { p: "W Claude Code wpisz /start. Claude sprawdzi komputer i po Twojej zgodzie zainstaluje brakujące narzędzia. Stan instalacji w każdej chwili sprawdzisz komendą /stan." },
    ],
  },
  {
    slug: "marka",
    title: "3. Twoja marka",
    lead: "Raz ustawiasz kolory, logo i zdjęcia. Każda rolka trzyma się tej marki.",
    blocks: [
      { p: "Wpisz /marka. Claude zapyta o kolory, logo, zdjęcia i preferencje montażu, a potem zrobi próbną rolkę." },
      { p: "Ustawienia marki zostają w folderze marka/. Aktualizacje go nie nadpisują." },
      { img: "/mf/poradnik/04-marka.jpg", alt: "Panel: ustawienia marki (kolory, logo, zdjęcia)" },
    ],
  },
  {
    slug: "style",
    title: "4. Style montażu",
    lead: "33 style z opisami: od spokojnych eksperckich po dynamiczne sprzedażowe.",
    blocks: [
      { p: "Wpisz /styl, żeby zobaczyć katalog i wybrać styl. Ten sam wybór zrobisz w panelu. Kolor akcentu stylu bierzemy z Twojej marki." },
      { p: "Podgląd wszystkich stylów jest też w pliku catalog/gallery.html w paczce." },
      { img: "/mf/poradnik/10-galeria-stylow.jpg", alt: "Panel: galeria stylów" },
    ],
  },
  {
    slug: "pierwsza-rolka",
    title: "5. Pierwsza rolka",
    lead: "Wrzucasz nagranie, Claude montuje, Ty oglądasz.",
    blocks: [
      { p: "Wpisz /rolka i wskaż plik z nagraniem. Claude zrobi transkrypcję, ułoży napisy w wybranym stylu i przygotuje rolkę do renderu." },
      { p: "Do szybkich rolek z gotowych fragmentów użyj /quickcontent." },
      { img: "/mf/poradnik/05-quickcontent.jpg", alt: "Panel: QuickContent" },
    ],
  },
  {
    slug: "poprawki",
    title: "6. Poprawki i rozmowa z AI",
    lead: "Piszesz zwykłym językiem. Im konkretniej, tym szybciej.",
    blocks: [
      { p: "Wpisz /poprawki albo po prostu opisz zmianę w rozmowie. Dobre poprawki mówią, co, gdzie i jak:" },
      { list: [
        "„W 0:12 napis zasłania twarz, przesuń go niżej.”",
        "„Słowo »promocja« podświetl kolorem marki.”",
        "„Wytnij pauzę między 0:20 a 0:23.”",
        "„Rolka ma być spokojniejsza: mniej zoomów.”",
      ] },
      { p: "Unikaj ogólników typu „zrób lepiej”. Jedna poprawka na zdanie. Możesz też poprawiać napisy w panelu: efekt jest ten sam, bo obie drogi zapisują jeden wspólny stan projektu." },
    ],
  },
  {
    slug: "krytyk-jakosci",
    title: "7. Krytyk jakości",
    lead: "Zanim rolka się wyrenderuje, krytyk sprawdza ją pod kątem typowych błędów.",
    blocks: [
      { list: ["skaczący kadr", "za częste zdarzenia na ekranie", "migotanie i zacięcia animacji", "tekst poza strefą bezpieczną", "nierówna głośność", "ucięte słowa"] },
      { p: "Ręcznie uruchomisz go komendą /krytyk. Gdy coś znajdzie, opisuje problem i proponuje poprawkę." },
    ],
  },
  {
    slug: "panel",
    title: "8. Panel w przeglądarce",
    lead: "Te same rzeczy co w rozmowie, tylko w okienkach.",
    blocks: [
      { p: "Wpisz /panel, żeby otworzyć panel. Poprawisz w nim napisy, zmienisz styl i wyrenderujesz rolkę." },
      { img: "/mf/poradnik/01-lista-rolek.jpg", alt: "Panel: lista rolek" },
      { img: "/mf/panel-edytor-napisow.jpg", alt: "Panel: edytor napisów z podglądem i osią czasu" },
    ],
  },
  {
    slug: "inne-moduly",
    title: "9. Pozostałe moduły",
    lead: "Film poziomy, Motion Studio, CutRaw i opisy publikacji.",
    blocks: [
      { list: [
        "/film-poziomy: dłuższe filmy w poziomie.",
        "/motion: animowane grafiki i plansze (Motion Studio).",
        "/cutraw: wycinanie pauz i pomyłek z surowego nagrania.",
        "/opis: propozycje opisów publikacji.",
      ] },
      { p: "Te moduły działają na macOS. Poza macOS nie ma też automatycznego wykrywania twarzy i maski osoby: kadr ustawiasz ręcznie." },
    ],
  },
  {
    slug: "aktualizacje-i-pomoc",
    title: "10. Aktualizacje i pomoc",
    lead: "Nowe style i poprawki dostajesz jedną komendą.",
    blocks: [
      { p: "Wpisz /aktualizacja. Program pobierze nową wersję i zostawi Twoją markę bez zmian. Wersja ZIP: pobierz nowy plik z konta." },
      { p: "Komenda /pomoc pokazuje listę komend. Problem z instalacją? Napisz na wskopek.all@gmail.com i dołącz wynik /stan." },
    ],
  },
]
