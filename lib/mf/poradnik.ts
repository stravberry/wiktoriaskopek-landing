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
    // Treść: Coding Builder, Shared/montageframes-produkt/poradnik/aktualizacje.md (wydanie-6-hyperframes, 26.11.2026).
    slug: "aktualizacje",
    title: "10. Aktualizacje programu i silnika",
    lead: "Program aktualizujesz jedną komendą. Silnik HyperFrames zostaje w wersji sprawdzonej przez nas, chyba że wybierzesz najnowszą.",
    blocks: [
      { p: "MontageFrames składa się z programu (to, co pobierasz z GitHuba) i silnika renderowania HyperFrames. Program aktualizujesz jednym poleceniem; silnik możesz zostawić w wersji sprawdzonej przez nas albo przejść na najnowszą." },
      { p: "Jak sprawdzić wersję:" },
      { list: [
        "W Claude Code wpisz /aktualizacja. Claude pokaże wersję programu, silnika HyperFrames (obecną, zalecaną i najnowszą) oraz stan skilli.",
        "W panelu: Ustawienia → Aktualizacje.",
        "W Terminalu, w folderze programu:",
      ] },
      { code: "node scripts/mf/update.mjs status" },
      { p: "Jak zaktualizować program:" },
      { list: [
        "W Claude Code: /aktualizacja.",
        "W panelu: Ustawienia → Aktualizacje → „Zaktualizuj program”.",
      ] },
      { p: "Program pobiera nowe wydanie z GitHuba razem z wersją silnika, którą sprawdziliśmy na pełnym zestawie testów. Twoje rolki, profil marki, preferencje i gotowe filmy zostają bez zmian. Po aktualizacji uruchom panel ponownie (/panel). Masz wersję ZIP? Pobierz nowy plik z konta." },
      { p: "Jak zaktualizować silnik HyperFrames do najnowszej wersji. Rób to tylko, jeśli potrzebujesz nowości z HyperFrames, której nie ma jeszcze w naszym wydaniu:" },
      { list: [
        "W panelu: Ustawienia → Aktualizacje → Silnik i skille → „Silnik: najnowsza wersja”.",
        "Albo w Claude Code: „zaktualizuj silnik HyperFrames do najnowszej wersji”.",
      ] },
      { p: "Co się wtedy dzieje:" },
      { list: [
        "Program pokazuje obecną i najnowszą wersję i ostrzega, że najnowsza nie była przez nas testowana.",
        "Robi kopię ustawień zależności (package.json, package-lock.json) w .updates/engine-backup/.",
        "Instaluje nową wersję i uruchamia samotest: nagranie demo, transkrypcja, krytyk jakości i render MP4 (1–2 minuty).",
        "Jeśli coś nie działa, sam wraca do poprzedniej wersji i mówi, co się stało.",
      ] },
      { p: "Skille HyperFrames (instrukcje dla Claude do animacji) aktualizujesz tak samo: „Zaktualizuj skille”. Program robi kopię w .updates/skills-backup/ i przy błędzie przywraca poprzednie." },
      { p: "Jak wrócić:" },
      { list: [
        "Silnik: Ustawienia → Aktualizacje → „Wróć do wersji zalecanej” albo polecenie poniżej.",
        "Skille: „Przywróć poprzednie skille” albo polecenie poniżej.",
        "Kolejna zwykła aktualizacja programu też przywraca zalecaną wersję silnika.",
      ] },
      { code: "node scripts/mf/update.mjs engine-recommended\nnode scripts/mf/update.mjs skills-restore" },
    ],
  },
  {
    slug: "pomoc",
    title: "11. Pomoc",
    lead: "Lista komend i kontakt, gdy coś nie działa.",
    blocks: [
      { p: "Komenda /pomoc pokazuje listę komend. Problem z instalacją? Napisz na wskopek.all@gmail.com i dołącz wynik /stan." },
    ],
  },
]
