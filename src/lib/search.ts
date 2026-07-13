/**
 * Search + filters (TZ 3.1, 5.2). Client-side search with Fuse.js over a
 * prebuilt index that includes name, company, description, categories,
 * tags, country, city, services and products. Filters and sort are pure
 * predicates so the same functions work on the full list or on Fuse hits.
 */

import type { Category, Direction, Profile } from "@/lib/types";

/** One flat record per profile — everything the user can match on. */
export interface SearchDoc {
  slug: string;
  profileType: Profile["profileType"];
  name: string;
  shortDescription: string;
  fullDescription?: string;
  categories: string[]; // resolved names (main + additional)
  direction: string; // direction slug
  directionName: string; // resolved name
  country: string;
  city?: string;
  tags: string[];
  services: string[];
  products: string[];
  languages: string[];
}

/** Build the searchable documents. Called once on the server, passed to
 *  the client as JSON so Fuse can index it in the browser. */
export function buildSearchDocs(
  profiles: Profile[],
  categories: Category[],
  directions: Direction[],
): SearchDoc[] {
  const catName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;
  const dirName = (slug: string) =>
    directions.find((d) => d.slug === slug)?.name ?? slug;

  return profiles.map((p) => ({
    slug: p.slug,
    profileType: p.profileType,
    name: p.name,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    categories: [
      catName(p.mainCategory),
      ...(p.additionalCategories ?? []).map(catName),
    ],
    direction: p.direction,
    directionName: dirName(p.direction),
    country: p.country,
    city: p.city,
    tags: p.tags ?? [],
    services: p.services ?? [],
    products: p.products ?? [],
    languages: p.languages ?? [],
  }));
}

/** Fuse.js keys with weights that reflect what people usually type
 *  ("children's book illustrations", "handmade scarves") — content and
 *  categories carry more weight than incidental fields. */
export const fuseKeys = [
  { name: "name", weight: 0.9 },
  { name: "categories", weight: 0.85 },
  { name: "tags", weight: 0.75 },
  { name: "shortDescription", weight: 0.7 },
  { name: "services", weight: 0.65 },
  { name: "products", weight: 0.65 },
  { name: "directionName", weight: 0.55 },
  { name: "country", weight: 0.5 },
  { name: "city", weight: 0.4 },
  { name: "fullDescription", weight: 0.35 },
  { name: "languages", weight: 0.3 },
];

/** Filter state used by the directory page. All optional. */
export interface FilterState {
  q: string;
  direction: string; // slug or ""
  category: string; // slug or ""
  country: string; // human name or ""
  verified: "any" | "verified"; // "verified" = any non-none status
  sort: "newest" | "featured" | "az";
}

export const emptyFilters: FilterState = {
  q: "",
  direction: "",
  category: "",
  country: "",
  verified: "any",
  sort: "newest",
};

/** Apply structural filters (direction, category, country, verification)
 *  to a list of profiles. Search is done separately by Fuse. */
export function applyFilters(profiles: Profile[], f: FilterState): Profile[] {
  return profiles.filter((p) => {
    if (f.direction && p.direction !== f.direction) return false;
    if (
      f.category &&
      p.mainCategory !== f.category &&
      !(p.additionalCategories ?? []).includes(f.category)
    ) {
      return false;
    }
    if (f.country && p.country !== f.country) return false;
    if (f.verified === "verified" && p.verificationStatus === "none") return false;
    return true;
  });
}

/** Sort a list per TZ 3 (newest, featured-first, or A→Z). */
export function applySort(profiles: Profile[], sort: FilterState["sort"]): Profile[] {
  const arr = [...profiles];
  if (sort === "newest") {
    return arr.sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );
  }
  if (sort === "az") {
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }
  // "featured": leaders first, then newest inside each bucket
  return arr.sort((a, b) => {
    const fa = a.status === "featured" || a.featured ? 1 : 0;
    const fb = b.status === "featured" || b.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
  });
}

/** Serialise filter state to a URL query string, omitting defaults so
 *  shareable links stay short. */
export function filtersToQuery(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.direction) p.set("direction", f.direction);
  if (f.category) p.set("category", f.category);
  if (f.country) p.set("country", f.country);
  if (f.verified !== "any") p.set("verified", f.verified);
  if (f.sort !== "newest") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Read filter state from a URLSearchParams (or Record<string,string>). */
export function filtersFromParams(
  params: URLSearchParams | Record<string, string | undefined>,
): FilterState {
  const get = (k: string) =>
    params instanceof URLSearchParams ? params.get(k) ?? "" : params[k] ?? "";

  const verified = get("verified") === "verified" ? "verified" : "any";
  const sortRaw = get("sort");
  const sort: FilterState["sort"] =
    sortRaw === "featured" || sortRaw === "az" ? sortRaw : "newest";

  return {
    q: get("q"),
    direction: get("direction"),
    category: get("category"),
    country: get("country"),
    verified,
    sort,
  };
}
