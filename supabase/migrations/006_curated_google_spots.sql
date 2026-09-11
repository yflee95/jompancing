-- Curated fishing spots seeded from Google Places (run seed script after this)

alter table public.spots
  add column if not exists google_place_id text,
  add column if not exists source text not null default 'ugc'
    check (source in ('ugc', 'google')),
  add column if not exists is_curated boolean not null default false,
  add column if not exists google_photo_attribution text;

create unique index if not exists spots_google_place_id_idx
  on public.spots (google_place_id)
  where google_place_id is not null;

create index if not exists spots_curated_district_idx
  on public.spots (state_id, district_id, is_curated);

comment on column public.spots.google_place_id is 'Google Places ID for curated spots';
comment on column public.spots.source is 'ugc = user posted, google = Places seed';
comment on column public.spots.is_curated is 'True for Google-seeded community spots';
