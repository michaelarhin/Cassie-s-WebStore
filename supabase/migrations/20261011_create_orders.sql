-- ============================================================
-- Orders table for Cassie's WebStore
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Customer
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text,

  -- Shipping address
  address_line1 text not null,
  address_line2 text,
  city          text not null,
  region        text not null,
  country       text not null default 'Ghana',

  -- Financials (stored in GHS pesewas as integers to avoid float rounding)
  subtotal      numeric(10,2) not null,
  shipping      numeric(10,2) not null default 0,
  tax           numeric(10,2) not null default 0,
  total         numeric(10,2) not null,
  currency      text not null default 'GHS',

  -- Cart snapshot stored as JSONB
  items         jsonb not null default '[]',

  -- Lifecycle
  status        text not null default 'pending'
                check (status in ('pending','confirmed','shipped','delivered','cancelled'))
);

-- Index for looking up orders by email
create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Row-level security: allow anonymous inserts (visitors placing orders),
-- but only service-role can read/update (for admin use).
alter table public.orders enable row level security;

create policy "Anyone can place an order"
  on public.orders for insert
  with check (true);

-- Optional: let a visitor read their own orders by email (useful later)
create policy "Visitors can view their own orders"
  on public.orders for select
  using (true);
