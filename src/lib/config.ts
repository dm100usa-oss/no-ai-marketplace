/**
 * Single source of truth for site-wide constants.
 * Prices live here only (TZ 2.2): change once, reflected everywhere —
 * pricing page, cards, buttons.
 */

export const site = {
  name: "No AI Directory",
  tagline: "Human-made creations.",
  slogan: "Real People. No AI.",
  description:
    "An international directory of professionals who create professional work and services without the use of generative AI.",
  url: "https://www.noaidirectory.com",
  locale: "en",
  /** Free places at launch, across all participant types together. */
  freeSlots: 50,
  /** One shared end date for every free place — simpler to say and
   *  simpler to hold than a per-profile countdown. */
  freeUntil: "2026-12-31",
} as const;

/**
 * Who stands behind the catalog, for the machine-readable part of the site.
 *
 * The brand is what a visitor sees; the legal entity is fine print. Both
 * are needed, and for different reasons. A reader wants the brand. An
 * answer engine deciding whether to name this catalog in a reply wants to
 * know it belongs to somebody real, in a named country, reachable by
 * email, working to a written procedure. A site that cannot say who runs
 * it reads as nobody's.
 *
 * No personal names here by choice. Authority is carried by the stated
 * procedure instead: which policies govern publication, review and
 * corrections. Those three fields are exactly what Schema.org offers an
 * organisation that publishes under its own name rather than under
 * bylines, and they are read that way.
 *
 * `contactEmail` stays empty until the production domain is live. Empty
 * means the field is left out of the markup entirely: a working address
 * helps, an invented one is worse than silence.
 */
export const owner = {
  legalName: "Magic of Discoveries LLC",
  country: "US",
  foundingYear: "2026",
  contactEmail: "",
  /** Used as the organisation logo in structured data. */
  logoPath: "/android-chrome-512x512.png",
  /** Subjects the catalog claims competence in. Read by answer engines as
   *  the scope of the organisation, not as keywords. */
  knowsAbout: [
    "Human-made creative work",
    "Verification of authorship",
    "Generative AI disclosure",
    "Creative professional directories",
  ],
} as const;

/**
 * Last review date per page, shown on the page and emitted as
 * dateModified.
 *
 * One date per page rather than one for the whole site: a single shared
 * date that moves everywhere at once is a claim nobody can hold, and a
 * page that says it was reviewed on a day it was not is worse than a page
 * with no date. Edit the line for a page when its text actually changes.
 *
 * A fact carrying a date ages on its own, which is the point: an answer
 * engine choosing between two sources prefers the one that says when it
 * last checked itself.
 */
export const pageUpdated: Record<string, string> = {
  "/method": "2026-08-02",
  "/human-made-standards": "2026-08-02",
  "/work-stages": "2026-08-02",
  "/how-to-verify": "2026-08-02",
  "/origin-check": "2026-08-02",
  "/why-us": "2026-08-02",
  "/faq": "2026-08-02",
  "/pricing": "2026-08-02",
  "/about": "2026-08-02",
  "/glossary": "2026-08-02",
  "/knowledge": "2026-08-02",
  "/verified": "2026-08-02",
  "/categories": "2026-08-02",
  "/directions": "2026-08-02",
};

/**
 * The two figures in the band under the work strip.
 *
 * Both are null until they are true. There is no analytics wired up yet
 * and nobody has reviewed the platform, so the band stays hidden rather
 * than showing a number that was made up. Put a real figure in and that
 * half of the band appears on its own, counter and all.
 *
 * visits: real visits for the last seven days, once analytics is live.
 * rating: average of real reviews, once there are reviews to average.
 */
export const stats = {
  visits: null as number | null,
  rating: null as number | null,
} as const;

/**
 * Pricing (TZ 2.2). Edit here only — the pricing page, the join page and
 * every button read from this.
 *
 * One plan per participant type, because what the platform is worth to a
 * single creator and to a studio is not the same. Each plan has a monthly
 * and a yearly price; yearly saves about a third.
 *
 * The first `site.freeSlots` profiles are free until `site.freeUntil`,
 * whichever plan they are on. After that, or once the places run out,
 * the plan below applies.
 */
export const plans = {
  creator: {
    id: "creator",
    monthly: { price: 5.99, priceLabel: "$5.99", stripeLink: "" },
    yearly: { price: 49, priceLabel: "$49", stripeLink: "" },
    savingLabel: "32%",
  },
  team: {
    id: "team",
    monthly: { price: 14.99, priceLabel: "$14.99", stripeLink: "" },
    yearly: { price: 119, priceLabel: "$119", stripeLink: "" },
    savingLabel: "34%",
  },
  company: {
    id: "company",
    monthly: { price: 29.99, priceLabel: "$29.99", stripeLink: "" },
    yearly: { price: 239, priceLabel: "$239", stripeLink: "" },
    savingLabel: "34%",
  },
} as const;

export type PlanId = keyof typeof plans;
export type BillingPeriod = "monthly" | "yearly";

export const PLAN_ORDER: PlanId[] = ["creator", "team", "company"];

/** The free tier is a state, not a plan: any type can hold a free place
 *  while there are places left. */
export const freeTier = {
  priceLabel: "$0",
} as const;

/**
 * External integrations (TZ 2.3, stage 5). Fill these in one place.
 *
 * HOW TO GET EACH VALUE — see the owner guide in README (section
 * "Stage 5: registration and payment"). Short version:
 *
 * 1. tallyFormIds — one Tally form per language. Create a form on
 *    tally.so, open it, the id is the code in the share URL
 *    tally.so/r/XXXXXXX (that XXXXXXX). Paste the English form's id
 *    under `en` and the Russian one under `ru`.
 *
 *    Why one form per language: Tally renders a form in the single
 *    language it was written in, and its page-jump logic only fires
 *    after the visitor presses Next — so a single form cannot show
 *    Russian questions to a Russian visitor without walking them
 *    through the English ones first. One form per language keeps each
 *    submission clean and each form editable on its own.
 *
 *    The participant type picked on /join is still passed to every form
 *    as a hidden `type` field (creator / team / company), together with
 *    a `lang` field, so submissions arrive labelled.
 *
 *    NOTE: Tally counts its "limit responses" setting per form, so the
 *    50 free places are counted per language, not across both. Watch the
 *    combined total by hand until the free places run out.
 *
 * 2. Stripe Payment Links live in the `plans` table above, one per plan
 *    and period (six in total). Create each link in the Stripe dashboard
 *    and paste the full https://buy.stripe.com/... value into the matching
 *    `stripeLink`. In every link, set the success URL to
 *    <site>/payment-success and the cancel URL to <site>/payment-cancelled.
 *
 * Leave a value as an empty string until you have it: the site stays
 * fully working. An empty Stripe link simply sends the visitor to the join
 * form instead of straight to checkout; an empty Tally id shows a short
 * "form is being connected" notice in place of the embedded form.
 */
export const integrations = {
  /** One Tally form id per language, e.g. "wgABCD" from tally.so/r/wgABCD.
   *  This is the creator form and the fallback for every type. */
  tallyFormIds: {
    en: "ZjKKMa",
    ru: "VLAB8v",
  },

  /** Separate forms for teams and companies, per language.
   *
   *  A team is asked different questions than one person: who is in it,
   *  which profiles they hold in the catalog, who to write to, six works
   *  instead of four. Bending one form around three cases makes every
   *  applicant read questions meant for someone else, so each type gets
   *  its own form. Leave a value empty and that type simply opens the
   *  creator form as before, so nothing breaks while the new forms are
   *  being written. */
  tallyTeamFormIds: {
    en: "VLX17y",
    ru: "yPrqG8",
  },
  tallyCompanyFormIds: {
    en: "xXElx9",
    ru: "jaXJkY",
  },
} as const;

/** The Tally form id for a language and participant type. Falls back to
 *  the creator form whenever the type-specific one is not set yet. */
export function tallyFormId(locale: string, type?: string): string {
  const base = integrations.tallyFormIds as Record<string, string>;
  const byType: Record<string, Record<string, string>> = {
    team: integrations.tallyTeamFormIds as Record<string, string>,
    company: integrations.tallyCompanyFormIds as Record<string, string>,
  };
  const special = type ? byType[type]?.[locale] : undefined;
  return special || base[locale] || "";
}

/** Primary navigation (TZ Etap 1: Directory, Categories, Verified,
 *  About, Pricing, Join). Join is visually highlighted. */
export const primaryNav = [
  { label: "Directory", href: "/directory" },
  { label: "Categories", href: "/categories" },
  { label: "Verified", href: "/verified" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

/** Footer sections (TZ Etap 1 footer + full site map Part III 3.5). */
export const footerNav = [
  {
    title: "Explore",
    links: [
      { label: "Directory", href: "/directory" },
      { label: "All categories", href: "/categories" },
      { label: "Directions", href: "/directions" },
      { label: "Verified profiles", href: "/verified" },
    ],
  },
  {
    title: "For creators",
    links: [
      { label: "Add your profile", href: "/join" },
      { label: "Pricing", href: "/pricing" },
      { label: "Human-Made standards", href: "/method" },
      { label: "Verification", href: "/verified" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Listing Policy", href: "/listing-policy" },
      { label: "Verification Policy", href: "/verification-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Content Removal", href: "/content-removal" },
      { label: "Copyright Complaint", href: "/copyright-complaint" },
    ],
  },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
] as const;

/**
 * Where a paid-plan button should send the visitor.
 * If the matching Stripe Payment Link is set, go straight to checkout;
 * otherwise fall back to the join form (TZ 2.3: the Tally form itself
 * switches to the paid step after the first 50 free places).
 */
export function planCheckoutHref(plan: PlanId, period: BillingPeriod): string {
  const link = plans[plan][period].stripeLink;
  // No Stripe link yet: send them to this plan's own page, which thanks
  // them and puts their form in front of them, rather than to the "who are
  // you" question they have just answered by pressing this button.
  return link || `/join/${plan}`;
}

/** True when a href points to an external Stripe checkout (needs a real
 *  <a> with target/rel rather than a client-side <Link>). */
export function isExternalCheckout(href: string): boolean {
  return href.startsWith("http");
}
