-- Forum threads + shared thread comments (spot + forum replies)
-- Run in Supabase SQL Editor after 001–003.

-- ── Forum posts ──
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title_ms text not null,
  title_en text not null,
  title_zh text not null,
  body_ms text not null,
  body_en text not null,
  body_zh text not null,
  category text not null
    check (category in ('spots', 'techniques', 'bait', 'hooks', 'fish', 'ornamental', 'general')),
  reply_count integer not null default 0,
  view_count integer not null default 1,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  last_reply_at timestamptz not null default now()
);

create index if not exists forum_posts_category_idx on public.forum_posts (category);
create index if not exists forum_posts_created_at_idx on public.forum_posts (created_at desc);
create index if not exists forum_posts_last_reply_idx on public.forum_posts (last_reply_at desc);

alter table public.forum_posts enable row level security;

drop policy if exists "forum_posts_public_read" on public.forum_posts;
create policy "forum_posts_public_read"
  on public.forum_posts for select
  using (true);

drop policy if exists "forum_posts_insert_own" on public.forum_posts;
create policy "forum_posts_insert_own"
  on public.forum_posts for insert
  with check (author_id = auth.uid());

drop policy if exists "forum_posts_update_own" on public.forum_posts;
create policy "forum_posts_update_own"
  on public.forum_posts for update
  using (author_id = auth.uid());

drop policy if exists "forum_posts_delete_own" on public.forum_posts;
create policy "forum_posts_delete_own"
  on public.forum_posts for delete
  using (author_id = auth.uid());

-- ── Thread comments (spot + forum) ──
create table if not exists public.thread_comments (
  id uuid primary key default gen_random_uuid(),
  thread_type text not null check (thread_type in ('spot', 'forum')),
  thread_id uuid not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body_ms text not null,
  body_en text not null,
  body_zh text not null,
  created_at timestamptz not null default now()
);

create index if not exists thread_comments_thread_idx
  on public.thread_comments (thread_type, thread_id, created_at asc);

alter table public.thread_comments enable row level security;

drop policy if exists "thread_comments_read" on public.thread_comments;
create policy "thread_comments_read"
  on public.thread_comments for select
  using (
    thread_type = 'forum'
    or exists (
      select 1 from public.spots s
      where s.id = thread_id
        and (s.visibility = 'public' or s.author_id = auth.uid())
    )
  );

drop policy if exists "thread_comments_insert_own" on public.thread_comments;
create policy "thread_comments_insert_own"
  on public.thread_comments for insert
  with check (
    author_id = auth.uid()
    and (
      thread_type = 'forum'
      or exists (select 1 from public.spots s where s.id = thread_id)
    )
  );

drop policy if exists "thread_comments_delete_own" on public.thread_comments;
create policy "thread_comments_delete_own"
  on public.thread_comments for delete
  using (author_id = auth.uid());

-- ── Keep reply_count / comment_count in sync ──
create or replace function public.handle_thread_comment_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.thread_type = 'forum' then
    update public.forum_posts
    set reply_count = reply_count + 1,
        last_reply_at = new.created_at
    where id = new.thread_id;
  elsif new.thread_type = 'spot' then
    update public.spots
    set comment_count = comment_count + 1
    where id = new.thread_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_thread_comment_insert on public.thread_comments;
create trigger on_thread_comment_insert
  after insert on public.thread_comments
  for each row execute function public.handle_thread_comment_insert();

create or replace function public.handle_thread_comment_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.thread_type = 'forum' then
    update public.forum_posts
    set reply_count = greatest(0, reply_count - 1)
    where id = old.thread_id;
  elsif old.thread_type = 'spot' then
    update public.spots
    set comment_count = greatest(0, comment_count - 1)
    where id = old.thread_id;
  end if;
  return old;
end;
$$;

drop trigger if exists on_thread_comment_delete on public.thread_comments;
create trigger on_thread_comment_delete
  after delete on public.thread_comments
  for each row execute function public.handle_thread_comment_delete();
