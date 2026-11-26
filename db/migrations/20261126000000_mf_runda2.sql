-- MontageFrames, runda 2 (00-PLAN 0e): logowanie od razu po zakupie i własny dziennik zdarzeń lejka.
-- Idempotentne: można uruchamiać wiele razy.

-- „Przejdź do konta” na stronie podziękowania: jednorazowe, do 30 min po płatności.
alter table mf_orders add column if not exists instant_login_at timestamptz;

-- Dziennik zdarzeń (bez piksela Meta i bez ciasteczek): nazwa, czas, właściwości bez danych osobowych.
-- Zdarzenia zalogowanych mają skrót e-maila (sha256), żeby liczyć lejek próba → zakup bez przechowywania adresu drugi raz.
create table if not exists mf_events (
  id         bigserial primary key,
  ts         timestamptz not null default now(),
  event      text not null check (event ~ '^[a-z_]{3,40}$'),
  props      jsonb not null default '{}'::jsonb check (length(props::text) <= 2000),
  email_hash text
);
create index if not exists mf_events_event_ts on mf_events (event, ts);
create index if not exists mf_events_email_hash on mf_events (email_hash) where email_hash is not null;
alter table mf_events enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    execute 'grant select, insert, delete on mf_events to mf_app';
    execute 'grant usage on sequence mf_events_id_seq to mf_app';
    if not exists (select 1 from pg_policies where tablename = 'mf_events' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on mf_events for all to mf_app using (true) with check (true)';
    end if;
  end if;
end $$;
