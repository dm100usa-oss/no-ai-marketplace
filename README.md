# No AI Marketplace

International directory of creators, teams and companies whose work is made
by people, without generative AI.

Live: [no-ai-marketplace.vercel.app](https://no-ai-marketplace.vercel.app)

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS 4.
Deployed on Vercel; every push to `main` rebuilds the site.

## What is here

The site lists three kinds of participant: individual creators, teams
assembled from several creators, and companies or studios. Each profile
links out to the person's own site, portfolio or shop. Nothing is sold on
the platform itself.

Current contents: 10 directions, 35 categories, 27 demo profiles
(20 creators, 3 teams, 4 companies) in English and Russian.

The demo profiles are fictional placeholders and are replaced with real
ones as they arrive. Their external links are neutral.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

No environment variables are needed to run or build.

## Languages

English is the default and is served from the root (`/`, `/pricing`).
Russian is served under a prefix (`/ru`, `/ru/pricing`).

- `src/i18n/config.ts` sets the list of locales and the path rules. Everything
  else (routing, hreflang, canonical, sitemap, the language switcher) reads
  from here.
- `src/i18n/dictionaries/en.ts`, `ru.ts` hold all interface text.
- `src/i18n/data/*.ru.ts` hold the Russian translations of the content, keyed by
  slug. The English text lives in the source files under `src/data/` and is
  never duplicated. A missing translation falls back to English on its own.

Adding a third language means extending `LOCALES`, adding one dictionary
and the data translations. No page logic changes.

## Editing content

Content is data, not code. Adding something means adding an entry to a
file, and the pages regenerate on the next build.

| What | Where |
| --- | --- |
| Prices, free slots, site name | `src/lib/config.ts` |
| Directions | `src/data/directions.ts` + `src/i18n/data/directions.ru.ts` |
| Categories | `src/data/categories.ts` + `src/i18n/data/categories.ru.ts` |
| Profiles | `src/data/profiles.ts` + `src/i18n/data/profiles.ru.ts` |
| Interface text | `src/i18n/dictionaries/en.ts`, `ru.ts` |

Prices are in one place only. Change `src/lib/config.ts` and the pricing
page, the join page and every button follow.

Every direction and category carries its own SEO text, title and
description. A page made only of cards is not published: the intro text is
part of the entry, not an afterthought.

## Structure

```
src/
  app/[lang]/        pages, one folder per route
  components/        UI, reused across pages
  data/              content in English: directions, categories, profiles
  i18n/              locales, dictionaries, content translations
  lib/               types, config, data helpers, search
public/images/       hero, logo, profile images, people band
```

Pages generated from data:

- `/directions`, `/directions/[slug]`
- `/categories`, `/categories/[slug]`
- `/creators/[slug]`, `/teams/[slug]`, `/companies/[slug]`
- `/directory`, the full catalogue with search, filters and sort
- `/verified`, profiles that passed verification

Plus the fixed pages: pricing, join, about, contact, FAQ, method,
human-made standards, verification and listing policies, privacy, terms,
refund, copyright complaint, and the payment and submission outcomes.

## Search

Client-side, over a prebuilt index (`src/lib/search.ts`, Fuse.js). It
matches name, company, description, categories, tags, country, city,
services and products. Filters and sort are plain predicates, so the same
functions work on the whole list or on search hits.

## For machines

The site is written to be read by AI systems as well as by people:
semantic core in static HTML on the home page, Schema.org throughout
(WebSite, Organization, BreadcrumbList, CollectionPage, ItemList,
ProfilePage as Person or Organization, FAQPage), hreflang and canonical
from the locale config, generated sitemap and robots.

## Conventions

- Content text carries no long dashes.
- Russian text is written in Russian, not translated word by word from the
  English; the two say the same thing in each language's own voice.
- Comments explain why, not what.
