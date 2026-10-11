-- Add Paystack payment tracking columns to orders
alter table public.orders
  add column if not exists paystack_reference text,
  add column if not exists paid_at            timestamptz,
  add column if not exists paid_amount        numeric(10,2);

create index if not exists orders_paystack_ref_idx on public.orders (paystack_reference);
