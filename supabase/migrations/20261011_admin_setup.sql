-- ============================================================
-- Admin setup for Cassie's WebStore
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Products table (admin-managed, replaces static data)
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  name          text not null,
  slug          text not null unique,
  category      text not null,
  price         numeric(10,2) not null,
  color         text not null default '',
  description   text not null default '',
  details       text[] not null default '{}',
  sizes         text[] not null default '{}',
  image_url     text not null default '',
  featured      boolean not null default false,
  store         text not null default 'aura' check (store in ('aura','confetti')),
  active        boolean not null default true
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_store_idx    on public.products (store);
create index if not exists products_slug_idx     on public.products (slug);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 2. RLS on products
alter table public.products enable row level security;

-- Anyone can read active products
create policy "Public can read active products"
  on public.products for select
  using (active = true);

-- Only authenticated admin can insert/update/delete
create policy "Admin can insert products"
  on public.products for insert
  to authenticated with check (true);

create policy "Admin can update products"
  on public.products for update
  to authenticated using (true);

create policy "Admin can delete products"
  on public.products for delete
  to authenticated using (true);

-- 3. RLS update on orders — admin can read all orders
create policy "Admin can read all orders"
  on public.orders for select
  to authenticated
  using (true);

create policy "Admin can update order status"
  on public.orders for update
  to authenticated
  using (true);

-- 4. Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public read of product images
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated admin to upload
create policy "Admin can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Admin can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
