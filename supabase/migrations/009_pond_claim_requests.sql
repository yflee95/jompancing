-- Private inbound leads from pond operators. Run in Supabase SQL Editor.
create table if not exists public.pond_claim_requests (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references public.spots (id) on delete set null,
  claimant_name text not null check (char_length(claimant_name) between 2 and 100),
  business_name text not null check (char_length(business_name) between 2 and 160),
  business_location text not null check (char_length(business_location) between 5 and 300),
  relationship text not null check (char_length(relationship) between 2 and 80),
  contact text not null check (char_length(contact) between 5 and 160),
  website text not null default '' check (char_length(website) <= 300),
  message text not null default '' check (char_length(message) <= 1200),
  lead_status text not null default 'new'
    check (lead_status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pond_claim_requests_status_created_idx
  on public.pond_claim_requests (lead_status, created_at desc);
create index if not exists pond_claim_requests_spot_idx
  on public.pond_claim_requests (spot_id, created_at desc);

alter table public.pond_claim_requests enable row level security;
revoke all on public.pond_claim_requests from anon, authenticated;
grant select, insert, update on public.pond_claim_requests to service_role;
