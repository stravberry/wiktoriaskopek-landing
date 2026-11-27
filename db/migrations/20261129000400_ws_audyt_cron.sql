-- Cron audytu IG: pg_cron co 10 min woła POST /api/audyt/cron (kolejka, maile do akceptacji, porady, retencja).
-- Sekret powstaje w bazie (Vault), aplikacja zna tylko jego skrót (ws_cron_auth). Idempotentne.
do $$
declare s text;
begin
  if not exists (select 1 from vault.secrets where name = 'audyt_cron') then
    s := encode(extensions.gen_random_bytes(32), 'hex');
    perform vault.create_secret(s, 'audyt_cron', 'Klucz wywołań /api/audyt/cron (pg_cron)');
    insert into ws_cron_auth (name, secret_hash) values ('audyt', encode(extensions.digest(s, 'sha256'), 'hex'))
      on conflict (name) do update set secret_hash = excluded.secret_hash;
  end if;
  if not exists (select 1 from cron.job where jobname = 'audyt-ig') then
    perform cron.schedule('audyt-ig', '*/10 * * * *', $c$
      select net.http_post(
        url := 'https://www.wiktoriaskopek.pl/api/audyt/cron',
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-key', (select decrypted_secret from vault.decrypted_secrets where name = 'audyt_cron')),
        body := '{}'::jsonb,
        timeout_milliseconds := 60000)
    $c$);
  end if;
end $$;
