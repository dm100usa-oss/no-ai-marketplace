/**
 * Web address for a profile, built from the name the applicant gave.
 *
 * The address is permanent: it goes into the sitemap, into search results
 * and into whatever links people send each other. So it is built once, at
 * publishing time, and never recomputed from a name that may later be
 * edited.
 *
 * Cyrillic is transliterated rather than percent-encoded. An encoded URL
 * technically works, but it arrives in a client's inbox as a wall of %D0
 * sequences, and an author who cannot read it will not share it.
 */

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch",
  ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Latin letters, digits and single dashes only. */
export function slugify(value: string): string {
  const lowered = value.toLowerCase().replace(/ё/g, "е");

  let out = "";
  for (const ch of lowered) {
    if (ch in CYRILLIC) out += CYRILLIC[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else out += "-";
  }

  return out.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/**
 * A slug that is not already taken. Repeats get a number: two authors
 * genuinely called Anna Petrova both deserve a page, and the second one
 * gets anna-petrova-2 rather than an error.
 *
 * Falls back to the submission id when the name transliterates to nothing
 * at all — a name written entirely in a script this file does not cover.
 * An ugly address is recoverable; a profile that cannot be published is not.
 */
export function uniqueSlug(name: string, taken: Set<string>, fallback: string): string {
  const base = slugify(name) || slugify(fallback) || "profile";
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
