create table if not exists returns (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  email text not null,
  reason text,
  status text not null default 'richiesto',
  created_at timestamptz not null default now()
);

alter table returns enable row level security;
