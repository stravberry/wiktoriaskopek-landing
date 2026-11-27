-- Panel admina: prawa roli aplikacji (mf_app), polityki RLS, blokada TRUNCATE dziennika,
-- wersja sesji do unieważniania (wylogowanie kasuje wszystkie wydane sesje). Przegląd Security Reviewer, PR #43 (H1, L2, L5).
alter table adm_users add column if not exists session_version integer not null default 1;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    grant select, insert, update, delete on adm_login_tokens to mf_app;
    grant select, insert on adm_audit to mf_app;
    grant usage on sequence adm_audit_id_seq to mf_app;
    grant select on adm_users to mf_app;
    grant update (session_version) on adm_users to mf_app;
    grant select (created_at, marketing_consent) on mf_trials to mf_app;
    drop policy if exists mf_app_all on adm_login_tokens;
    create policy mf_app_all on adm_login_tokens for all to mf_app using (true) with check (true);
    drop policy if exists mf_app_read on adm_audit;
    create policy mf_app_read on adm_audit for select to mf_app using (true);
    drop policy if exists mf_app_add on adm_audit;
    create policy mf_app_add on adm_audit for insert to mf_app with check (true);
    drop policy if exists mf_app_read on adm_users;
    create policy mf_app_read on adm_users for select to mf_app using (true);
    drop policy if exists mf_app_version on adm_users;
    create policy mf_app_version on adm_users for update to mf_app using (true) with check (true);
  end if;
end $$;

drop trigger if exists adm_audit_no_truncate on adm_audit;
create trigger adm_audit_no_truncate before truncate on adm_audit
  for each statement execute function adm_audit_append_only();
