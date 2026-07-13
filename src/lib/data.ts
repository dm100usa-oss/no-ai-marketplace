import type { Category, Direction, Profile } from "@/lib/types";
import { directions } from "@/data/directions";
import { categories } from "@/data/categories";
import { profiles } from "@/data/profiles";

/**
 * Data access layer. Pages are generated from these functions, so adding
 * a direction, category or profile is a data change — no page logic edit.
 * A profile "exists" in the catalog only if its file is present (TZ 4.2):
 * Pending/Rejected/Suspended are simply absent, so everything here treats
 * the profiles array as the live, published set.
 */

// ---------------- Directions ----------------

export function getAllDirections(): Direction[] {
  return directions;
}

export function getActiveDirections(): Direction[] {
  return directions.filter((d) => d.active);
}

export function getDirection(slug: string): Direction | undefined {
  return directions.find((d) => d.slug === slug);
}

// ---------------- Categories ----------------

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoriesByDirection(directionSlug: string): Category[] {
  return categories.filter((c) => c.direction === directionSlug);
}

/** Category name resolved from slug, for cards and labels. */
export function categoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

// ---------------- Profiles ----------------

export function getAllProfiles(): Profile[] {
  return profiles;
}

export function getProfile(slug: string): Profile | undefined {
  return profiles.find((p) => p.slug === slug);
}

/** Profiles whose main or additional category matches. */
export function getProfilesByCategory(categorySlug: string): Profile[] {
  return profiles.filter(
    (p) =>
      p.mainCategory === categorySlug ||
      (p.additionalCategories ?? []).includes(categorySlug)
  );
}

export function getProfilesByDirection(directionSlug: string): Profile[] {
  return profiles.filter((p) => p.direction === directionSlug);
}

export function getFeaturedProfiles(): Profile[] {
  return profiles.filter((p) => p.status === "featured" || p.featured);
}

export function getVerifiedProfiles(): Profile[] {
  return profiles.filter((p) => p.verificationStatus !== "none");
}

/** Newest first, by dateCreated. */
export function getNewestProfiles(limit?: number): Profile[] {
  const sorted = [...profiles].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/** Distinct countries present in the catalog, for filters. */
export function getCountries(): string[] {
  return Array.from(new Set(profiles.map((p) => p.country))).sort();
}

/** Resolve the visit link + label for a profile (portfolio vs website). */
export function resolveVisit(p: Profile): { href: string; label: string } {
  if (p.socialLinks.portfolio) return { href: p.socialLinks.portfolio, label: "Visit portfolio" };
  if (p.socialLinks.website) return { href: p.socialLinks.website, label: "Visit website" };
  return { href: "#", label: "Visit" };
}

/** Direction a category belongs to (with the direction object). */
export function directionOfCategory(categorySlug: string): Direction | undefined {
  const cat = getCategory(categorySlug);
  return cat ? getDirection(cat.direction) : undefined;
}
