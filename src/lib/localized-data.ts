/**
 * Localized data access. The base data (src/data/*) stays in English and
 * is the single source of identity (slugs, colors, status, links, images,
 * dates). This layer overlays the Russian translations from src/i18n/data
 * on top, field by field, with automatic fallback to English when a
 * translation is missing.
 *
 * Every page reads through these helpers with the current locale, so
 * English behaves exactly as before and Russian gets translated content
 * without duplicating structure or logic.
 */

import type { Category, Direction, Profile } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { DEFAULT_LOCALE } from "@/i18n/config";
import {
  directions as baseDirections,
} from "@/data/directions";
import { categories as baseCategories } from "@/data/categories";
import { getLiveProfiles } from "@/lib/live-profiles";
import { directionsRu } from "@/i18n/data/directions.ru";
import { categoriesRu } from "@/i18n/data/categories.ru";
import { profilesRu } from "@/i18n/data/profiles.ru";

/** Pick a translated value if present and non-empty, else the base value. */
function pick<T>(translated: T | undefined, base: T): T {
  return translated === undefined ? base : translated;
}

// ---------------- Directions ----------------

function localizeDirection(d: Direction, locale: Locale): Direction {
  if (locale === DEFAULT_LOCALE) return d;
  const t = directionsRu[d.slug];
  if (!t) return d;
  return {
    ...d,
    name: pick(t.name, d.name),
    shortDescription: pick(t.shortDescription, d.shortDescription),
    seoText: pick(t.seoText, d.seoText),
    seoTitle: pick(t.seoTitle, d.seoTitle),
    seoDescription: pick(t.seoDescription, d.seoDescription),
  };
}

export function getAllDirectionsL(locale: Locale): Direction[] {
  return baseDirections.map((d) => localizeDirection(d, locale));
}

export function getActiveDirectionsL(locale: Locale): Direction[] {
  return baseDirections
    .filter((d) => d.active)
    .map((d) => localizeDirection(d, locale));
}

export function getDirectionL(slug: string, locale: Locale): Direction | undefined {
  const d = baseDirections.find((x) => x.slug === slug);
  return d ? localizeDirection(d, locale) : undefined;
}

// ---------------- Categories ----------------

function localizeCategory(c: Category, locale: Locale): Category {
  if (locale === DEFAULT_LOCALE) return c;
  const t = categoriesRu[c.slug];
  if (!t) return c;
  return {
    ...c,
    name: pick(t.name, c.name),
    shortDescription: pick(t.shortDescription, c.shortDescription),
    professions: pick(t.professions, c.professions),
    seoText: pick(t.seoText, c.seoText),
    seoTitle: pick(t.seoTitle, c.seoTitle),
    seoDescription: pick(t.seoDescription, c.seoDescription),
  };
}

export function getAllCategoriesL(locale: Locale): Category[] {
  return baseCategories.map((c) => localizeCategory(c, locale));
}

export function getCategoryL(slug: string, locale: Locale): Category | undefined {
  const c = baseCategories.find((x) => x.slug === slug);
  return c ? localizeCategory(c, locale) : undefined;
}

export function getCategoriesByDirectionL(
  directionSlug: string,
  locale: Locale,
): Category[] {
  return baseCategories
    .filter((c) => c.direction === directionSlug)
    .map((c) => localizeCategory(c, locale));
}

export function categoryNameL(slug: string, locale: Locale): string {
  return getCategoryL(slug, locale)?.name ?? slug;
}

export function directionOfCategoryL(
  categorySlug: string,
  locale: Locale,
): Direction | undefined {
  const cat = baseCategories.find((c) => c.slug === categorySlug);
  return cat ? getDirectionL(cat.direction, locale) : undefined;
}

// ---------------- Profiles ----------------

function localizeProfile(p: Profile, locale: Locale): Profile {
  if (locale === DEFAULT_LOCALE) return p;
  const t = profilesRu[p.slug];
  if (!t) return p;
  return {
    ...p,
    country: pick(t.country, p.country),
    city: pick(t.city, p.city),
    introduction: pick(t.introduction, p.introduction),
    shortDescription: pick(t.shortDescription, p.shortDescription),
    fullDescription: pick(t.fullDescription, p.fullDescription),
    services: pick(t.services, p.services),
    products: pick(t.products, p.products),
    tags: pick(t.tags, p.tags),
    galleryCaptions: pick(t.galleryCaptions, p.galleryCaptions),
    stageCaptions: pick(t.stageCaptions, p.stageCaptions),
    aiUsageStatement: pick(t.aiUsageStatement, p.aiUsageStatement),
    verificationDescription: pick(
      t.verificationDescription,
      p.verificationDescription,
    ),
  };
}

/**
 * Everything below reads the live catalog, so it has to be awaited.
 *
 * Profiles used to come straight from a file in the repository, which made
 * these plain functions. They now come from the repository *and* from the
 * approved applications in the store, and the store is a trip over the
 * network. The alternative — a background copy the pages read without
 * waiting — would have shown a stale catalog on the first request after
 * every deploy, which is exactly the moment a new author looks.
 */

export async function getAllProfilesL(locale: Locale): Promise<Profile[]> {
  const all = await getLiveProfiles();
  return all.map((p) => localizeProfile(p, locale));
}

export async function getProfileL(
  slug: string,
  locale: Locale,
): Promise<Profile | undefined> {
  const all = await getLiveProfiles();
  const p = all.find((x) => x.slug === slug);
  return p ? localizeProfile(p, locale) : undefined;
}

/**
 * The team a creator belongs to, if any.
 *
 * The link is stored once, on the team, and read back from here, so a
 * creator profile never has to repeat what the team already says. Upwork
 * does the same with agencies: the roster lives on the agency and both
 * pages point at each other. One source, two directions.
 */
export async function getTeamOfCreatorL(
  slug: string,
  locale: Locale,
): Promise<Profile | undefined> {
  const all = await getLiveProfiles();
  const team = all.find(
    (p) =>
      p.profileType === "team" &&
      (p.members ?? []).some((m) => m.slug === slug),
  );
  return team ? localizeProfile(team, locale) : undefined;
}

export async function getProfilesByCategoryL(
  categorySlug: string,
  locale: Locale,
): Promise<Profile[]> {
  const all = await getLiveProfiles();
  return all
    .filter(
      (p) =>
        p.mainCategory === categorySlug ||
        (p.additionalCategories ?? []).includes(categorySlug),
    )
    .map((p) => localizeProfile(p, locale));
}

export async function getProfilesByDirectionL(
  directionSlug: string,
  locale: Locale,
): Promise<Profile[]> {
  const all = await getLiveProfiles();
  return all
    .filter((p) => p.direction === directionSlug)
    .map((p) => localizeProfile(p, locale));
}

export async function getFeaturedProfilesL(locale: Locale): Promise<Profile[]> {
  const all = await getLiveProfiles();
  return all
    .filter((p) => p.status === "featured" || p.featured)
    .map((p) => localizeProfile(p, locale));
}

export async function getVerifiedProfilesL(locale: Locale): Promise<Profile[]> {
  const all = await getLiveProfiles();
  return all
    .filter((p) => p.verificationStatus !== "none")
    .map((p) => localizeProfile(p, locale));
}

export async function getNewestProfilesL(
  locale: Locale,
  limit?: number,
): Promise<Profile[]> {
  const all = await getLiveProfiles();
  const sorted = [...all].sort(
    (a, b) =>
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  );
  const sliced = typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  return sliced.map((p) => localizeProfile(p, locale));
}

/** Distinct localized country names present in the catalog, for filters. */
export async function getCountriesL(locale: Locale): Promise<string[]> {
  const profiles = await getAllProfilesL(locale);
  const all = profiles.map((p) => p.country).filter(Boolean);
  return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
}

/** Resolve the visit link + localized label for a profile. */
export function resolveVisitL(
  p: Profile,
  labels: { portfolio: string; website: string; visit: string },
): { href: string; label: string } {
  if (p.socialLinks.portfolio)
    return { href: p.socialLinks.portfolio, label: labels.portfolio };
  if (p.socialLinks.website)
    return { href: p.socialLinks.website, label: labels.website };
  return { href: "#", label: labels.visit };
}
