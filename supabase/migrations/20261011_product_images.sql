-- Add images array to products table
-- Run in: Supabase Dashboard → SQL Editor → New query

alter table public.products
  add column if not exists images text[] not null default '{}';

-- Backfill: copy existing image_url into the images array for old products
update public.products
  set images = array[image_url]
  where array_length(images, 1) is null
    and image_url is not null
    and image_url != '';
