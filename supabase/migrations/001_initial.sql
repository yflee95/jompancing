-- Jompancing Phase B — run ONCE in Supabase SQL Editor (new/empty project)
-- Safe on a fresh project: creates tables, RLS, trigger, storage bucket.
-- Supabase may warn about "destructive" ops — see README note below.

-- ── Profiles ──
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  home_state_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Spots (UGC) ──
create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title_ms text not null,
  title_en text not null,
  title_zh text not null,
  description_ms text not null default '',
  description_en text not null default '',
  description_zh text not null default '',
  state_id text not null,
  district_id text not null,
  area_id text not null,
  area_name text,
  lat double precision not null,
  lng double precision not null,
  water_type text not null,
  google_address text not null,
  google_maps_url text not null,
  visibility text not null default 'public'
    check (visibility in ('public', 'private')),
  tags text[] not null default '{}',
  species text[] not null default '{}',
  image_url text not null default '',
  featured boolean not null default false,
  comment_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists spots_state_district_idx
  on public.spots (state_id, district_id);
create index if not exists spots_author_idx on public.spots (author_id);
create index if not exists spots_visibility_idx on public.spots (visibility);
create index if not exists spots_created_at_idx on public.spots (created_at desc);

alter table public.spots enable row level security;

drop policy if exists "spots_read_public_or_own" on public.spots;
create policy "spots_read_public_or_own"
  on public.spots for select
  using (visibility = 'public' or author_id = auth.uid());

drop policy if exists "spots_insert_own" on public.spots;
create policy "spots_insert_own"
  on public.spots for insert
  with check (author_id = auth.uid());

drop policy if exists "spots_update_own" on public.spots;
create policy "spots_update_own"
  on public.spots for update
  using (author_id = auth.uid());

drop policy if exists "spots_delete_own" on public.spots;
create policy "spots_delete_own"
  on public.spots for delete
  using (author_id = auth.uid());

-- ── Spot photos ──
create table if not exists public.spot_photos (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists spot_photos_spot_idx on public.spot_photos (spot_id);

alter table public.spot_photos enable row level security;

drop policy if exists "spot_photos_read_with_spot" on public.spot_photos;
create policy "spot_photos_read_with_spot"
  on public.spot_photos for select
  using (
    exists (
      select 1 from public.spots s
      where s.id = spot_photos.spot_id
        and (s.visibility = 'public' or s.author_id = auth.uid())
    )
  );

drop policy if exists "spot_photos_insert_own_spot" on public.spot_photos;
create policy "spot_photos_insert_own_spot"
  on public.spot_photos for insert
  with check (
    exists (
      select 1 from public.spots s
      where s.id = spot_photos.spot_id and s.author_id = auth.uid()
    )
  );

drop policy if exists "spot_photos_delete_own_spot" on public.spot_photos;
create policy "spot_photos_delete_own_spot"
  on public.spot_photos for delete
  using (
    exists (
      select 1 from public.spots s
      where s.id = spot_photos.spot_id and s.author_id = auth.uid()
    )
  );

-- ── Auto-create profile on signup ──
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Storage: spot-photos bucket ──
insert into storage.buckets (id, name, public)
values ('spot-photos', 'spot-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "spot_photos_storage_public_read" on storage.objects;
create policy "spot_photos_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'spot-photos');

drop policy if exists "spot_photos_storage_auth_insert" on storage.objects;
create policy "spot_photos_storage_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'spot-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "spot_photos_storage_auth_delete" on storage.objects;
create policy "spot_photos_storage_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'spot-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
