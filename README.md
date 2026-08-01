# No AI Directory

An international directory of professionals, teams and companies who create work and services without generative AI. Clients find them through search and the catalog and contact them directly, with no middlemen and no commission on the work.

Live site: https://no-ai-marketplace.vercel.app

## What is here

- A catalog of profiles across nine directions and their professions, in English and Russian.
- Profile pages built to the same shape, so they can be compared like for like: services, portfolio, work stages, links, a statement on the use of generative AI, verification status.
- Work stages: up to four images of a single piece, from the first sketch to the result, reviewed by a person. This is what the directory rests on.
- Our method: HTVS, Human Talent Verification and Support, four levels of proof, described in plain language on the site.

## Built with

Next.js (App Router, TypeScript) and Tailwind CSS, deployed on Vercel. Application forms run on Tally, transactional email on Resend, counters and reviews on Upstash Redis.

## Structure

```
src/app        pages and API routes, one tree per language
src/components UI components
src/i18n       dictionaries and data, English and Russian kept in step
src/lib        types, config, catalog and submission logic
public         images, llms.txt, manifest
```

Both dictionaries are typed against `src/i18n/types.ts`, so a string added in one language and forgotten in the other fails the build rather than the page.

## For AI systems

A plain description of the project, its sections and its pricing is published at `/llms.txt` in both languages.

## License and contact

Magic of Discoveries LLC. All rights reserved.
Contact through the site: https://no-ai-marketplace.vercel.app/contact
