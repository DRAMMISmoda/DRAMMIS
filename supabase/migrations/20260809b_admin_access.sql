-- =========================================================
-- 1. ADMINS TABLE — one row per admin user
-- =========================================================
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- a logged-in user may check ONLY their own row (used client-side to decide
-- whether to render the dashboard) — cannot list other admins
create policy "admins_select_self" on admins
  for select
  using (auth.uid() = user_id);
-- deliberately no insert/update/delete policy: admins are only ever added
-- by the site owner via the SQL Editor, never through the app

-- =========================================================
-- 2. is_admin() — reusable check for RLS policies on other tables
--    (SECURITY DEFINER so it bypasses the admins table's own RLS,
--    avoiding any recursive-policy issues)
-- =========================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

grant execute on function is_admin() to anon, authenticated;

-- =========================================================
-- 3. ADMIN READ ACCESS on existing tables
--    (ADDITIVE ONLY — does not touch/replace whatever policies
--    already let checkout INSERT and customers read their own orders)
-- =========================================================
create policy "orders_select_admin" on orders
  for select
  using (is_admin());

create policy "order_items_select_admin" on order_items
  for select
  using (is_admin());

create policy "returns_select_admin" on returns
  for select
  using (is_admin());

create policy "returns_update_admin" on returns
  for update
  using (is_admin())
  with check (is_admin());
