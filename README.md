# No AI Directory

An international directory of creators, teams and companies whose work is made
without generative AI.

Illustrators, photographers, writers, architects, composers and thirty-odd other
professions list a profile here; clients who need work made by a person, and who
need to be able to say so, use the directory to find them. Every listing is
reviewed by hand before it goes live.

Live site: https://no-ai-marketplace.vercel.app

Run by Magic of Discoveries LLC.

## How it works

**Listing.** Someone picks their type (creator, team or company), fills in the
matching form and lands on a confirmation page. The submission goes into a
moderation queue. Nothing reaches the directory on its own.

**Review.** Each submission is read by a person in the admin panel and either
published or turned down. Publishing sends a welcome email; the profile appears
only after the applicant clicks the link in it, so the address is confirmed
before anything is public.

**Verification.** Passing the standard check is required of everyone. An
optional deeper check grants a "Verified" badge, and a separate email announces
it.

**Payment.** The first fifty profiles are free through the end of 2026. After
that a profile costs $5.99 a month for a creator, $14.99 for a team, $29.99 for
a company, with a lower yearly rate. The directory takes no commission: clients
pay creators directly, off the platform.

## Built with

- Next.js 16, App Router, React 19, TypeScript
- Tailwind CSS 4
- Upstash Redis for the submission queue, reviews and the visit counter
- Tally for the entry forms, delivered here by webhook
- Resend for transactional email
- Deployed on Vercel

## Languages

The site is fully bilingual, English and Russian, and both versions are written
rather than machine-translated.

Every string lives in `src/i18n/dictionaries/en.ts` and `ru.ts`, and the shape of
both is enforced by `src/i18n/types.ts`: a key added to one language and
forgotten in the other will not compile. English is served from the root
(`/pricing`), Russian from a prefix (`/ru/pricing`).

## Layout

```
src/app/[lang]/        pages, one tree for both languages
src/app/api/           form webhook, admin actions, reviews, visit counter
src/components/        UI
src/data/              profiles, categories, directions
src/i18n/              dictionaries and the type that keeps them in step
src/lib/               config, data access, mail, Redis, search
public/                images
```

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

The site builds and runs without any environment variables. Without them the
forms still render, but submissions are not stored and no email is sent.

| Variable | What it does |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Submission queue, reviews, visit counter |
| `UPSTASH_REDIS_REST_TOKEN` | The same |
| `ADMIN_PASSWORD` | Guards `/admin` |
| `RESEND_API_KEY` | Sends the welcome, rejection and verification emails |
| `MAIL_FROM` | Sender address on the project's own domain |
| `SITE_URL` | Makes links in emails point at production |
| `TALLY_WEBHOOK_SECRET` | Optional; rejects submissions that are not from the forms |

## Conventions

- Both dictionaries are always edited together.
- Copy is written for people, in natural English and Russian.
- No generated faces or generated imagery anywhere on the site, which would be
  an odd thing for this particular directory to have.

## License

All rights reserved. The code is public to be read, not to be reused.
