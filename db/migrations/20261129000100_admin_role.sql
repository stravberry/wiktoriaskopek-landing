-- Panel admina: rola w bazie (druga bramka obok allowlisty ADMIN_EMAILS).
create table if not exists adm_users (
  email text primary key,
  role text not null check (role in ('admin')),
  totp_enabled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table adm_users enable row level security;
revoke all on adm_users from anon, authenticated;
insert into adm_users (email, role) values ('wskopek.all@gmail.com', 'admin') on conflict (email) do nothing;
