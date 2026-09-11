-- Marketplace listings (COD gear buy/sell)
-- Run in Supabase SQL Editor after 001–004.

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title_ms text not null,
  title_en text not null,
  title_zh text not null,
  description_ms text not null default '',
  description_en text not null default '',
  description_zh text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  condition text not null check (condition in ('new', 'used')),
  state_id text not null,
  district_id text not null,
  image_url text not null default '',
  whatsapp text not null,
  seller_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_listings_state_district_idx
  on public.marketplace_listings (state_id, district_id);
create index if not exists marketplace_listings_created_at_idx
  on public.marketplace_listings (created_at desc);

alter table public.marketplace_listings enable row level security;

drop policy if exists "marketplace_listings_public_read" on public.marketplace_listings;
create policy "marketplace_listings_public_read"
  on public.marketplace_listings for select
  using (true);

drop policy if exists "marketplace_listings_insert_own" on public.marketplace_listings;
create policy "marketplace_listings_insert_own"
  on public.marketplace_listings for insert
  with check (author_id = auth.uid());

drop policy if exists "marketplace_listings_update_own" on public.marketplace_listings;
create policy "marketplace_listings_update_own"
  on public.marketplace_listings for update
  using (author_id = auth.uid());

drop policy if exists "marketplace_listings_delete_own" on public.marketplace_listings;
create policy "marketplace_listings_delete_own"
  on public.marketplace_listings for delete
  using (author_id = auth.uid());

-- ── Storage: listing-photos bucket ──
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "listing_photos_storage_public_read" on storage.objects;
create policy "listing_photos_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

drop policy if exists "listing_photos_storage_auth_insert" on storage.objects;
create policy "listing_photos_storage_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "listing_photos_storage_auth_delete" on storage.objects;
create policy "listing_photos_storage_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
