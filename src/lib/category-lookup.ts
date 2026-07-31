import { categories } from "@/data/categories";
import { categoriesRu } from "@/i18n/data/categories.ru";

/**
 * Turning a category written as a word into the slug the catalog uses.
 *
 * The join form sends what the applicant picked, in their own language and
 * exactly as it was printed in the dropdown: "3D Artists", "3D-художники".
 * Everything downstream — profile records, category pages, the sitemap —
 * works in slugs. This is the one place that bridges the two, so no other
 * file has to know that categories are ever written out in words.
 *
 * There is no hand-written mapping here on purpose. Both spellings already
 * live in the project: English names in src/data/categories.ts, Russian in
 * src/i18n/data/categories.ru.ts, and the direction sits on the English
 * record. Adding a category keeps working the way it always has — add it
 * to the data files and it is understood here for free. A separate list
 * would drift out of step the first time someone renamed a category.
 */

/** Strip case, punctuation and spacing differences so "3D-Artists",
 *  "3d artists" and "3D  Artists" all reduce to the same key. The dash in
 *  "3D-художники" is the usual culprit: forms and data files disagree
 *  about it more often than about anything else. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Every written form of every category, pointing at its slug. Built once
 *  at module load: the data files do not change while the server runs. */
const byName = new Map<string, string>();

for (const c of categories) {
  byName.set(normalize(c.name), c.slug);
  if (c.nameSingular) byName.set(normalize(c.nameSingular), c.slug);
  byName.set(normalize(c.slug), c.slug);

  const ru = categoriesRu[c.slug];
  if (ru?.name) byName.set(normalize(ru.name), c.slug);
  if (ru?.nameSingular) byName.set(normalize(ru.nameSingular), c.slug);
}

/** Direction slug for every category slug, from the English records. */
const directionOf = new Map<string, string>();
for (const c of categories) directionOf.set(c.slug, c.direction);

/**
 * Slug for a category written in either language, or undefined when it is
 * not one of ours. Undefined is a real answer, not a failure: a submission
 * with an unrecognised category should stop and be looked at by a person,
 * never be filed under a guess.
 */
export function categorySlugFromName(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return byName.get(normalize(value));
}

/** Same, for the list of extra categories. Unrecognised entries are
 *  dropped and duplicates removed; the main category is excluded so it
 *  never appears twice on a profile. */
export function categorySlugsFromNames(
  values: string[] | undefined,
  exclude?: string,
): string[] {
  if (!values?.length) return [];
  const out: string[] = [];
  for (const v of values) {
    const slug = categorySlugFromName(v);
    if (!slug || slug === exclude || out.includes(slug)) continue;
    out.push(slug);
  }
  return out;
}

/** Direction a category belongs to. */
export function directionSlugForCategory(categorySlug: string): string | undefined {
  return directionOf.get(categorySlug);
}
