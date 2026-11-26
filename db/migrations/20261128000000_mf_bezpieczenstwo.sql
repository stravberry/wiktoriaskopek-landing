-- Przegląd bezpieczeństwa 26.11 (S2, S4): lista „zakup wkrótce” w trybie testowym i limity formularzy w bazie.
create table if not exists mf_waitlist (
  id bigserial primary key,
  email text not null,
  marketing_consent boolean not null default false,
  consent_text text,
  ip_hash text,
  created_at timestamptz not null default now()
);
create unique index if not exists mf_waitlist_email_key on mf_waitlist (lower(email));
create index if not exists mf_waitlist_ip_idx on mf_waitlist (ip_hash, created_at);
alter table mf_waitlist enable row level security;

-- S4: limit zgłoszeń odstąpienia liczony w bazie (adres, IP, globalnie).
alter table mf_withdrawals add column if not exists ip_hash text;
create index if not exists mf_withdrawals_rate_idx on mf_withdrawals (created_at);

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    execute 'grant select, insert on mf_waitlist to mf_app';
    execute 'grant usage on sequence mf_waitlist_id_seq to mf_app';
    if not exists (select 1 from pg_policies where tablename = 'mf_waitlist' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on mf_waitlist for all to mf_app using (true) with check (true)';
    end if;
  end if;
end $$;
