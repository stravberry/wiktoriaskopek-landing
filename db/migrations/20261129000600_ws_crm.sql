-- Panel admina E7c: klienci w CRM i indeks Dysku Google (Mój dysk / Wspólny dysk MAC / KLIENCI, dwa poziomy).
-- Indeks wkłada most na Macu (Composio): nazwy, typy, daty i linki, bez treści plików. Przypisania robi Wiktoria w panelu;
-- nic nie zmienia uprawnień na Dysku.
create table if not exists ws_drive (
  id text primary key, parent_id text, name text not null, mime text, modified_at timestamptz, link text, depth int not null default 1,
  synced_at timestamptz not null default now());
create index if not exists ws_drive_parent_idx on ws_drive (parent_id);
create table if not exists ws_clients (
  id uuid primary key default gen_random_uuid(), name text not null check (length(name) between 1 and 200),
  email text check (email is null or length(email) <= 200), phone text check (phone is null or length(phone) <= 40),
  stage text not null default 'aktywny' check (stage in ('lead', 'oferta', 'aktywny', 'wstrzymany', 'zakonczony')),
  note text check (note is null or length(note) <= 4000), drive_folder_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create unique index if not exists ws_clients_folder_uidx on ws_clients (drive_folder_id) where drive_folder_id is not null;
create table if not exists ws_client_items (
  client_id uuid not null references ws_clients (id) on delete cascade, drive_id text not null, added_at timestamptz not null default now(),
  primary key (client_id, drive_id));

alter table ws_drive enable row level security;
alter table ws_clients enable row level security;
alter table ws_client_items enable row level security;
revoke all on ws_drive, ws_clients, ws_client_items from anon, authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    grant select on ws_drive to mf_app;
    grant select, insert, update on ws_clients to mf_app;
    grant select, insert, delete on ws_client_items to mf_app;
    drop policy if exists mf_app_read on ws_drive; create policy mf_app_read on ws_drive for select to mf_app using (true);
    drop policy if exists mf_app_all on ws_clients; create policy mf_app_all on ws_clients for all to mf_app using (true) with check (true);
    drop policy if exists mf_app_all on ws_client_items; create policy mf_app_all on ws_client_items for all to mf_app using (true) with check (true);
  end if;
end $$;

-- Indeks Dysku: zastępuje cały stan (usuwa to, czego już nie ma).
create or replace function ws_drive_push(p_token text, p_items jsonb) returns int language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 5000 then raise exception 'ws_bad_items'; end if;
  delete from public.ws_drive where id not in (select x->>'id' from jsonb_array_elements(p_items) x where x->>'id' is not null);
  insert into public.ws_drive (id, parent_id, name, mime, modified_at, link, depth, synced_at)
    select x->>'id', x->>'parent_id', left(coalesce(x->>'name', '(bez nazwy)'), 300), left(x->>'mime', 100), (x->>'modified_at')::timestamptz,
           left(x->>'link', 600), coalesce((x->>'depth')::int, 1), now()
    from jsonb_array_elements(p_items) x where x->>'id' is not null
    on conflict (id) do update set parent_id = excluded.parent_id, name = excluded.name, mime = excluded.mime, modified_at = excluded.modified_at,
      link = excluded.link, depth = excluded.depth, synced_at = now();
  insert into public.ws_sync (source, last_ok, last_error, items) values ('drive', now(), null, jsonb_array_length(p_items))
    on conflict (source) do update set last_ok = now(), last_error = null, items = excluded.items;
  return jsonb_array_length(p_items);
end $$;

create or replace function ws_sync_error(p_token text, p_source text, p_error text) returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  if p_source not in ('calendar', 'tasks', 'clickup', 'drive', 'worker') then raise exception 'ws_bad_source'; end if;
  insert into public.ws_sync (source, last_error, last_error_at) values (p_source, left(p_error, 300), now())
    on conflict (source) do update set last_error = excluded.last_error, last_error_at = now();
end $$;

revoke all on function ws_drive_push(text, jsonb) from public, authenticated;
grant execute on function ws_drive_push(text, jsonb) to anon;
