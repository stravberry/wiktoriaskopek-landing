// Polityka prywatności i cookies wiktoriaskopek.pl — SZKIC 25.11.2026, zgodny ze stanem faktycznym strony po wdrożeniu sklepu.
// Wersja: POLICY_VERSION w lib/mf/config.ts (zapisywana w dzienniku zgód). Nie jest poradą prawną.
import { SELLER } from "./mf/config.ts"

export const PRIVACY_UPDATED = "27 listopada 2026 (wersja polityka-2026-11-27-4: darmowy audyt Instagrama i porady e-mail)"

export const PRIVACY_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "1. Administrator",
    items: [
      `Administratorem danych jest ${SELLER.name}, ${SELLER.address}, ${SELLER.form}. Kontakt: ${SELLER.email}, tel. ${SELLER.phone}.`,
    ],
  },
  {
    title: "2. Jakie dane i po co",
    items: [
      "Formularz kontaktowy: imię, e-mail, telefon, profil w social media, przedział przychodów i treść wiadomości — żeby odpowiedzieć na zapytanie (art. 6 ust. 1 lit. b i f RODO).",
      "Zakup MontageFrames: e-mail, imię i nazwisko lub nazwa firmy, adres rozliczeniowy, opcjonalnie login GitHub, dane zamówienia, treść i czas złożonych oświadczeń (regulamin, zgoda na natychmiastowe dostarczenie treści cyfrowej) — żeby zawrzeć i wykonać umowę, dostarczyć program i aktualizacje (art. 6 ust. 1 lit. b), spełnić obowiązki prawne (lit. c) oraz bronić się przed roszczeniami (lit. f). Danych karty ani kodu BLIK nie otrzymujemy: obsługuje je Stripe.",
      "Konto MontageFrames: e-mail i jednorazowe tokeny logowania (przechowujemy tylko ich skrót) — żeby udostępnić poradnik, pobieranie i dostęp do repozytorium (lit. b).",
      "Formularz „Odstąp od umowy”: imię i nazwisko, e-mail, numer zamówienia i treść oświadczenia (lit. c).",
      "Zgody na cookies: losowy identyfikator zgody, data, wybór kategorii, wersja banera i polityki, język i adres podstrony. Bez adresu IP i bez odcisku przeglądarki (lit. c w zw. z art. 7 ust. 1 RODO).",
      "Darmowa próba MontageFrames: e-mail, ustawienia marki (nazwa, kolory, font, styl, opcjonalnie logo, ton i odbiorcy), nagranie, które wgrywasz, i gotowa rolka próbna ze znakiem wodnym, a także treść i czas zgody na przetworzenie nagrania — żeby zmontować próbną rolkę (lit. b, a dla nagrania z Twoim wizerunkiem i głosem także Twoja zgoda, lit. a). Wgrywasz nagranie tylko z sobą albo z osobami, które się na to zgodziły. Montaż próby wykonuje program MontageFrames na komputerze administratora, a transkrypcja działa lokalnie, bez zewnętrznych usług AI.",
      "Dziennik zdarzeń sprzedaży po stronie serwera (np. kliknięcie „Kup”, rozpoczęcie płatności, zakup, etapy próby): bez plików cookies i bez identyfikatora urządzenia, a dla zalogowanych ze skrótem (hash) adresu e-mail — żeby mierzyć działanie sklepu i próby (lit. f). Zapisujemy też źródło wejścia z adresu strony (parametry utm_ i fbclid): w pamięci karty przeglądarki (sessionStorage, znika po zamknięciu karty), przy próbie i przy zamówieniu, żeby wiedzieć, z której kampanii przyszedł zakup (lit. f).",
      "Darmowy audyt Instagrama: szczegóły w sekcji 8.",
      "Ochrona formularzy przed botami (formularz kontaktowy, zapis na darmową próbę, formularz odstąpienia, darmowy audyt Instagrama): Cloudflare Turnstile sprawdza, czy formularz wysyła człowiek. Przetwarza przy tym adres IP i techniczne cechy przeglądarki i urządzenia, a nam przekazuje tylko wynik sprawdzenia — żeby chronić formularze przed spamem i nadużyciami (lit. f). Bez tego sprawdzenia formularza nie da się wysłać.",
      "Statystyki odwiedzin (Vercel Analytics) — tylko po Twojej zgodzie (lit. a). Marketing e-mail — tylko po osobnej zgodzie przy zamówieniu, przy zapisie na próbę albo przy audycie Instagrama (lit. a).",
    ],
  },
  {
    title: "3. Pliki cookies i podobne technologie",
    items: [
      "Niezbędne (bez zgody): ws_consent — zapamiętuje Twój wybór, 6 miesięcy; mf_session — logowanie do konta MontageFrames, httpOnly, 30 dni.",
      "Niezbędne zabezpieczenie formularzy (bez zgody): Cloudflare Turnstile uruchamia się tylko na stronach z formularzem (kontakt, darmowa próba, odstąpienie, darmowy audyt Instagrama na stronie głównej) i odczytuje techniczne dane przeglądarki potrzebne do sprawdzenia, czy to nie bot. Nie służy do śledzenia ani reklam.",
      "Statystyki (po zgodzie): Vercel Analytics — zbiorcze statystyki odwiedzin bez plików cookies, dostawca Vercel Inc.",
      "Treści zewnętrzne (po zgodzie lub kliknięciu „Pokaż kalendarz”): kalendarz Cal.com, który może zapisywać własne pliki i odczytywać dane przeglądarki, dostawca Cal.com, Inc.",
      "Marketing: dziś nie używamy narzędzi reklamowych (np. Piksela Meta ani Google Ads). Jeśli je dodamy, poprosimy o zgodę ponownie.",
      "Zgodę zmienisz lub cofniesz w każdej chwili linkiem „Ustawienia cookies” w stopce strony. Cofnięcie nie wpływa na zgodność z prawem wcześniejszego przetwarzania. Zapisywanie plików możesz też ograniczyć w ustawieniach przeglądarki.",
      "Czcionki strony są hostowane na naszym serwerze: ich wyświetlenie nie wysyła danych do zewnętrznych dostawców.",
    ],
  },
  {
    title: "4. Odbiorcy danych",
    items: [
      "Vercel Inc. (hosting strony, statystyki po zgodzie), Stripe Payments Europe Ltd. (płatności), Resend / Plus Five Five, Inc. (wysyłka maili), Supabase, Inc. (baza zamówień oraz pliki darmowej próby, serwery w UE — Frankfurt), GitHub, Inc. (dostęp do repozytorium programu, jeśli podasz login GitHub), Cal.com, Inc. (kalendarz, po zgodzie), Cloudflare, Inc. (ochrona formularzy przed botami: Turnstile), OpenAI Ireland Ltd. (model AI, który redaguje tekst audytu Instagrama), Meta Platforms Ireland Ltd. (źródło publicznych danych profilu do audytu: Instagram API).",
      "Część dostawców ma siedzibę w USA. Dane trafiają tam na podstawie decyzji Komisji Europejskiej o odpowiednim stopniu ochrony (EU-US Data Privacy Framework) albo standardowych klauzul umownych.",
      "Dane możemy przekazać organom państwa, gdy wymaga tego prawo.",
    ],
  },
  {
    title: "5. Jak długo przechowujemy dane",
    items: [
      "Zamówienia i oświadczenia złożone przy zakupie: 6 lat od końca roku, w którym zawarto umowę (dokumentacja sprzedaży i przedawnienie roszczeń).",
      "Dziennik zgód cookies: 5 lat od wygaśnięcia lub cofnięcia zgody.",
      "Tokeny logowania: do wygaśnięcia (30 minut lub 72 godziny), potem usuwamy je przy okresowym czyszczeniu bazy.",
      "Formularz kontaktowy: do czasu obsługi zapytania, a potem do 12 miesięcy.",
      "Darmowa próba: nagranie i logo usuwamy zaraz po zmontowaniu rolki, najpóźniej po 24 godzinach; rolkę próbną i plik marki po 7 dniach. Zapis próby (e-mail, ustawienia marki, stan, zgoda) przechowujemy, dopóki prowadzimy próby, żeby pilnować limitu jednej próby na adres — możesz zażądać jego usunięcia.",
      "Dziennik zdarzeń sprzedaży: 14 miesięcy.",
      "Darmowy audyt Instagrama: niepotwierdzone zgłoszenia usuwamy po 7 dniach, pobrane dane profilu po 7 dniach, gotowy audyt po 30 dniach. Po 30 dniach zgłoszenie anonimizujemy (usuwamy e-mail, nazwę profilu, liczby i skrót IP), zostają tylko zbiorcze statystyki. Zgodę na porady i jej potwierdzenie przechowujemy do wypisu, a potem 5 lat jako dowód zgody.",
      "Oświadczenia o odstąpieniu: 6 lat od końca roku, w którym je złożono.",
    ],
  },
  {
    title: "6. Twoje prawa",
    items: [
      "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu wobec przetwarzania na podstawie uzasadnionego interesu oraz cofnięcia zgody w każdej chwili.",
      `Napisz na ${SELLER.email}. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).`,
      "Podanie danych przy zakupie jest dobrowolne, ale bez e-maila nie możemy dostarczyć programu. Nie podejmujemy decyzji wywołujących wobec Ciebie skutki prawne wyłącznie automatycznie. Odpowiedzi z formularza audytu (typ profilu, kto robi rolki, budżet) służą tylko do wyboru jednej propozycji na końcu maila z audytem.",
    ],
  },
  {
    title: "7. Zmiany polityki",
    items: [
      "Każdą wersję tej polityki archiwizujemy w repozytorium strony z datą obowiązywania. Przy istotnej zmianie celów lub dostawców ponownie zapytamy o zgodę na cookies.",
    ],
  },
  {
    title: "8. Darmowy audyt Instagrama",
    items: [
      "Jakie dane: nazwa profilu na Instagramie, e-mail, odpowiedzi z formularza (typ profilu, kto robi rolki, miesięczny budżet na marketing), Twoje oświadczenie, że to Twój profil albo profil firmy, którym zarządzasz, opcjonalnie 4 liczby z panelu Instagrama (obserwujący, średnie wyświetlenia rolki, publikacje i rolki z 30 dni), źródło wejścia z adresu strony (utm_) oraz skrót (hash) adresu IP do limitu zgłoszeń. Robimy audyt tylko Twojego profilu albo profilu firmy, którym zarządzasz.",
      "Publiczne dane profilu: przez oficjalne API Meta (Instagram, funkcja Business Discovery) pobieramy publiczne dane konta firmowego lub twórcy: nazwę, opis (bio), link, liczbę obserwujących i publikacji oraz ostatnie publikacje (data, typ, podpis, liczba polubień, komentarzy i wyświetleń rolek). Nie pobieramy danych z kont osobistych ani statystyk z panelu (zasięg, zapisy, udostępnienia). Nie logujemy się na Twoje konto.",
      "Po co i na jakiej podstawie: żeby przygotować audyt, o który prosisz, i wysłać go mailem (art. 6 ust. 1 lit. b RODO); żeby na końcu maila zaproponować jedną dopasowaną ofertę Wiktorii na podstawie Twoich odpowiedzi oraz chronić formularz przed nadużyciami (lit. f, uzasadniony interes). Wyniki liczymy w kodzie, a tekst audytu redaguje model AI firmy OpenAI na podstawie tych wyników, bio i podpisów rolek. Pierwsze audyty czyta i zatwierdza osobiście Wiktoria. Według warunków OpenAI dane przesyłane przez API nie służą do trenowania modeli.",
      "Porady e-mail (dobrowolne): tylko po zaznaczeniu osobnej zgody albo kliknięciu „Zapisuję się” i po potwierdzeniu adresu linkiem (lit. a). Audyt dostajesz bez względu na tę zgodę. Zgodę cofniesz w każdej chwili linkiem „Wypisz się” w każdym mailu. Zapisujemy treść i wersję zgody oraz daty udzielenia, potwierdzenia i cofnięcia.",
      "Masz prawo sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie (art. 21 RODO). Jeśli ktoś zgłosił do audytu Twój profil bez Twojej wiedzy, napisz na adres z sekcji 1: usuniemy zgłoszenie i dane.",
    ],
  },
]
