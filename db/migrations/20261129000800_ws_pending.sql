-- Szybki most: lokalny poller na Macu (bez modelu) co kilka sekund pyta, czy w kolejce czeka polecenie z panelu,
-- i wtedy od razu uruchamia rutynę synchronizacji. Zwraca tylko liczbę, nic nie zmienia poza last_seen workera.
create or replace function ws_commands_pending(p_token text) returns int language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  perform public.ws_worker_check(p_token);
  select count(*) into n from public.ws_commands where status = 'pending' and expires_at > now();
  return n;
end $$;
revoke all on function ws_commands_pending(text) from public, authenticated;
grant execute on function ws_commands_pending(text) to anon;
