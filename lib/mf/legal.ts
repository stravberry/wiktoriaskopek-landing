// SZKIC regulaminu sprzedaży MontageFrames (25.11.2026). Nie jest poradą prawną; do przeglądu przed startem sprzedaży.
// Jedno źródło dla strony /montuj-bez-montazysty/regulamin i załącznika w mailu (trwały nośnik).
// Zmiana treści = nowa wartość MF_TERMS_VERSION w config.ts.
import { MF_PRODUCTS, MF_REQUIREMENTS, MF_TERMS_VERSION, MF_TEXT, SELLER } from "./config.ts"

export type LegalSection = { title: string; items: string[] }

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "§1. Sprzedawca i kontakt",
    items: [
      `Sprzedawcą jest ${SELLER.name}, ${SELLER.address}, prowadząca ${SELLER.form}.`,
      `Kontakt: e-mail ${SELLER.email}, telefon ${SELLER.phone}. Reklamacje, pytania i oświadczenia możesz wysłać mailem albo przez formularz „Odstąp od umowy” na stronie.`,
    ],
  },
  {
    title: "§2. Definicje",
    items: [
      "Kupujący: osoba fizyczna, osoba prawna albo jednostka organizacyjna, która składa zamówienie. Konsument: Kupujący będący konsumentem w rozumieniu art. 22¹ Kodeksu cywilnego. Przepisy o konsumencie stosuje się także do osoby fizycznej prowadzącej działalność gospodarczą, gdy umowa nie ma dla niej charakteru zawodowego (art. 38a ustawy o prawach konsumenta).",
      "Program (MontageFrames): treść cyfrowa w postaci paczki plików (projekt ze skillami, instrukcjami i silnikiem montażu), którą otwierasz w Claude Code, wraz z panelem w przeglądarce, katalogiem stylów i aktualizacjami.",
      "Poradnik: strony internetowe dostępne po zalogowaniu na wiktoriaskopek.pl oraz wersja do pobrania.",
      "Konsultacja: usługa online 1:1 z instalacją Programu na komputerze Kupującego.",
    ],
  },
  {
    title: "§3. Produkty i ceny",
    items: [
      `${MF_PRODUCTS.paczka.name}: ${MF_PRODUCTS.paczka.priceLabel}, płatność jednorazowa, bez limitu komputerów w ramach jednego Kupującego.`,
      `${MF_PRODUCTS.konsultacja.name}: ${MF_PRODUCTS.konsultacja.priceLabel}, płatność jednorazowa. Obejmuje Program oraz jedną konsultację online. Termin ustalamy mailem po zakupie.`,
      "Ceny są cenami końcowymi w złotych. Sprzedawca nie jest czynnym podatnikiem VAT.",
      "Przy obniżce ceny podajemy też najniższą cenę z 30 dni przed obniżką.",
    ],
  },
  {
    title: "§4. Wymagania techniczne",
    items: [
      MF_REQUIREMENTS.claude,
      MF_REQUIREMENTS.system,
      MF_REQUIREMENTS.disk,
      MF_REQUIREMENTS.ram,
      MF_REQUIREMENTS.internet,
      MF_REQUIREMENTS.github,
      MF_REQUIREMENTS.macOnly,
      "Program działa przez zewnętrzną usługę Claude (Anthropic). Sprzedawca nie odpowiada za zmiany cennika, limitów i zasad tej usługi, ale w ramach aktualizacji dostosowuje Program do zmian, jeśli to możliwe.",
    ],
  },
  {
    title: "§5. Zamówienie i płatność",
    items: [
      "Zamówienie składasz na stronie produktu: wybierasz wariant, akceptujesz Regulamin, składasz oświadczenia z §6 i klikasz „Zamawiam z obowiązkiem zapłaty”. Następnie płacisz na stronie Stripe.",
      "Płatności obsługuje Stripe Payments Europe Ltd. Dostępne metody (np. BLIK, karta, Apple Pay, Google Pay) wyświetla Stripe.",
      "Umowa zostaje zawarta z chwilą potwierdzenia płatności. Potwierdzenie zawarcia umowy, ten Regulamin i treść złożonych oświadczeń wysyłamy mailem.",
    ],
  },
  {
    title: "§6. Dostarczenie i prawo odstąpienia",
    items: [
      "Program dostarczamy niezwłocznie po płatności: mailem z kluczem licencyjnym i linkiem do konta, przez zaproszenie do prywatnego repozytorium GitHub (po podaniu loginu GitHub) albo przez pobranie pliku ZIP z konta.",
      `Przed płatnością składasz oświadczenie: „${MF_TEXT.digital}” Bez tego oświadczenia nie możemy wydać Programu przed upływem 14 dni.`,
      "Konsument ma 14 dni na odstąpienie od umowy bez podania przyczyny. Przy treści cyfrowej prawo to wygasa z chwilą rozpoczęcia dostarczania, jeśli Konsument złożył oświadczenie z ust. 2, a Sprzedawca potwierdził je mailem (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta).",
      `Konsultacja jest usługą. Na żądanie Konsumenta („${MF_TEXT.serviceStart}”) może odbyć się przed upływem 14 dni. Po pełnym wykonaniu usługi prawo odstąpienia wygasa. Jeśli odstąpisz po rozpoczęciu, płacisz za część wykonaną do chwili odstąpienia. Bez tego żądania konsultację planujemy po upływie 14 dni.`,
      "Oświadczenie o odstąpieniu możesz złożyć mailem albo przez formularz „Odstąp od umowy” na stronie. Zwracamy płatność w ciągu 14 dni tą samą metodą. Po zwrocie dostęp do Programu i aktualizacji wygasa.",
    ],
  },
  {
    title: "§7. Gwarancja działania (dobrowolna)",
    items: [
      "Gwarancja działania: jeśli w ciągu 14 dni od zakupu nie uruchomisz Programu na swoim komputerze, który spełnia wymagania z §4, mimo naszej pomocy, oddaję całą zapłaconą kwotę.",
      "Zgłoszenie z gwarancji wysyłasz mailem z opisem problemu i wynikiem komendy /stan. Gwarancja nie wyłącza ani nie ogranicza ustawowych uprawnień Konsumenta.",
    ],
  },
  {
    title: "§8. Licencja",
    items: [
      "Po zapłacie otrzymujesz niewyłączną, nieprzenoszalną licencję na korzystanie z Programu na własne potrzeby i potrzeby swojej firmy, na dowolnej liczbie komputerów, bez ograniczenia czasu.",
      "Nie wolno odsprzedawać, udostępniać ani publikować Programu, klucza, dostępu do repozytorium ani Poradnika osobom trzecim.",
      "Program korzysta z bibliotek open source. Lista licencji jest w pliku THIRD_PARTY_NOTICES.md w paczce.",
      "Filmy, które zmontujesz Programem, należą do Ciebie.",
    ],
  },
  {
    title: "§9. Aktualizacje i zgodność z umową",
    items: [
      "Aktualizacje pobierasz komendą /aktualizacja (git pull) albo nowym plikiem ZIP z konta. Sprzedawca dostarcza aktualizacje niezbędne do zachowania zgodności Programu z umową przez okres, którego Konsument może rozsądnie oczekiwać (art. 43k ustawy o prawach konsumenta).",
      "Sprzedawca odpowiada za zgodność treści cyfrowej z umową na zasadach rozdziału 5b ustawy o prawach konsumenta. Jeśli Program nie działa zgodnie z opisem, możesz żądać doprowadzenia go do zgodności, a w przypadkach z ustawy obniżenia ceny albo odstąpienia od umowy.",
    ],
  },
  {
    title: "§10. Reklamacje i wsparcie",
    items: [
      `Reklamację wyślij na ${SELLER.email}. Odpowiemy w ciągu 14 dni. Brak odpowiedzi w tym terminie oznacza uznanie reklamacji.`,
      "Wsparcie mailowe w sprawie instalacji: odpowiedź do 3 dni roboczych.",
    ],
  },
  {
    title: "§11. Konto",
    items: [
      "Konto na stronie działa bez hasła: logujesz się linkiem z maila, ważnym 30 minut i jednorazowym. Usługa konta jest bezpłatna; możesz ją zakończyć mailem w każdej chwili.",
    ],
  },
  {
    title: "§12. Dane osobowe",
    items: ["Zasady przetwarzania danych opisuje Polityka prywatności na wiktoriaskopek.pl/polityka-prywatnosci."],
  },
  {
    title: "§14. Darmowa wersja próbna",
    items: [
      "Darmowa próba to bezpłatna usługa elektroniczna: po potwierdzeniu adresu e-mail ustawiasz markę w przeglądarce, wgrywasz jedno nagranie (od 5 do 60 sekund, do 50 MB) i dostajesz jedną próbną rolkę ze znakiem wodnym.",
      "Limit: jedna próbna rolka na adres e-mail. Rolkę możesz pobrać przez 7 dni; potem ją usuwamy. Nagranie usuwamy zaraz po montażu, najpóźniej po 24 godzinach.",
      "Wgrywasz tylko nagranie, na którym jesteś Ty albo osoby, które się na to zgodziły, i które nie narusza praw innych osób. Nagranie przetwarzamy wyłącznie po to, żeby zmontować próbną rolkę.",
      "Próba nie jest zakupem programu i nie daje licencji na program. Rolki próbnej możesz używać do własnych celów, ze znakiem wodnym. Montaż odbywa się w kolejce, więc czas oczekiwania może się zmieniać.",
      "Z próby możesz zrezygnować w każdej chwili, pisząc na adres sprzedawcy; usuniemy wtedy jej dane.",
    ],
  },
  {
    title: "§13. Postanowienia końcowe",
    items: [
      "Regulamin obowiązuje od dnia publikacji. Zmiana Regulaminu nie dotyczy umów zawartych wcześniej.",
      "Konsument może skorzystać z pozasądowych sposobów rozpatrywania sporów, m.in. przez powiatowego (miejskiego) rzecznika konsumentów lub Inspekcję Handlową.",
      "W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności Kodeks cywilny, ustawę o prawach konsumenta i ustawę o świadczeniu usług drogą elektroniczną.",
    ],
  },
]

export function termsPlainText() {
  const lines = [
    `REGULAMIN SPRZEDAŻY MONTAGEFRAMES — wersja ${MF_TERMS_VERSION}, obowiązuje od 26.11.2026`,
    `Sprzedawca: ${SELLER.name}, ${SELLER.address}, ${SELLER.email}, ${SELLER.phone}`,
    "",
  ]
  for (const s of TERMS_SECTIONS) {
    lines.push(s.title)
    s.items.forEach((t, i) => lines.push(`${i + 1}. ${t}`))
    lines.push("")
  }
  lines.push("WZÓR FORMULARZA ODSTĄPIENIA OD UMOWY")
  lines.push(`Adresat: ${SELLER.name}, ${SELLER.address}, ${SELLER.email}`)
  lines.push("Ja/My niniejszym informuję/informujemy o moim/naszym odstąpieniu od umowy dostarczenia treści cyfrowej / świadczenia usługi: ____")
  lines.push("Data zawarcia umowy: ____  Imię i nazwisko: ____  Adres: ____  Data: ____")
  return lines.join("\n")
}
