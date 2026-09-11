-- Activities + 2-day free promotion trial
-- Run in Supabase SQL Editor after 001_initial.sql

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title_ms text not null,
  title_en text not null,
  title_zh text not null,
  description_ms text not null default '',
  description_en text not null default '',
  description_zh text not null default '',
  type text not null check (type in ('contest', 'sale', 'workshop', 'meetup')),
  state_id text not null,
  district_id text not null,
  venue_ms text not null,
  venue_en text not null,
  venue_zh text not null,
  organizer text not null,
  verified boolean not null default false,
  fee numeric(10, 2),
  start_date timestamptz not null,
  end_date timestamptz not null,
  image_url text not null default '',
  promoted boolean not null default false,
  promoted_until timestamptz,
  promotion_free_trial_used boolean not null default false,
  view_count integer not null default 0,
  interest_count integer not null default 0,
  contact_whatsapp text,
  created_at timestamptz not null default now()
);

create index if not exists activities_state_district_idx
  on public.activities (state_id, district_id);
create index if not exists activities_promoted_until_idx
  on public.activities (promoted_until desc nulls last);
create index if not exists activities_start_date_idx
  on public.activities (start_date);

alter table public.activities enable row level security;

drop policy if exists "activities_public_read" on public.activities;
create policy "activities_public_read"
  on public.activities for select
  using (true);

drop policy if exists "activities_insert_own" on public.activities;
create policy "activities_insert_own"
  on public.activities for insert
  with check (author_id = auth.uid());

drop policy if exists "activities_update_own" on public.activities;
create policy "activities_update_own"
  on public.activities for update
  using (author_id = auth.uid());
