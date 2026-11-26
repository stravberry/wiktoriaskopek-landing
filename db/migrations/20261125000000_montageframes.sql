-- MontageFrames: zamówienia, licencje, zgody zakupowe, dziennik zgód cookies, tokeny logowania.
-- Zwykły Postgres (Supabase / Neon / lokalny). Idempotentna: można uruchamiać wielokrotnie.
-- Dostęp tylko z serwera (DATABASE_URL). Na Supabase RLS włączone bez polityk = brak dostępu z anon/authenticated.

create extension if not exists pgcrypto;

-- Zgoda zakupowa zapisana PRZED przekierowaniem do Stripe (art. 38 ust. 1 pkt 13 u.p.k.).
create table if not exists mf_consents (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  product                 text not null,
  email                   text,
  terms_version           text not null,
  terms_accepted          boolean not null,
  digital_consent         boolean not null,
  digital_consent_text    text not null,
  service_start_consent   boolean not null default false,
  marketing_consent       boolean not null default false,
  github_login            text,
  lang                    text not null default 'pl',
  checkout_session_id     text unique
);

create table if not exists mf_orders (
  session_id          text primary key,             -- Stripe Checkout Session ID = klucz idempotencji
  product             text not null,
  email               text not null,
  customer_name       text,
  tax_id              text,
  amount_total        integer,
  currency            text,
  payment_intent      text unique,
  consent_id          uuid references mf_consents(id),
  github_login        text,
  github_status       text not null default 'none'
                      check (github_status in ('none', 'invited', 'failed', 'removed')),
  github_error        text,
  license_hash        text unique,                  -- SHA-256 klucza MF1-…; sam klucz nie jest przechowywany
  license_hint        text,                         -- ostatnie 5 znaków do wyświetlenia
  status              text not null default 'pending'
                      check (status in ('pending', 'sending', 'delivered', 'failed', 'refunded', 'disputed')),
  attempts            integer not null default 0,
  lease_until         timestamptz,
  last_error          text,
  utm                 jsonb,
  resend_count        integer not null default 0,
  resend_window_start timestamptz,
  created_at          timestamptz not null default now(),
  delivered_at        timestamptz,
  revoked_at          timestamptz
);
create index if not exists mf_orders_email_idx on mf_orders (lower(email));

-- Każde zdarzenie Stripe zapisane raz (idempotencja po event.id).
create table if not exists mf_stripe_events (
  event_id     text primary key,
  type         text not null,
  received_at  timestamptz not null default now(),
  processed_at timestamptz,
  result       text
);

-- Jednorazowe tokeny logowania (magic link). Przechowujemy tylko SHA-256.
create table if not exists mf_login_tokens (
  token_hash  text primary key,
  email       text not null,
  purpose     text not null default 'login',
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  used_at     timestamptz
);
create index if not exists mf_login_tokens_email_idx on mf_login_tokens (lower(email), created_at);

-- Dziennik zgód cookies: tylko dopisywanie, idempotentny po event_id. Bez IP i fingerprintu.
create table if not exists consent_events (
  event_id        uuid primary key,
  consent_id      uuid not null,
  created_at      timestamptz not null default now(),
  action          text not null check (action in ('accept_all', 'reject_all', 'custom', 'withdraw')),
  analytics       boolean not null,
  marketing       boolean not null,
  external        boolean not null,
  banner_version  text not null,
  policy_version  text not null,
  lang            text not null,
  source          text not null check (source in ('banner', 'settings')),
  path            text
);
create index if not exists consent_events_consent_idx on consent_events (consent_id, created_at);

-- Oświadczenia o odstąpieniu od umowy złożone przez formularz.
create table if not exists mf_withdrawals (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  order_ref   text,
  statement   text not null
);

alter table mf_consents enable row level security;
alter table mf_orders enable row level security;
alter table mf_stripe_events enable row level security;
alter table mf_login_tokens enable row level security;
alter table consent_events enable row level security;
alter table mf_withdrawals enable row level security;

-- Atomowo tworzy zamówienie (pierwsze zdarzenie) i bierze dzierżawę realizacji.
-- outcome: 'claimed' (wywołujący realizuje), 'busy' (inna próba trzyma dzierżawę), 'delivered', 'revoked'.
create or replace function mf_claim_order(
  p_session_id text, p_product text, p_email text, p_lease_seconds integer
) returns table (outcome text)
language plpgsql
set search_path = public
as $$
begin
  insert into mf_orders (session_id, product, email)
  values (p_session_id, p_product, p_email)
  on conflict (session_id) do nothing;

  return query
    update mf_orders o
       set status = 'sending', attempts = o.attempts + 1, last_error = null,
           lease_until = now() + make_interval(secs => p_lease_seconds)
     where o.session_id = p_session_id
       and o.status in ('pending', 'failed', 'sending')
       and (o.status <> 'sending' or o.lease_until < now())
    returning 'claimed'::text;
  if found then return; end if;

  return query
    select case
             when o.status = 'delivered' then 'delivered'
             when o.status in ('refunded', 'disputed') then 'revoked'
             else 'busy'
           end
      from mf_orders o where o.session_id = p_session_id;
end;
$$;

-- Funkcja tylko dla serwera: odbieramy wykonanie rolom publicznym (na Supabase także anon/authenticated).
revoke all on function mf_claim_order(text, text, text, integer) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function mf_claim_order(text, text, text, integer) from anon, authenticated';
  end if;
end $$;

-- Tryb testowy bez Resend (MF_MAIL_MODE=outbox, nigdy na produkcji): maile trafiają tu zamiast do skrzynki.
create table if not exists mf_mail_outbox (
  idempotency_key text primary key,
  created_at      timestamptz not null default now(),
  to_email        text not null,
  subject         text not null,
  body_text       text not null
);
alter table mf_mail_outbox enable row level security;

alter table mf_mail_outbox add column if not exists body_html text;
