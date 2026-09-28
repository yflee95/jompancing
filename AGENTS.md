<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Jompancing project guide

**Read [`README.md`](./README.md) first** — cookbook for setup, architecture, Supabase migrations, SEO scripts, and copy-paste recipes (new pages, API routes, spots).

Quick rules:

- Node **≥ 20** (`.nvmrc` → 22). Use `@/i18n/navigation` for links, not raw `next/link`.
- Locales: `ms` | `en` | `zh`. User strings in `messages/*.json` (all three files, same keys).
- Production: spots/forum/activities/marketplace from **Supabase**; mock content off (`lib/mock-content.ts`).
- SEO: `buildPageMetadata`, `lib/spots-seo.ts`, `npm run enrich:spot-seo`. Do not commit `.env.local` or secrets.
- Push to `master` only when the user asks; never force-push `master`.
