-- Poprawki po przeglądzie Security Reviewer PR #54 (M1, L3, L4, L5) i utwardzenie kolejki. Idempotentne.
-- M1: polecenie z panelu ma tylko dozwolony kształt (sync_now bez danych, task_* z dwoma identyfikatorami).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ws_commands_payload_check') then
    alter table ws_commands add constraint ws_commands_payload_check check (coalesce(
      (kind = 'sync_now' and payload = '{}'::jsonb) or
      (kind <> 'sync_now' and payload - 'task_id' - 'list_id' = '{}'::jsonb
       and payload->>'task_id' ~ '^[A-Za-z0-9_=-]{1,200}$' and payload->>'list_id' ~ '^[A-Za-z0-9_=-]{1,200}$'), false));
  end if;
end $$;
-- Jedno polecenie danego rodzaju na zadanie naraz (zamiast sprawdź-potem-wstaw w trasie).
create unique index if not exists ws_commands_active_uidx on ws_commands (kind, (coalesce(payload->>'task_id', ''))) where status in ('pending', 'running');

-- L4 (NULL kasował tabelę), L5 (tylko linki Google Calendar i ClickUp), element bez id nie blokuje kasowania.
create or replace function ws_sync_push(p_token text, p_source text, p_items jsonb) returns int language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  if coalesce(jsonb_typeof(p_items), '') <> 'array' or jsonb_array_length(p_items) > 3000 then raise exception 'ws_bad_items'; end if;
  if p_source = 'calendar' then
    delete from public.ws_calendar where id not in (select x->>'id' from jsonb_array_elements(p_items) x where x->>'id' is not null);
    insert into public.ws_calendar (id, calendar, title, starts_at, ends_at, all_day, link, location, synced_at)
      select x->>'id', coalesce(x->>'calendar', 'primary'), left(x->>'title', 300), (x->>'starts_at')::timestamptz, (x->>'ends_at')::timestamptz,
             coalesce((x->>'all_day')::boolean, false),
             case when x->>'link' ~ '^https://www\.google\.com/calendar/' then left(x->>'link', 600) end, left(x->>'location', 300), now()
      from jsonb_array_elements(p_items) x where x->>'id' is not null
      on conflict (id) do update set calendar = excluded.calendar, title = excluded.title, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
        all_day = excluded.all_day, link = excluded.link, location = excluded.location, synced_at = now();
  elsif p_source = 'tasks' then
    delete from public.ws_tasks where id not in (select x->>'id' from jsonb_array_elements(p_items) x where x->>'id' is not null);
    insert into public.ws_tasks (id, list_id, list_title, title, due, done, completed_at, position, synced_at)
      select x->>'id', x->>'list_id', left(x->>'list_title', 200), left(x->>'title', 500), (x->>'due')::date, coalesce((x->>'done')::boolean, false),
             (x->>'completed_at')::timestamptz, x->>'position', now()
      from jsonb_array_elements(p_items) x where x->>'id' is not null and x->>'list_id' is not null
      on conflict (id) do update set list_id = excluded.list_id, list_title = excluded.list_title, title = excluded.title, due = excluded.due,
        done = excluded.done, completed_at = excluded.completed_at, position = excluded.position, synced_at = now();
  elsif p_source = 'clickup' then
    delete from public.ws_clickup where id not in (select x->>'id' from jsonb_array_elements(p_items) x where x->>'id' is not null);
    insert into public.ws_clickup (id, team, name, status, due, starts_at, list_name, folder_name, url, priority, parent, synced_at)
      select x->>'id', left(x->>'team', 100), left(x->>'name', 500), left(x->>'status', 60), (x->>'due')::timestamptz, (x->>'starts_at')::timestamptz,
             left(x->>'list_name', 200), left(x->>'folder_name', 200),
             case when x->>'url' ~ '^https://app\.clickup\.com/' then left(x->>'url', 300) end, left(x->>'priority', 20), x->>'parent', now()
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

create or replace function ws_drive_push(p_token text, p_items jsonb) returns int language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  if coalesce(jsonb_typeof(p_items), '') <> 'array' or jsonb_array_length(p_items) > 5000 then raise exception 'ws_bad_items'; end if;
  delete from public.ws_drive where id not in (select x->>'id' from jsonb_array_elements(p_items) x where x->>'id' is not null);
  insert into public.ws_drive (id, parent_id, name, mime, modified_at, link, depth, synced_at)
    select x->>'id', x->>'parent_id', left(coalesce(x->>'name', '(bez nazwy)'), 300), left(x->>'mime', 100), (x->>'modified_at')::timestamptz,
           case when x->>'link' ~ '^https://(drive|docs)\.google\.com/' then left(x->>'link', 600) end, coalesce((x->>'depth')::int, 1), now()
    from jsonb_array_elements(p_items) x where x->>'id' is not null
    on conflict (id) do update set parent_id = excluded.parent_id, name = excluded.name, mime = excluded.mime, modified_at = excluded.modified_at,
      link = excluded.link, depth = excluded.depth, synced_at = now();
  insert into public.ws_sync (source, last_ok, last_error, items) values ('drive', now(), null, jsonb_array_length(p_items))
    on conflict (source) do update set last_ok = now(), last_error = null, items = excluded.items;
  return jsonb_array_length(p_items);
end $$;

-- L3: kopia zadania zmienia się tylko, gdy polecenie naprawdę było w toku.
create or replace function ws_command_done(p_token text, p_id uuid, p_ok boolean, p_result jsonb) returns void language plpgsql security definer set search_path = '' as $$
begin
  perform public.ws_worker_check(p_token);
  update public.ws_commands set status = case when p_ok then 'done' else 'failed' end, done_at = now(), result = p_result
    where id = p_id and status = 'running';
  if not found then return; end if;
  if p_ok then
    update public.ws_tasks t set done = (c.kind = 'task_complete'), completed_at = case when c.kind = 'task_complete' then now() end
      from public.ws_commands c where c.id = p_id and c.kind in ('task_complete', 'task_reopen') and t.id = c.payload->>'task_id';
  end if;
end $$;

-- Linki zapisane przed poprawką L5: zostawiamy tylko poprawne domeny.
update ws_calendar set link = null where link is not null and link !~ '^https://www\.google\.com/calendar/';
update ws_clickup set url = null where url is not null and url !~ '^https://app\.clickup\.com/';
update ws_drive set link = null where link is not null and link !~ '^https://(drive|docs)\.google\.com/';
