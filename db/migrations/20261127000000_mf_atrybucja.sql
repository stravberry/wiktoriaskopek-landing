-- MontageFrames, 0f (audyt Ecom 2, pkt 4): źródło wejścia (UTM, first-touch) przez całą ścieżkę landing → próba → mail → zakup.
-- Klucz to skrót e-maila (sha256), bez adresu. Pierwsze źródło zostaje (first-touch). Idempotentne.
create table if not exists mf_attribution (
  email_hash text primary key,
  utm        jsonb not null default '{}'::jsonb check (length(utm::text) <= 2000),
  trial_id   text,
  trial_at   timestamptz,
  created_at timestamptz not null default now()
);
alter table mf_attribution enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    execute 'grant select, insert, update, delete on mf_attribution to mf_app';
    if not exists (select 1 from pg_policies where tablename = 'mf_attribution' and policyname = 'mf_app_all') then
      execute 'create policy mf_app_all on mf_attribution for all to mf_app using (true) with check (true)';
    end if;
  end if;
end $$;

-- Tygodniowy lejek (audyt Ecom 2, pkt 12): tydzień × kampania × urządzenie. Zakupy z próby = purchase_completed z trial_id.
create or replace view mf_funnel_weekly as
select
  date_trunc('week', ts)::date                       as week,
  coalesce(props->>'utm_campaign', '(brak)')          as campaign,
  coalesce(props->>'device', '(serwer)')              as device,
  count(*) filter (where event = 'landing_view')           as views,
  count(*) filter (where event = 'buy_click')              as buy_clicks,
  count(*) filter (where event = 'trial_click')            as trial_clicks,
  count(*) filter (where event = 'trial_upload_completed') as trial_uploads,
  count(*) filter (where event = 'trial_render_completed') as trial_renders_ok,
  count(*) filter (where event = 'trial_render_failed')    as trial_renders_failed,
  count(*) filter (where event = 'trial_preview_viewed')   as trial_previews,
  count(*) filter (where event = 'checkout_started')       as checkouts,
  count(*) filter (where event = 'purchase_completed' and props ? 'trial_id')     as purchases_after_trial,
  count(*) filter (where event = 'purchase_completed' and not props ? 'trial_id') as purchases_direct,
  coalesce(sum((props->>'amount')::int) filter (where event = 'purchase_completed'), 0) as revenue_grosze
from mf_events
group by 1, 2, 3;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'mf_app') then
    execute 'grant select on mf_funnel_weekly to mf_app';
  end if;
end $$;

-- Widok liczy z uprawnieniami pytającego (RLS mf_events działa), bez dostępu dla ról publicznych Supabase.
alter view mf_funnel_weekly set (security_invoker = true);
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on mf_funnel_weekly from anon, authenticated';
    execute 'revoke all on mf_attribution from anon, authenticated';
  end if;
end $$;
