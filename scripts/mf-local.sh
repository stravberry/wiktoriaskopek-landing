#!/bin/zsh
# MontageFrames: cały sklep lokalnie jedną komendą (tryb testowy Stripe, maile w skrzynce testowej).
#   ./scripts/mf-local.sh            → http://localhost:3300/pl/montuj-bez-montazysty
# Wymaga: Node 22+, Postgres 17 (Homebrew), Stripe CLI, plik z testowym kluczem Stripe (sk_test_…).
# Bezpieczne przy wielokrotnym uruchomieniu: baza i sekret zostają między uruchomieniami. Ctrl+C zatrzymuje wszystko.
set -euo pipefail
export LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8

ROOT="${0:A:h:h}"
STATE="${MF_LOCAL_STATE:-$HOME/.mf-local}"
PORT="${MF_PORT:-3300}"
PG_PORT="${MF_PG_PORT:-55432}"
KEY_FILE="${STRIPE_TEST_KEY_FILE:-$HOME/Library/Application Support/OpenBot/agent-api-keys/.vault/agent-4c17d46e-a146-4d59-978e-f03d9c7613d0/STRIPE_TEST_API_KEY}"

[[ -r "$KEY_FILE" ]] || { echo "Brak pliku z testowym kluczem Stripe: $KEY_FILE (ustaw STRIPE_TEST_KEY_FILE)"; exit 1; }
STRIPE_KEY="$(cat "$KEY_FILE")"
[[ "$STRIPE_KEY" == sk_test_* ]] || { echo "To nie jest klucz testowy (sk_test_). Przerywam."; exit 1; }

mkdir -p "$STATE"; chmod 700 "$STATE"

# 1. Postgres w katalogu stanu
if [[ ! -d "$STATE/pg" ]]; then
  initdb -D "$STATE/pg" -U mf --auth=trust --locale=C -E UTF8 >/dev/null
fi
if ! pg_ctl -D "$STATE/pg" status >/dev/null 2>&1; then
  pg_ctl -D "$STATE/pg" -o "-p $PG_PORT -k $STATE" -l "$STATE/pg.log" start >/dev/null
  sleep 1
fi
createdb -h localhost -p "$PG_PORT" -U mf mf_local 2>/dev/null || true
export DATABASE_URL="postgres://mf@localhost:$PG_PORT/mf_local"
node "$ROOT/scripts/mf-migrate.mjs" >/dev/null

# 2. Sekret sklepu (stały między uruchomieniami)
[[ -f "$STATE/secret" ]] || (umask 077; openssl rand -hex 32 > "$STATE/secret")

# 3. Zmienne (tylko w tym procesie, nic nie trafia do repo)
export MF_SHOP_ENABLED=true MF_MAIL_MODE=outbox APP_ORIGIN="http://localhost:$PORT"
export STRIPE_SECRET_KEY="$STRIPE_KEY" MF_SECRET="$(cat "$STATE/secret")"
export MF_PRICE_PACZKA="${MF_PRICE_PACZKA:-price_1UforgDd3jxwZSNieVy7J6br}"
export MF_PRICE_KONSULTACJA="${MF_PRICE_KONSULTACJA:-price_1UforiDd3jxwZSNi58GteAYp}"
export STRIPE_WEBHOOK_SECRET="$(stripe listen --api-key "$STRIPE_KEY" --print-secret 2>/dev/null)"
unset RESEND_API_KEY

# 4. Build (tylko gdy kod jest nowszy niż ostatni build)
cd "$ROOT"
if [[ ! -f .next/BUILD_ID ]] || [[ -n "$(find app components lib emails -newer .next/BUILD_ID -type f | head -1)" ]]; then
  echo "Buduję stronę…"; npx -y pnpm@10 build >"$STATE/build.log" 2>&1 || { echo "Build nieudany: $STATE/build.log"; exit 1; }
fi

# 5. Webhooki Stripe → lokalny serwer, potem serwer
stripe listen --api-key "$STRIPE_KEY" \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,charge.refunded,charge.dispute.created \
  --forward-to "localhost:$PORT/api/stripe/webhook" >"$STATE/stripe.log" 2>&1 &
LISTEN_PID=$!
trap 'kill $LISTEN_PID 2>/dev/null; pg_ctl -D "$STATE/pg" stop -m fast >/dev/null 2>&1; echo "Zatrzymano."' EXIT INT TERM

echo "Sklep:            http://localhost:$PORT/pl/montuj-bez-montazysty"
echo "Skrzynka testowa: http://localhost:$PORT/pl/dev/outbox"
echo "Karta testowa:    4242 4242 4242 4242, data w przyszłości, CVC 123"
npx next start -p "$PORT"
