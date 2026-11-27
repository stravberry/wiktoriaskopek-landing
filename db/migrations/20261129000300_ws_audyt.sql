-- Darmowy audyt Instagrama na wiktoriaskopek.pl (plan C, decyzje Wiktorii 27.11.2026).
-- Kolejka zgłoszeń, raporty, dziennik zgód, newsletter (double opt-in), dziennik maili (limit Resend), koszt AI.
-- Idempotentne: można uruchamiać wielokrotnie. Dostęp tylko z serwera (rola mf_app), RLS włączone.

create table if not exists ws_audit_requests (
  id uuid primary key default gen_random_uuid(),
  email text,                         -- null po anonimizacji (retencja)
  email_norm text,                    -- bez +aliasu i kropek w Gmailu, do limitu 1 audyt / 30 dni
  handle text,                        -- nazwa profilu IG bez @, małe litery
  profile_type text not null check (profile_type in ('firma', 'marka', 'prywatny')),
  who_makes text not null check (who_makes in ('ja', 'zespol', 'agencja', 'nikt')),
  budget text not null check (budget in ('0', 'do1k', '1-5k', '5k+')),
  manual jsonb,                       -- 4 liczby podane ręcznie (konto prywatne albo brak danych z Meta)
  owner_declared boolean not null,
  newsletter boolean not null default false,
  utm jsonb not null default '{}'::jsonb,
  ip_hash text,
  confirm_hash text unique,           -- sha256 tokenu z maila potwierdzającego
  confirm_expires_at timestamptz,
  status text not null default 'czeka' check (status in ('czeka', 'potwierdzony', 'analiza', 'do_akceptacji', 'wyslany', 'odrzucony', 'brak_danych', 'blad')),
  segment text check (segment in ('rozmowa', 'mf', 'porady')),
  source text check (source in ('meta', 'reczne', 'test')),
  note text,
  attempts int not null default 0,
  lease_until timestamptz,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  analysed_at timestamptz,
  reviewed_at timestamptz,
  sent_at timestamptz,
  anonymized_at timestamptz
);
create index if not exists ws_audit_requests_status_idx on ws_audit_requests (status, created_at);
create index if not exists ws_audit_requests_email_idx on ws_audit_requests (email_norm, created_at);
create index if not exists ws_audit_requests_handle_idx on ws_audit_requests (handle, created_at);
create index if not exists ws_audit_requests_ip_idx on ws_audit_requests (ip_hash, created_at);
alter table ws_audit_requests enable row level security;
-- Testerzy (wskopek.all+…, MF_TEST_ALLOWLIST) nie zajmują dziennego limitu odwiedzających.
alter table ws_audit_requests add column if not exists tester boolean not null default false;

create table if not exists ws_audit_reports (
  request_id uuid primary key references ws_audit_requests (id) on delete cascade,
  data jsonb,                         -- surowe dane profilu (kasowane po 7 dniach)
  metrics jsonb not null,             -- 10 kryteriów policzonych w kodzie
  report jsonb not null,              -- treść maila 0 (ocena, najlepsza rolka, 3 obserwacje, zadanie)
  report_edited jsonb,                -- poprawki Wiktorii przed wysyłką
  model text,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_usd numeric(10, 5) not null default 0,
  created_at timestamptz not null default now(),
  data_purged_at timestamptz
);
alter table ws_audit_reports enable row level security;

-- Dziennik zgód: rodzaj, wersja i treść, daty udzielenia, potwierdzenia (double opt-in) i cofnięcia.
create table if not exists ws_consents (
  id bigserial primary key,
  email text not null,
  kind text not null check (kind in ('audyt_informacja', 'newsletter')),
  text_version text not null,
  text_snapshot text not null,
  request_id uuid references ws_audit_requests (id) on delete set null,
  ip_hash text,
  given_at timestamptz not null default now(),
  confirmed_at timestamptz,
  withdrawn_at timestamptz
);
create index if not exists ws_consents_email_idx on ws_consents (lower(email), kind);
alter table ws_consents enable row level security;

-- Newsletter („porady”): tylko po potwierdzeniu adresu. Stan sekwencji dni 2/4/7/10 po audycie.
create table if not exists ws_newsletter (
  email text primary key,             -- małe litery
  consent_id bigint references ws_consents (id),
  segment text,
  request_id uuid references ws_audit_requests (id) on delete set null,
  unsub_hash text unique not null,
  confirmed_at timestamptz,
  sequence_step int not null default 0,
  next_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists ws_newsletter_next_idx on ws_newsletter (next_at) where unsubscribed_at is null and confirmed_at is not null;
alter table ws_newsletter enable row level security;

-- Każdy mail funkcji audytu: idempotencja i dzienny budżet (darmowy Resend: 100 maili / dobę razem ze sklepem).
create table if not exists ws_mail_log (
  idempotency_key text primary key,
  kind text not null,
  created_at timestamptz not null default now()
);
create index if not exists ws_mail_log_created_idx on ws_mail_log (created_at);
alter table ws_mail_log enable row level security;

-- Uwierzytelnienie wywołań z pg_cron: w tabeli tylko skrót sekretu, sam sekret jest w Supabase Vault.
create table if not exists ws_cron_auth (
  name text primary key,
  secret_hash text not null,
  created_at timestamptz not null default now()
);
alter table ws_cron_auth enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    execute 'grant select, insert, update, delete on ws_audit_requests, ws_audit_reports, ws_consents, ws_newsletter, ws_mail_log to mf_app';
    execute 'grant select on ws_cron_auth to mf_app';
    execute 'grant usage on sequence ws_consents_id_seq to mf_app';
    if not exists (select 1 from pg_policies where tablename = 'ws_audit_requests' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on ws_audit_requests for all to mf_app using (true) with check (true)';
    end if;
    if not exists (select 1 from pg_policies where tablename = 'ws_audit_reports' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on ws_audit_reports for all to mf_app using (true) with check (true)';
    end if;
    if not exists (select 1 from pg_policies where tablename = 'ws_consents' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on ws_consents for all to mf_app using (true) with check (true)';
    end if;
    if not exists (select 1 from pg_policies where tablename = 'ws_newsletter' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on ws_newsletter for all to mf_app using (true) with check (true)';
    end if;
    if not exists (select 1 from pg_policies where tablename = 'ws_mail_log' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on ws_mail_log for all to mf_app using (true) with check (true)';
    end if;
    if not exists (select 1 from pg_policies where tablename = 'ws_cron_auth' and policyname = 'mf_app_read') then
      execute 'create policy mf_app_read on ws_cron_auth for select to mf_app using (true)';
    end if;
  end if;
end $$;
