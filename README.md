# No AI Marketplace

International directory of human-made creators, studios and companies.
Built with Next.js (App Router), TypeScript and Tailwind CSS 4.

A directory, not a marketplace: there is no cart, checkout or in-site
payment between buyer and creator. Every profile links out to the
creator's own site, shop or portfolio, where the real transaction
happens. The site's job is to be found (in Google and in AI answers) and
to send targeted traffic to creators.

## Build status: all 6 stages complete

### Stage 1 — Foundation and design system
Next.js + TypeScript + Tailwind scaffold, full data model (all profile
fields, TZ Part IV), ash-blue design system, header and footer, semantic
core in static HTML on the home hero, Schema.org WebSite + Organization,
404 page.

### Stage 2 — Data, directions and categories
Data files in `src/data/` (content is data, not code), 4 active
directions (+6 reserved), 10 categories, 18 demo profiles, auto-generated
pages for directions, categories, creators and companies, breadcrumbs and
structured data.

### Stage 3 — Home, catalog, search and filters
Home page with the semantic core in static HTML, catalog, client-side
Fuse.js search, filters (direction, category, country, verification),
sorting, featured blocks.

### Stage 4 — Full profiles and utility pages
Full creator/company pages, verification and status badges, standards,
about, contact, all status pages (payment success/cancelled, submitted,
suspended, not-available, thank-you) and legal stub pages.

### Stage 5 — Registration, pricing and payment
Join page with an embedded Tally form (built-in 100-free-place limit),
pricing page, Stripe Payment Links wired through a single config, and
payment result pages. See the owner guide below.

### Stage 6 — SEO, optimisation, analytics and handover
Full metadata / Open Graph / Twitter / Schema.org, auto-generated
`sitemap.xml` and `robots.txt` (with AI crawlers named), Vercel Analytics
and Speed Insights with key custom events, safe external links, secrets
kept in environment variables, and this documentation.

---

## Run locally

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Deploy (GitHub + Vercel)

Push to `main`; Vercel auto-rebuilds on every push. The public site needs
no environment variables to run. Vercel Analytics and Speed Insights turn
on automatically once the project is deployed on Vercel (enable Analytics
in the Vercel project dashboard, tab "Analytics").

---

## Owner guide

### One place for prices and links: `src/lib/config.ts`

- **Prices** live in `pricing` (free / monthly / yearly). Change a number
  once here and it updates the pricing page, the join page and every
  button.
- **Integrations** live in `integrations`:
  - `tallyFormId` — the id of your Tally form.
  - `stripeMonthly` / `stripeYearly` — your two Stripe Payment Links.

Leave any of these empty and the site keeps working: an empty Tally id
shows a short "form is being connected" notice; empty Stripe links send
the visitor to the join form instead of straight to checkout.

### Stage 5: connect the Tally form (100 free places)

1. Create a form on [tally.so](https://tally.so) that collects the
   profile fields (name, type, main + extra categories, direction,
   country/city, languages, short + full description, services/products,
   tags, all external links, AI-usage statement, verification materials),
   plus a plan choice and agreement to the rules.
2. In the form settings turn on **Limit responses** and set it to **100**.
   Tally then closes the free form by itself once 100 replies arrive.
3. Open the form; the share URL is `tally.so/r/XXXXXXX`. Copy the
   `XXXXXXX` part into `integrations.tallyFormId`.

### Stage 5: connect Stripe payment

1. In the Stripe dashboard create two **Payment Links**: one for
   **$5.99 / month**, one for **$49 / year**.
2. In each link's settings, set the success URL to
   `https://<your-domain>/payment-success` and the cancel URL to
   `https://<your-domain>/payment-cancelled`.
3. Paste the two `https://buy.stripe.com/...` links into
   `integrations.stripeMonthly` and `integrations.stripeYearly`.

Stripe collects the money and keeps the payment records; the site never
sees or stores card details.

### After the first 100 free places

Point the paid step of the Tally form at your Stripe Payment Links (Tally
lets a submit action open a URL). The pricing-page buttons already send
paying visitors straight to Stripe once the links are set.

### Manage content (all data, no code)

Everything is a data change in `src/data/`, and pages regenerate on the
next build:

- **Add a profile** — add an entry to `src/data/profiles.ts`. A profile
  "exists" only if its entry is present; to **hide / suspend** a profile,
  remove or comment out its entry.
- **Make someone a leader** — set `featured: true` (or `status:
  "featured"`) on their entry. They rise into the featured blocks.
- **Set verification** — set `verificationStatus` to `verified-creator`
  or `verified-business` and fill `verificationDescription` with what was
  reviewed. Wording stays careful: "Verified based on submitted
  materials".
- **Add a category** — add an entry to `src/data/categories.ts` with its
  parent `direction`. A page is generated automatically.
- **Add a direction** — add an entry to `src/data/directions.ts` and set
  `active: true` to switch it on.

### Publish and roll back

- Publishing is a push to `main`; Vercel rebuilds automatically.
- To **roll back**, in the Vercel dashboard open Deployments, find the
  previous good build and "Promote to Production" — or revert the commit
  on GitHub.

### Secrets

No secret keys are needed for the public site. Anything sensitive you add
later (for example a Stripe secret key for future automation) goes into
**Vercel → Project → Settings → Environment Variables**, never into
GitHub.

---

## Scaling later (architecture is ready)

Laid down but not built in these 6 stages — each can be added without a
rebuild: user star ratings and reviews (fields already reserved),
automatic publishing after payment (Stripe webhooks + a database), an
admin panel / CMS, the remaining 6 directions, a server-side search for a
large catalog, and multilingual support.

The demo profiles are fictional placeholders with neutral external links;
replace them with real profiles over time. Card and profile images use a
built-in placeholder until real images are supplied.
