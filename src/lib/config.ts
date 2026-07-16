/**
 * Single source of truth for site-wide constants.
 * Prices live here only (TZ 2.2): change once, reflected everywhere —
 * pricing page, cards, buttons.
 */

export const site = {
  name: "No AI Marketplace",
  tagline: "Human-made creations.",
  slogan: "Real People. No AI.",
  description:
    "An international directory of professionals who create professional work and services without the use of generative AI.",
  url: "https://no-ai-marketplace.vercel.app",
  locale: "en",
  /** Free places at launch, across all participant types together. */
  freeSlots: 50,
  /** One shared end date for every free place — simpler to say and
   *  simpler to hold than a per-profile countdown. */
  freeUntil: "2026-12-31",
} as const;

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
    savingLabel: "~32%",
  },
  team: {
    id: "team",
    monthly: { price: 14.99, priceLabel: "$14.99", stripeLink: "" },
    yearly: { price: 119, priceLabel: "$119", stripeLink: "" },
    savingLabel: "~34%",
  },
  company: {
    id: "company",
    monthly: { price: 29.99, priceLabel: "$29.99", stripeLink: "" },
    yearly: { price: 239, priceLabel: "$239", stripeLink: "" },
    savingLabel: "~34%",
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
  /** One Tally form id per language, e.g. "wgABCD" from tally.so/r/wgABCD */
  tallyFormIds: {
    en: "ZjKKMa",
    ru: "VLAB8v",
  },
} as const;

/** The Tally form id for a given language, or "" when it isn't set yet. */
export function tallyFormId(locale: string): string {
  const ids = integrations.tallyFormIds as Record<string, string>;
  return ids[locale] ?? "";
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
      { label: "Human-Made standards", href: "/human-made-standards" },
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
  return link || "/join#form";
}

/** True when a href points to an external Stripe checkout (needs a real
 *  <a> with target/rel rather than a client-side <Link>). */
export function isExternalCheckout(href: string): boolean {
  return href.startsWith("http");
}
