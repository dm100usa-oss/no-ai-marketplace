import type { Profile } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { getCategoryL, directionOfCategoryL } from "@/lib/localized-data";

/**
 * The warm few lines at the top of a profile, spoken by the platform.
 *
 * Three sentences: who this is and where they work, what they actually do,
 * and one line on the work being made by hand. Assembled from the profile's
 * own fields, so every author gets one the moment they are published and
 * nobody has to write anything by hand.
 *
 * Two rules shape the wording, and both come from the same place — this
 * text sits on hundreds of pages, not one:
 *
 * - The adjectives describe how a person works, not how good they are.
 *   "Talented" on every profile stops meaning anything by the tenth page,
 *   and a client comparing ten authors is exactly who would notice. Words
 *   like "attentive" or "working by hand" stay true on the hundredth
 *   profile and never rank one author above another.
 *
 * - Nothing is random. The opener and adjective are picked from the
 *   author's own id, so the page reads the same on every visit. A phrase
 *   that changes on reload looks careless, and the author will reload
 *   their own page more than anyone.
 *
 * Russian needs one extra care: "Рады представить Дмитрий" is wrong, the
 * name would have to take a case ending. Every opener here is therefore
 * built to be followed by a colon, which leaves the name untouched — this
 * works for any name in any language, including ones no rule would decline
 * correctly.
 */

/** Stable small number from a string: same profile, same phrasing, always. */
function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Added within the last two months. The "new here" opener is true for a
 *  while and then quietly stops being used, with nothing to switch off. */
function isRecent(dateCreated: string): boolean {
  const then = new Date(dateCreated).getTime();
  if (Number.isNaN(then)) return false;
  const twoMonths = 1000 * 60 * 60 * 24 * 61;
  return Date.now() - then < twoMonths;
}

/** Middle line: what the person does, from their own services list.
 *  Two items read as a sentence, five read as a form. Anything longer or
 *  more awkward than that is what `introDoes` on the profile is for. */
function doesLine(p: Profile, locale: Locale): string | null {
  if (p.introDoes) return p.introDoes;

  const services = (p.services ?? []).filter((s) => s.trim().length > 0);
  if (services.length === 0) return null;

  const picked = services.slice(0, 3).map((s) => s.trim());
  // Services are written as list items and start with a capital: "Book
  // covers". Inside a sentence that capital reads as a stray proper noun,
  // so it is eased down — unless the word is an acronym or a name, where
  // the capital is the word ("UI/UX", "SEO", "Photoshop"), which is what
  // the all-caps and mid-word-capital checks protect.
  const lower = picked.map((s) => {
    const first = s.split(/[\s/-]/)[0];
    const isAcronym = first.length > 1 && first === first.toUpperCase();
    const hasInnerCaps = /[a-zа-я][A-ZА-Я]/.test(first);
    if (isAcronym || hasInnerCaps) return s;
    return s.charAt(0).toLowerCase() + s.slice(1);
  });

  const joined =
    locale === "ru"
      ? lower.length === 1
        ? lower[0]
        : `${lower.slice(0, -1).join(", ")} и ${lower[lower.length - 1]}`
      : lower.length === 1
        ? lower[0]
        : `${lower.slice(0, -1).join(", ")} and ${lower[lower.length - 1]}`;

  // Sentence case: the list is prose now, not a row of tags.
  return `${joined.charAt(0).toUpperCase()}${joined.slice(1)}.`;
}

export interface Introduction {
  /** The opening sentence: opener, name, adjective, trade, city. */
  lead: string;
  /** What they do. Absent when the profile lists no services. */
  does: string | null;
  /** The made-by-hand line for this author's direction. */
  byHand: string | null;
}

export function buildIntroduction(
  p: Profile,
  dict: Dictionary,
  locale: Locale,
): { text: string } | Introduction {
  // A hand-written introduction wins outright: it exists precisely for the
  // profiles where the assembled one reads badly.
  if (p.introduction) return { text: p.introduction };

  const intro = dict.profile.intro;
  const seed = hashOf(p.id || p.slug);

  const opener = isRecent(p.dateCreated)
    ? intro.openerNew
    : intro.openers[seed % intro.openers.length];

  // A second, independent number from the same seed. Reusing the seed
  // directly would tie the adjective to the opener and cut the variety in
  // half; multiplying by a different prime decorrelates the two.
  const adjective =
    intro.adjectives[(seed * 7919) % intro.adjectives.length];

  const cat = getCategoryL(p.mainCategory, locale);
  const trade = cat?.nameSingular ?? cat?.name ?? "";

  const place = p.city || p.country;
  const from = locale === "ru" ? "из" : "from";

  // "Знакомьтесь: Анна, талантливый живописец из Казани."
  const parts = [adjective, trade].filter(Boolean).join(" ");
  const lead = place
    ? `${opener}: ${p.name}, ${parts} ${from} ${place}.`
    : `${opener}: ${p.name}, ${parts}.`;

  const dir = directionOfCategoryL(p.mainCategory, locale);
  const byHand = dir ? (intro.byHand[dir.slug] ?? intro.byHand.other) : null;

  return { lead, does: doesLine(p, locale), byHand };
}
