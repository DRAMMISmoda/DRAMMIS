-- Credenziali passkey (Face ID/Touch ID) e sfide temporanee di login/registrazione.
-- Queste tabelle vengono lette/scritte SOLO dalle Edge Function webauthn-register e
-- webauthn-auth tramite la service role key: RLS è attiva ma senza policy, quindi
-- né la anon key né gli utenti loggati possono leggerle o scriverle direttamente.

create table if not exists webauthn_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  credential_id text not null unique,
  public_key text not null,
  counter bigint not null default 0,
  device_label text,
  created_at timestamptz not null default now()
);
create index if not exists webauthn_credentials_user_idx on webauthn_credentials (user_id);
alter table webauthn_credentials enable row level security;

create table if not exists webauthn_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  challenge text not null,
  created_at timestamptz not null default now()
);
alter table webauthn_challenges enable row level security;
