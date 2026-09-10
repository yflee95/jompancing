# Jompancing

Malaysia's fishing social platform — share spots, promote activities, marketplace COD.

## Languages

- **ms** — Bahasa Melayu (default)
- **en** — English
- **zh** — 中文

URLs: `/ms`, `/en`, `/zh`

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- next-intl (i18n)
- Lucide icons

## Getting Started

Requires **Node.js 20+**

```bash
cd jompancing
npm install
npm run dev
```

Open [http://localhost:3000/ms](http://localhost:3000/ms)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Project Structure

```
src/
  app/[locale]/     # Localized pages
  components/       # UI & feature components
  data/             # Malaysia states & mock data
  i18n/             # next-intl routing & navigation
  lib/              # Utilities & constants
  types/            # Shared TypeScript types
messages/           # ms.json, en.json, zh.json
```

## MVP Features

- [x] Trilingual UI (MS / EN / ZH)
- [x] Fishing spots with state/district filters
- [x] Login gate for directions & comments
- [x] Activities & promotions page
- [x] Marketplace COD listings
- [x] Knowledge guide (SEO-ready)
- [x] Mobile bottom navigation
- [x] Demo auth (localStorage)

## Next Steps

- [ ] Supabase auth + database
- [ ] Mapbox/Google Maps integration
- [ ] Image upload (Cloudflare R2)
- [ ] Paid promotion billing (Billplz/iPay88)
- [ ] PWA icons & offline support
