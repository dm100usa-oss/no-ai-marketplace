# No AI Marketplace

International directory of human-made creators, studios and companies.
Built with Next.js (App Router), TypeScript and Tailwind CSS 4.

## Stages included in this build: 1 + 2

### Stage 1 — Foundation and design system
- Next.js 16 + TypeScript + Tailwind CSS 4 scaffold
- Full data model (all profile fields, TZ Part IV)
- Design system: ash-blue palette, Inter + Manrope (self-hosted),
  raised buttons and tiles, duotone direction icons, cards, badges,
  pills, empty / error / loading states
- Header (hamburger, centred logo, highlighted Add profile, full-width
  search; mobile accordion menu) and Footer (accordion on mobile)
- Semantic core in static HTML on the home hero (SEO/GEO critical)
- Schema.org WebSite + Organization; 404 page

### Stage 2 — Data, directions and categories
- Data files: `src/data/directions.ts`, `src/data/categories.ts`,
  `src/data/profiles.ts`. Content is data, not code.
- 4 active directions (+ 6 reserved for the future) and 10 categories
- 18 demo profiles across every category, many countries, creators and
  companies, mixed free/paid/featured and verification
- Auto-generated pages from data:
  - `/directions` and `/directions/[slug]`
  - `/categories` and `/categories/[slug]`
  - `/creators/[slug]` and `/companies/[slug]`
- Reusable creator card wired to real data; profile pages with services,
  AI statement, verification detail, external links sidebar
- Directory and Verified pages populated from data
- Breadcrumbs with BreadcrumbList JSON-LD; CollectionPage / ItemList /
  ProfilePage (Person / Organization) structured data

The demo profiles are fictional placeholders; the owner replaces them
with real profiles later. External links are neutral placeholders.
Card and profile images use a built-in placeholder until real images
are supplied. Full search and filters arrive on stage 3.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Deploy (GitHub + Vercel)
Push to GitHub; Vercel auto-rebuilds on every push to main. No env vars
needed for stages 1-2.

## Editing content
- Prices: `src/lib/config.ts` (`pricing`) — one place.
- Add a direction / category / profile: add an entry to the matching
  file in `src/data/`. Pages regenerate automatically on the next build.
