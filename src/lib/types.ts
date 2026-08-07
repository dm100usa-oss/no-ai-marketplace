/**
 * No AI Directory — data model.
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

/** One person inside a team profile. */
export interface TeamMember {
  /** Display name, as written on their own profile. */
  name: string;
  /** What this person does inside the team, in their own words. */
  role?: string;
  /** Slug of their creator profile in the catalog. Required by the
   *  catalog rule: no profile, no membership. */
  slug: string;
}

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
  /**
   * The name and the city as the author spells them in English.
   *
   * A machine must never touch either. A transliterated name is a
   * different name, and the one person entitled to decide how theirs is
   * spelled abroad is the person who owns it, which is why these are
   * typed into the form and left exactly as typed.
   *
   * Asked only in the forms that are not in English: somebody filling in
   * the English form has already written their name the way they want it
   * read there. Both optional, and both used on any page whose language
   * is not the author's own, so a Russian author reads as "Dmitry" on the
   * English page and on the Spanish one alike. Left empty, the original
   * spelling stays, which is never wrong, only foreign.
   *
   * The address of the page is built from the original name and does not
   * follow these: a listing that changed its own link would lose every
   * visitor who had already bookmarked it.
   */
  nameAlt?: string;
  cityAlt?: string;
  languages?: string[];

  shortDescription: string;
  fullDescription?: string;

  /** Hand-written introduction, shown at the top of the profile instead of
   *  the one the site assembles from the fields below. Left empty for
   *  almost everyone: the assembled version is there so no profile ever
   *  opens cold, and this exists for the cases where it reads badly — an
   *  unusual name, a services list that will not fold into a sentence, an
   *  author worth a few words of their own. */
  introduction?: string;
  /** Middle line of the assembled introduction: what this person actually
   *  does, in plain words. Built from `services` when absent. Set it when
   *  the services list is too long or too technical to read as a sentence. */
  introDoes?: string;

  services?: string[];
  products?: string[];

  tags?: string[];

  socialLinks: SocialLinks;

  mainImage?: string;
  gallery?: string[];
  /** Optional one-line description under each work, in the same order as
   *  gallery. The author may leave any of them empty: a work without a
   *  caption simply shows as a picture, the way it always did. */
  galleryCaptions?: string[];
  /**
   * Work stages: up to four pictures of one piece being made, shown under
   * the portfolio at a smaller size than the works themselves. Present
   * only when the author allowed it; the ones who did not are simply
   * missing the block, which is why nothing here is required.
   */
  stages?: string[];
  stageCaptions?: string[];
  videoLinks?: string[];
  /** Author/company portrait shown in the card and profile header.
   *  Falls back to initials when absent. */
  avatar?: string;

  /** Statement about use / non-use of AI (TZ 4.1). */
  aiUsageStatement?: string;
  /** What exactly was reviewed (TZ 4.3). */
  verificationDescription?: string;
  /** Date the verification was granted, as YYYY-MM-DD. Shown next to the
   *  badge; absent on profiles that were never verified. */
  verifiedDate?: string;

  featured?: boolean; // leader flag, set manually (TZ 3.4)

  /**
   * Which language the author actually wrote in, and their words in the
   * other one.
   *
   * A profile carries two kinds of text. The platform's own — headings,
   * the introduction, the working-process list — exists in every language
   * the site speaks. The author's own arrives in exactly one, whichever
   * form they filled in, and without these two fields it was printed as
   * it came: a Russian paragraph in the middle of an English page.
   *
   * `textLang` says which language the fields on this profile are in.
   * `textTranslations` holds the same fields in the others, made once at
   * approval. Both absent on the repository profiles, which are written
   * by hand in every language and translated the old way.
   */
  textLang?: "en" | "ru";
  textTranslations?: Partial<
    Record<
      "en" | "ru",
      {
        shortDescription?: string;
        fullDescription?: string;
        services?: string[];
        galleryCaptions?: string[];
        stageCaptions?: string[];
      }
    >
  >;

  /** The author allowed their photo and work to appear in the homepage
   *  showcase (new works / new members strips). Off by default: without
   *  consent the profile still lists in the catalog but never on the home
   *  page. Set from the consent checkbox in the join form. */
  showOnHomepage?: boolean;

  /** The year this company started working, as text ("2014").
   *
   *  Companies only. It answers the first silent question a client asks —
   *  how long have you been around — and it is the one fact on the page
   *  that cannot be dressed up. Deliberately the year work began, not the
   *  year the business was registered: a studio can trade for a decade
   *  before it incorporates, and the honest number is the useful one.
   *  Kept as a string because forms send "2014", "с 2014" and "2014 г."
   *  alike, and a number would quietly turn a typo into a wrong year. */
  foundedYear?: string;

  /** How many people are in the team. Only meaningful for profileType
   *  "team"; the card falls back to a plain "Team" badge without it. */
  teamSize?: number;

  /** Who is in the team.
   *
   *  A member is always someone with their own profile in the catalog:
   *  that is the rule the whole section rests on. The slug points at that
   *  profile, so the team page links to real, checkable people rather
   *  than to a list of names, and the member page links back. Name is
   *  kept here as well, so the row still reads if a profile is ever
   *  removed. */
  members?: TeamMember[];

  /** The member the platform writes to about this profile. Not a rank:
   *  the word on the page is "contact", not "lead". */
  contactPerson?: string;

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
  /** The trade in the singular, as one person would be called: "Иллюстратор"
   *  next to the plural "Иллюстраторы" on the category page. Used by the
   *  introduction at the top of a profile, where the plural would be wrong.
   *  In Russian it carries the masculine form; the introduction is built so
   *  that no case ending is ever needed. */
  nameSingular?: string;
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
