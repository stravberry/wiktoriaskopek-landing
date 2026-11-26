// Polityka prywatności i cookies wiktoriaskopek.pl — SZKIC 25.11.2026, zgodny ze stanem faktycznym strony po wdrożeniu sklepu.
// Wersja: POLICY_VERSION w lib/mf/config.ts (zapisywana w dzienniku zgód). Nie jest poradą prawną.
import { SELLER } from "./mf/config.ts"

export const PRIVACY_UPDATED = "25 listopada 2026 (wersja polityka-2026-11-25)"

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
      "Statystyki odwiedzin (Vercel Analytics) i zdarzenia lejka zakupu — tylko po Twojej zgodzie (lit. a). Marketing e-mail — tylko po osobnej zgodzie przy zamówieniu (lit. a).",
    ],
  },
  {
    title: "3. Pliki cookies i podobne technologie",
    items: [
      "Niezbędne (bez zgody): ws_consent — zapamiętuje Twój wybór, 6 miesięcy; mf_session — logowanie do konta MontageFrames, httpOnly, 30 dni.",
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
      "Vercel Inc. (hosting strony, statystyki po zgodzie), Stripe Payments Europe Ltd. (płatności), Resend / Plus Five Five, Inc. (wysyłka maili), Supabase, Inc. (baza zamówień, serwery w UE — Frankfurt), GitHub, Inc. (dostęp do repozytorium programu, jeśli podasz login GitHub), Cal.com, Inc. (kalendarz, po zgodzie).",
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
      "Oświadczenia o odstąpieniu: 6 lat od końca roku, w którym je złożono.",
    ],
  },
  {
    title: "6. Twoje prawa",
    items: [
      "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu wobec przetwarzania na podstawie uzasadnionego interesu oraz cofnięcia zgody w każdej chwili.",
      `Napisz na ${SELLER.email}. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).`,
      "Podanie danych przy zakupie jest dobrowolne, ale bez e-maila nie możemy dostarczyć programu. Nie podejmujemy decyzji wyłącznie automatycznie i nie profilujemy.",
    ],
  },
  {
    title: "7. Zmiany polityki",
    items: [
      "Każdą wersję tej polityki archiwizujemy w repozytorium strony z datą obowiązywania. Przy istotnej zmianie celów lub dostawców ponownie zapytamy o zgodę na cookies.",
    ],
  },
]
