-- Przegląd bezpieczeństwa 26.11.
-- S3: treść płatnego poradnika w bazie (mf_content, klucz "poradnik"), nie w publicznym repo. Treść wgrywa się osobno, poza repo.
create table if not exists mf_content (key text primary key, body jsonb not null, updated_at timestamptz not null default now());
alter table mf_content enable row level security;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    execute 'grant select on mf_content to mf_app';
    if not exists (select 1 from pg_policies where tablename = 'mf_content' and policyname = 'mf_app_read') then
      execute 'create policy mf_app_read on mf_content for select to mf_app using (true)';
    end if;
  end if;
end $$;

-- Utwardzenie: sklep używa roli mf_app, Edge Function service_role; anon/authenticated bez dostępu.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from anon, authenticated, public;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from anon, authenticated, public;
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated, public;
-- Dziennik zgód: aplikacja tylko dopisuje i czyta.
revoke update on consent_events from mf_app;
