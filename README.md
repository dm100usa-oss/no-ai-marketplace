# No AI Directory

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
