-- Public details confirmed by a pond operator. Existing imports remain unverified.
alter table public.spots
  add column if not exists verified_opening_hours text not null default '',
  add column if not exists verified_fees text not null default '',
  add column if not exists verified_rules text not null default '',
  add column if not exists owner_verified_at timestamptz;

