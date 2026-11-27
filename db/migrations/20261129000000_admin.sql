-- Panel admina (/admin), etap 1: logowanie linkiem z maila i audit log.
-- Tabele tylko dla serwera (DATABASE_URL); RLS bez polityk = anon i authenticated nie widzą nic.
create table if not exists adm_login_tokens (
  token_hash text primary key,
  email text not null,
  ip_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);
create index if not exists adm_login_tokens_email_idx on adm_login_tokens (email, created_at desc);

create table if not exists adm_audit (
  id bigserial primary key,
  ts timestamptz not null default now(),
  actor text,
  action text not null,
  ok boolean not null default true,
  ip_hash text,
  detail jsonb not null default '{}'::jsonb
);
create index if not exists adm_audit_ts_idx on adm_audit (ts desc);

alter table adm_login_tokens enable row level security;
alter table adm_audit enable row level security;
revoke all on adm_login_tokens, adm_audit from anon, authenticated;

-- Audit tylko do dopisywania: zmiana i kasowanie wpisu są blokowane w bazie.
create or replace function adm_audit_append_only() returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'adm_audit: tylko dopisywanie';
end $$;
drop trigger if exists adm_audit_append_only on adm_audit;
create trigger adm_audit_append_only before update or delete on adm_audit
  for each row execute function adm_audit_append_only();
