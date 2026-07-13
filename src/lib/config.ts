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
    "International directory of people, studios and companies who create work, products and services without AI.",
  url: "https://no-ai-marketplace.vercel.app",
  locale: "en",
  freeSlots: 100,
} as const;

/** Pricing (TZ 2.2). Edit here only. */
export const pricing = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "$0",
    period: "first 100 profiles",
    features: [
      "Basic profile",
      "One category",
      "Limited number of images",
    ],
  },
  monthly: {
    id: "monthly",
    name: "Monthly",
    price: 5.99,
    priceLabel: "$5.99",
    period: "per month",
    features: [
      "Full profile",
      "More images",
      "Multiple categories",
      "All external links",
    ],
    // Stripe Payment Link — set on stage 5
    stripeLink: "",
  },
  yearly: {
    id: "yearly",
    name: "Yearly",
    price: 49,
    priceLabel: "$49",
    period: "per year",
    note: "Save about 32% vs monthly",
    features: [
      "Everything in Monthly",
      "About 32% discount for annual billing",
    ],
    stripeLink: "",
  },
} as const;

/**
 * External integrations (TZ 2.3, stage 5). Fill these in one place.
 *
 * HOW TO GET EACH VALUE — see the owner guide in README (section
 * "Stage 5: registration and payment"). Short version:
 *
 * 1. tallyFormId — create a form on tally.so, open it, the id is the
 *    code in the share URL tally.so/r/XXXXXXX (that XXXXXXX). In the
 *    form's settings turn on "Limit responses" and set it to
 *    site.freeSlots (100). Tally then closes the free form on its own.
 *
 * 2. stripeMonthly / stripeYearly — in the Stripe dashboard create two
 *    Payment Links (one for $5.99/month, one for $49/year) and paste the
 *    full https://buy.stripe.com/... links here. In each Payment Link,
 *    set the success URL to  <site>/payment-success  and the cancel /
 *    "back" URL to  <site>/payment-cancelled .
 *
 * Leave a value as an empty string until you have it: the site stays
 * fully working. Empty Stripe links simply send the visitor to the join
 * form instead of straight to checkout; an empty Tally id shows a short
 * "form is being connected" notice in place of the embedded form.
 */
export const integrations = {
  tallyFormId: "", // e.g. "wgABCD" from tally.so/r/wgABCD
  stripeMonthly: "", // e.g. "https://buy.stripe.com/xxxxxxxxxxxx"
  stripeYearly: "", // e.g. "https://buy.stripe.com/yyyyyyyyyyyy"
} as const;

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
 * switches to the paid step after the first 100 free places).
 */
export function planCheckoutHref(plan: "free" | "monthly" | "yearly"): string {
  if (plan === "monthly" && integrations.stripeMonthly) {
    return integrations.stripeMonthly;
  }
  if (plan === "yearly" && integrations.stripeYearly) {
    return integrations.stripeYearly;
  }
  return "/join#form";
}

/** True when a href points to an external Stripe checkout (needs a real
 *  <a> with target/rel rather than a client-side <Link>). */
export function isExternalCheckout(href: string): boolean {
  return href.startsWith("http");
}
