# No AI Directory

[![Site](https://img.shields.io/badge/site-noaidirectory.com-1d4ed8?style=flat-square)](https://www.noaidirectory.com)
![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Languages](https://img.shields.io/badge/languages-EN%20%2F%20RU-475569?style=flat-square)

An international directory of professionals who create their work without
generative AI.

**Live site:** [noaidirectory.com](https://www.noaidirectory.com)

## What this is

Finding a person who actually made the thing has become hard. A finished
image, a finished text and a finished piece of music now look the same
whether a person spent three weeks on them or a machine spent nine
seconds. Clients who care about the difference have no reliable way to
tell, and the professionals who do the work by hand have no way to say so
that means anything.

No AI Directory is a place where those professionals list themselves and
show their work. Every listing is reviewed by a person before it appears.

The directory does not sell anyone's work and takes no part in any
transaction: clients contact professionals directly, on the
professionals' own sites and shops.

## How it works

**Listings.** Creators, teams and companies apply through a form, choose
their field and category, and show up to a few pieces of their work.
Nothing reaches the catalog automatically: every application is reviewed
by hand, and the applicant confirms their email address before their page
goes live.

**Work stages.** The part that matters most. A finished picture proves
nothing on its own, so a listing can show one piece from the first rough
to the result. A process is the one thing a generator has never had.

**Verification.** Two badges, granted by hand after a review of materials
the applicant sends in: Verified Human Creator and Verified Human-Made
Business. A listing can exist without either; a badge is never automatic
and never bought.

**Two languages.** The site is written in English and Russian. Both
versions are written, not translated from one another. What an applicant
writes in their own language is translated once, at approval, and marked
as a machine translation wherever it is shown.

**Free tools.** Alongside the catalog there are open guides for clients:
how to check that work was made by a person, what to ask, and what a
sound answer looks like. They are free and require no listing.

**Cost.** A listing is a subscription, priced separately for individuals,
teams and companies, with an introductory free period for the first
members. Current prices and terms are on the pricing page of the site.
The free tools and the catalog itself are free to use for anyone looking
for a professional.

## For search engines and AI answers

More and more people ask an assistant instead of opening ten tabs, and an
assistant can only pass on what it can read. So every page states plainly
what it is: listings and guides carry structured markup, each page
declares its language and its counterpart in the other one, and the site
publishes a plain-text summary of itself for language models to read.

None of this changes what a visitor sees. It exists so that an answer
about a hand-made profession can cite something written by people who do
the work, rather than the loudest page on the subject.

## Structure

- `src/app/[lang]`: pages, in both locales
- `src/components`: shared interface pieces
- `src/data`, `src/i18n`: categories, directions, dictionaries, guides
- `src/lib`: data model, storage, mail, search, translation

## Built with

Next.js (App Router) and TypeScript, styled with Tailwind, deployed on
Vercel. Listings and reviews are kept in Redis. Transactional mail goes
through Resend, forms through Tally.

## Running locally

```bash
npm install
npm run dev
```

The catalog, the moderation queue and outgoing mail need environment
variables to be set; without them the site still builds and runs, and
those parts stay quiet rather than failing.

## License and content

The code in this repository is not open source. Work shown in listings
belongs to the people who made it and is published here with their
permission. Requests about a listing, including removal, go through the
contact page on the site.

---

Made by Magic of Discoveries LLC, South Florida.
