# No AI Marketplace

International directory of human-made creators, studios and companies.
Built with Next.js (App Router), TypeScript and Tailwind CSS 4.

## Stage 1 — Foundation and design system (this build)

- Next.js 16 + TypeScript + Tailwind CSS 4 project scaffold
- Folder structure and full data model (all profile fields, TZ Part IV)
- Design system: ash-blue palette, Inter + Manrope (self-hosted),
  raised buttons and tiles, duotone direction icons, cards, badges,
  pills, empty / error / loading states
- Header (hamburger, centred logo, highlighted Add profile, full-width
  search; mobile accordion menu)
- Footer (link groups, social, copyright; mobile accordion)
- Semantic core in static HTML on the home hero (SEO/GEO critical)
- Placeholder pages for every nav route so no link is broken
- 404 page
- Schema.org WebSite + Organization in the document head

The home page here is a live shell for design approval. Directions and
cards shown are preview content; real data-driven content is added on
stage 2.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Deploy (GitHub + Vercel)

1. Push this project to a GitHub repository.
2. In Vercel, import the repository. Framework preset: Next.js.
3. Deploy. Every push to the main branch auto-rebuilds and publishes.

No environment variables are required for stage 1.

## Prices

All prices live in one place: `src/lib/config.ts` (`pricing`). Change
them there and they update everywhere.
