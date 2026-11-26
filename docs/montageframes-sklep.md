# Sklep MontageFrames: jak działa i jak uruchomić

Landing: `/pl/montuj-bez-montazysty`. Sprzedaż tylko po polsku, tylko tryb testowy Stripe, dopóki Wiktoria nie zatwierdzi produkcji.

## Ścieżka zakupu

1. Landing → test zgodności → formularz: wariant (238 zł / 589 zł), e-mail, opcjonalnie login GitHub, **osobne niezaznaczone pola**: regulamin (wymagane), zgoda na natychmiastowe dostarczenie treści cyfrowej i utratę prawa odstąpienia (wymagane), żądanie wcześniejszej konsultacji (tylko wariant 589 zł), marketing (opcjonalne). Przycisk „Zamawiam z obowiązkiem zapłaty”.
2. `POST /api/mf/checkout`: walidacja (bez zgody → 400), zapis zgody w `mf_consents` (data, wersja regulaminu, treść oświadczenia), sesja Stripe Checkout (PLN, metody płatności z konfiguracji konta: BLIK, karta, portfele…, bez pola NIP i bez Stripe Tax, `metadata.consent_id`), zapis `checkout_session_id` przy zgodzie.
3. `POST /api/stripe/webhook` (podpis na surowym body):
   - `checkout.session.completed` / `async_payment_succeeded` (tylko `paid`): idempotencja po `event.id` (`mf_stripe_events`) i po ID sesji (`mf_claim_order`, dzierżawa 120 s), sprawdzenie zapisanej zgody, klucz `MF1-…` (wyliczany HMAC z ID sesji, w bazie tylko SHA-256), zaproszenie GitHub do `MF_DIST_REPO` (uprawnienie pull), mail z kluczem, magic linkiem (72 h, jednorazowy), potwierdzeniem zgody i regulaminem w załączniku (Resend `Idempotency-Key: mf-access/{session_id}`).
   - `charge.refunded` (pełny zwrot) i `charge.dispute.created`: status `refunded`/`disputed`, usunięcie współpracownika i oczekującego zaproszenia w GitHub. Późne zdarzenie zakupu po zwrocie nie przywraca dostępu.
4. `/dziekujemy?session_id=…`: sesja pobierana ze Stripe po stronie serwera (fałszywe ID → komunikat bez danych), 3 kroki, „wyślij ponownie” (max 3/h na zamówienie).
5. Konto `/konto`: logowanie linkiem z maila (`/api/mf/auth`, token jednorazowy 30 min, w bazie tylko SHA-256), ciasteczko `mf_session` httpOnly 30 dni. Login GitHub → zaproszenie; „Pobierz ZIP” → tymczasowy link GitHuba (`zipball/main`), limit 10/dobę.
6. Poradnik `/poradnik/*`: tylko z aktywnym zakupem, `noindex`, e-mail kupującego w stopce, wyszukiwarka i spis treści.

Kontrakt dostawy uzgodniony z Coding Builderem 25.11.2026: repo `DKWGroup/MontageFrames-dist`, bez endpointu aktualizacji, bez limitu urządzeń; `/aktualizacja` w paczce = `git pull`. Kod odmawia nadania dostępu do `DKWGroup/MontageFrames`.

## Zgody cookies

`components/consent/consent-provider.tsx`: przed zgodą nie ładuje się Vercel Analytics ani Cal.com (ramka po zgodzie „Treści zewnętrzne” albo po kliknięciu „Pokaż kalendarz”). „Akceptuję” i „Odrzucam” obok siebie, ustawienia per kategoria, wycofanie linkiem „Ustawienia cookies” w stopce (na stronie głównej przycisk w rogu), ciasteczko `ws_consent` na 6 miesięcy, dziennik `consent_events` przez `POST /api/consent` (idempotentny po `eventId`, bez IP). Fonty Satoshi hostowane lokalnie.

## Zmienne środowiskowe

| Zmienna | Opis |
|---|---|
| `MF_SHOP_ENABLED` | `true` włącza sklep. Bez tego API zwraca 503, a konto „niedostępne” |
| `STRIPE_SECRET_KEY` | klucz Stripe; `sk_live_` na produkcji blokowany bez `MF_ALLOW_LIVE=true` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` endpointu `/api/stripe/webhook` |
| `MF_PRICE_PACZKA`, `MF_PRICE_KONSULTACJA` | ID cen Stripe (lookup_key `mf_paczka_238`, `mf_konsultacja_589`) |
| `APP_ORIGIN` | stały adres strony (podgląd albo `https://wiktoriaskopek.pl`) |
| `DATABASE_URL` | Postgres (Supabase: pooler transakcyjny, port 6543) |
| `MF_SECRET` | losowy, min. 32 znaki (`openssl rand -hex 32`); klucze licencyjne i sesje |
| `RESEND_API_KEY` | istniejący klucz strony |
| `MF_EMAIL_FROM` | nadawca maili sklepu, np. `MontageFrames <produkty@wiktoriaskopek.pl>`; domyślnie `EMAIL_FROM` |
| `MF_REPLY_TO` | domyślnie `wskopek.all@gmail.com` |
| `GITHUB_INVITE_TOKEN` | fine-grained PAT konta DKWGroup, tylko repo paczki: Administration RW, Contents R |
| `MF_DIST_REPO` | domyślnie `DKWGroup/MontageFrames-dist` |
| `MF_MAIL_MODE` | `outbox` = test bez Resend (maile w tabeli `mf_mail_outbox`); zablokowane na produkcji |

## Uruchomienie i testy

```bash
pnpm install
pnpm test                                              # logika, bez sieci
MF_TEST_DATABASE_URL=postgres://… pnpm test            # + testy na bazie (wyścig 20 webhooków, tokeny, limity)
DATABASE_URL=postgres://… pnpm db:migrate              # migracja idempotentna
stripe listen --forward-to localhost:3000/api/stripe/webhook \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,charge.refunded,charge.dispute.created
```

Stripe: webhook na `https://<domena>/api/stripe/webhook` z 4 zdarzeniami powyżej. W Resend wyłącz śledzenie otwarć i kliknięć dla domeny nadawcy.
