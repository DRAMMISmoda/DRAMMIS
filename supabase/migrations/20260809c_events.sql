create table if not exists events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('page_view', 'product_view', 'add_to_cart')),
  page text,
  product_id text,
  product_name text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists events_type_created_idx on events (type, created_at desc);

alter table events enable row level security;

-- anyone (including anonymous shoppers) can log an event — same pattern
-- already used for the newsletter_subscribers insert in script.js
create policy "events_insert_public" on events
  for insert
  with check (true);

-- only the admin can read the raw event log
create policy "events_select_admin" on events
  for select
  using (is_admin());
