-- UGC translation: track original language for on-demand NLLB translation + DB cache.
-- Run in Supabase SQL Editor after 001–006.

alter table public.thread_comments
  add column if not exists source_locale text not null default 'ms'
  check (source_locale in ('ms', 'en', 'zh'));

alter table public.forum_posts
  add column if not exists source_locale text not null default 'ms'
  check (source_locale in ('ms', 'en', 'zh'));
