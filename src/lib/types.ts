/**
 * No AI Marketplace — data model.
 * Full model laid down from the start per TZ Part IV, even where
 * fields are not yet populated. Cheap to lay down, costly to retrofit.
 */

/** Profile listing status (TZ 4.2). Pending/Rejected/Suspended are
 *  represented on early stages simply by the profile file being absent. */
export type ProfileStatus = "free" | "paid" | "featured";

/** Verification status (TZ 4.3). Legally careful wording. */
export type VerificationStatus =
  | "none"
  | "verified-creator" // Verified Human Creator
  | "verified-business"; // Verified Human-Made Business

export type ProfileType = "creator" | "team" | "company";

/** External platform links (TZ 4.1: Etsy, Behance, Dribbble, LinkedIn,
 *  Instagram, YouTube, Amazon and others). All optional. */
export interface SocialLinks {
  website?: string;
  portfolio?: string;
  etsy?: string;
  amazon?: string;
  behance?: string;
  dribbble?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  other?: { label: string; url: string }[];
}

/** Reserved for the future (TZ 3.4 / 4.1). Hidden on early stages,
 *  laid down now so it can be switched on without a rebuild. */
export interface ReservedRating {
  rating?: number; // reserved, hidden
  reviewsCount?: number; // reserved, hidden
}

export interface Profile extends ReservedRating {
  id: string;
  slug: string;
  name: string;
  profileType: ProfileType;

  status: ProfileStatus;
  verificationStatus: VerificationStatus;

  mainCategory: string; // category slug
  additionalCategories?: string[]; // category slugs
  direction: string; // direction slug

  country: string;
  city?: string;
  languages?: string[];

  shortDescription: string;
  fullDescription?: string;

  services?: string[];
  products?: string[];

  tags?: string[];

  socialLinks: SocialLinks;

  mainImage?: string;
  gallery?: string[];
  videoLinks?: string[];
  /** Author/company portrait shown in the card and profile header.
   *  Falls back to initials when absent. */
  avatar?: string;

  /** Statement about use / non-use of AI (TZ 4.1). */
  aiUsageStatement?: string;
  /** What exactly was reviewed (TZ 4.3). */
  verificationDescription?: string;

  featured?: boolean; // leader flag, set manually (TZ 3.4)

  /** How many people are in the team. Only meaningful for profileType
   *  "team"; the card falls back to a plain "Team" badge without it. */
  teamSize?: number;

  /** A placeholder profile, not a real person or business. Marked in the
   *  UI so nobody mistakes it for someone they can actually hire, and
   *  removed once real profiles take its place. */
  demo?: boolean;

  dateCreated: string; // ISO
  dateUpdated?: string; // ISO

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface Category {
  slug: string;
  name: string;
  direction: string; // parent direction slug
  shortDescription?: string;
  /** Comma-separated list of professions and specialisations inside this
   *  category, shown first on the category page so a visitor can tell at a
   *  glance whether they are in the right place. Plain text, not links:
   *  filtering by specialisation waits until there are real profiles. */
  professions?: string;
  /** SEO intro text shown on the category page (TZ 5.3:
   *  no empty pages made only of cards). */
  seoText?: string;
  seoTitle?: string;
  seoDescription?: string;
}

/** One brand colour per direction (TZ 5.5). */
export type DirectionColor =
  | "art"
  | "lit"
  | "writing"
  | "design"
  | "photo"
  | "music"
  | "code"
  | "craft"
  | "services"
  | "neutral";

export interface Direction {
  slug: string;
  name: string;
  color: DirectionColor;
  shortDescription?: string;
  seoText?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Built on stage 1 vs reserved for the future (TZ 3.2). */
  active: boolean;
}
