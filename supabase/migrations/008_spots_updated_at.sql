-- Spot updated_at for sitemap lastmod (run once in Supabase SQL Editor)

alter table public.spots
  add column if not exists updated_at timestamptz;

update public.spots
set updated_at = created_at
where updated_at is null;

alter table public.spots
  alter column updated_at set default now(),
  alter column updated_at set not null;

create or replace function public.set_spots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists spots_set_updated_at on public.spots;
create trigger spots_set_updated_at
  before update on public.spots
  for each row
  execute function public.set_spots_updated_at();

create index if not exists spots_updated_at_idx
  on public.spots (updated_at desc);
