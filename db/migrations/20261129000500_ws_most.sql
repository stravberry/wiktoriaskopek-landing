-- Panel admina E7a/E7b: most przez Maca. Rutyna na Macu (Composio) wkłada kopię Kalendarza, Google Tasks i ClickUp
-- i wykonuje polecenia z panelu (kolejka). Worker woła tylko funkcje poniżej, z tokenem; w bazie jest tylko jego skrót.
-- Do Supabase trafiają tytuły, terminy i linki. Bez opisów spotkań i zadań.
create table if not exists ws_workers (token_hash text primary key, name text not null, created_at timestamptz not null default now(), last_seen timestamptz);
create table if not exists ws_calendar (
  id text primary key, calendar text not null default 'primary', title text, starts_at timestamptz, ends_at timestamptz,
  all_day boolean not null default false, link text, location text, synced_at timestamptz not null default now());
create table if not exists ws_tasks (
  id text primary key, list_id text not null, list_title text, title text, due date, done boolean not null default false,
  completed_at timestamptz, position text, synced_at timestamptz not null default now());
create table if not exists ws_clickup (
  id text primary key, team text, name text, status text, due timestamptz, starts_at timestamptz, list_name text, folder_name text,
  url text, priority text, parent text, synced_at timestamptz not null default now());
create table if not exists ws_sync (source text primary key, last_ok timestamptz, last_error text, last_error_at timestamptz, items int);
create table if not exists ws_commands (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('task_complete', 'task_reopen', 'sync_now')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'running', 'done', 'failed', 'expired')),
  created_by text, created_at timestamptz not null default now(), expires_at timestamptz not null default now() + interval '30 minutes',
  claimed_at timestamptz, done_at timestamptz, result jsonb);
create index if not exists ws_commands_pending_idx on ws_commands (status, created_at);

alter table ws_workers enable row level security;
alter table ws_calendar enable row level security;
alter table ws_tasks enable row level security;
alter table ws_clickup enable row level security;
alter table ws_sync enable row level security;
alter table ws_commands enable row level security;
revoke all on ws_workers, ws_calendar, ws_tasks, ws_clickup, ws_sync, ws_commands from anon, authenticated;

-- Panel (mf_app): odczyt kopii i kolejki, dopisanie polecenia (tylko pending).
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    grant select on ws_calendar, ws_tasks, ws_clickup, ws_sync, ws_commands to mf_app;
    grant insert (kind, payload, created_by) on ws_commands to mf_app;
    drop policy if exists mf_app_read on ws_calendar; create policy mf_app_read on ws_calendar for select to mf_app using (true);
    drop policy if exists mf_app_read on ws_tasks; create policy mf_app_read on ws_tasks for select to mf_app using (true);
    drop policy if exists mf_app_read on ws_clickup; create policy mf_app_read on ws_clickup for select to mf_app using (true);
    drop policy if exists mf_app_read on ws_sync; create policy mf_app_read on ws_sync for select to mf_app using (true);
    drop policy if exists mf_app_read on ws_commands; create policy mf_app_read on ws_commands for select to mf_app using (true);
    drop policy if exists mf_app_add on ws_commands; create policy mf_app_add on ws_commands for insert to mf_app with check (status = 'pending');
  end if;
end $$;

create or replace function ws_worker_check(p_token text) returns boolean language plpgsql security definer set search_path = '' as $$
declare ok boolean;
begin
  update public.ws_workers set last_seen = now()
    where token_hash = encode(extensions.digest(coalesce(p_token, ''), 'sha256'), 'hex') returning true into ok;
  if ok is null then raise exception 'ws_bad_token'; end if;
  return true;
end $$;

-- Kopia źródła: zastępuje cały stan źródła (usuwa to, czego już nie ma w oknie synchronizacji).
create or replace function ws_sync_push(p_token text, p_source text, p_items jsonb) returns int language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 3000 then raise exception 'ws_bad_items'; end if;
  if p_source = 'calendar' then
    delete from public.ws_calendar where id not in (select x->>'id' from jsonb_array_elements(p_items) x);
    insert into public.ws_calendar (id, calendar, title, starts_at, ends_at, all_day, link, location, synced_at)
      select x->>'id', coalesce(x->>'calendar', 'primary'), left(x->>'title', 300), (x->>'starts_at')::timestamptz, (x->>'ends_at')::timestamptz,
             coalesce((x->>'all_day')::boolean, false), left(x->>'link', 600), left(x->>'location', 300), now()
      from jsonb_array_elements(p_items) x where x->>'id' is not null
      on conflict (id) do update set calendar = excluded.calendar, title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
        all_day = excluded.all_day, link = excluded.link, location = excluded.location, synced_at = now();
  elsif p_source = 'tasks' then
    delete from public.ws_tasks where id not in (select x->>'id' from jsonb_array_elements(p_items) x);
    insert into public.ws_tasks (id, list_id, list_title, title, due, done, completed_at, position, synced_at)
      select x->>'id', x->>'list_id', left(x->>'list_title', 200), left(x->>'title', 500), (x->>'due')::date, coalesce((x->>'done')::boolean, false),
             (x->>'completed_at')::timestamptz, x->>'position', now()
      from jsonb_array_elements(p_items) x where x->>'id' is not null and x->>'list_id' is not null
      on conflict (id) do update set list_id = excluded.list_id, list_title = excluded.list_title, title = excluded.title, due = excluded.due,
        done = excluded.done, completed_at = excluded.completed_at, position = excluded.position, synced_at = now();
  elsif p_source = 'clickup' then
    delete from public.ws_clickup where id not in (select x->>'id' from jsonb_array_elements(p_items) x);
    insert into public.ws_clickup (id, team, name, status, due, starts_at, list_name, folder_name, url, priority, parent, synced_at)
      select x->>'id', left(x->>'team', 100), left(x->>'name', 500), left(x->>'status', 60), (x->>'due')::timestamptz, (x->>'starts_at')::timestamptz,
             left(x->>'list_name', 200), left(x->>'folder_name', 200), left(x->>'url', 300), left(x->>'priority', 20), x->>'parent', now()
      from jsonb_array_elements(p_items) x where x->>'id' is not null
      on conflict (id) do update set team = excluded.team, name = excluded.name, status = excluded.status, due = excluded.due, starts_at = excluded.starts_at,
        list_name = excluded.list_name, folder_name = excluded.folder_name, url = excluded.url, priority = excluded.priority, parent = excluded.parent, synced_at = now();
  else
    raise exception 'ws_bad_source';
  end if;
  insert into public.ws_sync (source, last_ok, last_error, items) values (p_source, now(), null, jsonb_array_length(p_items))
    on conflict (source) do update set last_ok = now(), last_error = null, items = excluded.items;
  return jsonb_array_length(p_items);
end $$;

create or replace function ws_sync_error(p_token text, p_source text, p_error text) returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  if p_source not in ('calendar', 'tasks', 'clickup', 'worker') then raise exception 'ws_bad_source'; end if;
  insert into public.ws_sync (source, last_error, last_error_at) values (p_source, left(p_error, 300), now())
    on conflict (source) do update set last_error = excluded.last_error, last_error_at = now();
end $$;

-- Polecenia: wygasłe oznacza, świeże oddaje workerowi (najwyżej 10 naraz). Zawieszone w „running” ponad 30 min wracają jako failed.
create or replace function ws_commands_claim(p_token text) returns table (id uuid, kind text, payload jsonb) language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  update public.ws_commands c set status = 'expired', done_at = now() where c.status = 'pending' and c.expires_at < now();
  update public.ws_commands c set status = 'failed', done_at = now(), result = '{"error":"timeout"}' where c.status = 'running' and c.claimed_at < now() - interval '30 minutes';
  return query
    update public.ws_commands c set status = 'running', claimed_at = now()
    where c.id in (select c2.id from public.ws_commands c2 where c2.status = 'pending' order by c2.created_at limit 10 for update skip locked)
    returning c.id, c.kind, c.payload;
end $$;

create or replace function ws_command_done(p_token text, p_id uuid, p_ok boolean, p_result jsonb) returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  update public.ws_commands set status = case when p_ok then 'done' else 'failed' end, done_at = now(), result = p_result
    where id = p_id and status = 'running';
  -- Odhaczenie od razu widać w kopii, bez czekania na kolejną synchronizację.
  if p_ok then
    update public.ws_tasks t set done = (c.kind = 'task_complete'), completed_at = case when c.kind = 'task_complete' then now() end
      from public.ws_commands c where c.id = p_id and c.kind in ('task_complete', 'task_reopen') and t.id = c.payload->>'task_id';
  end if;
end $$;

revoke all on function ws_worker_check(text), ws_sync_push(text, text, jsonb), ws_sync_error(text, text, text), ws_commands_claim(text), ws_command_done(text, uuid, boolean, jsonb) from public;
grant execute on function ws_sync_push(text, text, jsonb), ws_sync_error(text, text, text), ws_commands_claim(text), ws_command_done(text, uuid, boolean, jsonb) to anon;
-- Supabase nadaje domyślnie EXECUTE rolom anon i authenticated; zostaje tylko anon dla czterech funkcji workera.
revoke all on function ws_worker_check(text) from anon, authenticated;
revoke all on function ws_sync_push(text, text, jsonb), ws_sync_error(text, text, text), ws_commands_claim(text), ws_command_done(text, uuid, boolean, jsonb) from authenticated;
