-- ============================================================
-- Add variants (colour + stock) to products table
-- Add sales summary view
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Add variants column to products (JSONB array of ColorVariant)
alter table public.products
  add column if not exists variants jsonb not null default '[]';

-- Example variants structure stored per product:
-- [
--   { "name": "Ivory Cream", "hex": "#f5f0e8", "stock": { "XS": 3, "S": 5, "M": 4 } },
--   { "name": "Espresso",    "hex": "#3b2314", "stock": { "XS": 2, "S": 3, "M": 3 } }
-- ]

-- 2. Sales summary view — aggregates completed orders
create or replace view public.sales_summary as
select
  date_trunc('day', created_at)  as sale_date,
  count(*)                        as order_count,
  sum(total)                      as revenue,
  sum(subtotal)                   as subtotal,
  avg(total)                      as avg_order_value,
  currency
from public.orders
where status != 'cancelled'
group by date_trunc('day', created_at), currency
order by sale_date desc;

-- 3. All-time totals view
create or replace view public.sales_totals as
select
  count(*)          as total_orders,
  count(*) filter (where status = 'pending')   as pending,
  count(*) filter (where status = 'confirmed') as confirmed,
  count(*) filter (where status = 'shipped')   as shipped,
  count(*) filter (where status = 'delivered') as delivered,
  count(*) filter (where status = 'cancelled') as cancelled,
  sum(total) filter (where status != 'cancelled') as total_revenue,
  currency
from public.orders
group by currency;
