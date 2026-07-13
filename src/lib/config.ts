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
      { label: "Content Removal", href: "/content-removal" },
    ],
  },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
] as const;
