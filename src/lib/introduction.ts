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

export interface Introduction {
  /** The opening sentence: opener, name, adjective, trade, city. */
  lead: string;
  /** What they do. Absent when the profile lists no services. */
  does: string | null;
  /** The made-by-hand line for this author's direction. */
  byHand: string | null;
  /** Invitation to the author's own sites. Null when there are none. */
  more: string | null;
}

/** Does this profile actually lead anywhere? The closing line invites the
 *  reader to see more work "through the links below", so it may only appear
 *  when those links exist. */
function hasExternalLinks(p: Profile): boolean {
  const l = p.socialLinks;
  if (!l) return false;
  const named = [
    l.website,
    l.portfolio,
    l.etsy,
    l.amazon,
    l.behance,
    l.dribbble,
    l.linkedin,
    l.instagram,
    l.youtube,
  ];
  if (named.some((u) => typeof u === "string" && u.trim() !== "" && u !== "#")) {
    return true;
  }
  return (l.other ?? []).some(
    (o) => typeof o.url === "string" && o.url.trim() !== "" && o.url !== "#",
  );
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

  // "Знакомьтесь: опытный архитектор из Вены."
  // The name is deliberately left out — it already stands large just above
  // the introduction, and repeating it here ("Представляем: David Kort")
  // read as a stutter. The opener keeps the warm, human tone; the sentence
  // introduces the person by trade and place, not by name twice.
  const parts = [adjective, trade].filter(Boolean).join(" ");
  const leadCore = place ? `${parts} ${from} ${place}` : parts;
  const lead = `${opener}: ${leadCore}.`;

  // Trade first, direction second. Most trades read fine on their
  // direction's line; the handful that do not are listed by slug.
  const dir = directionOfCategoryL(p.mainCategory, locale);
  const byHand =
    intro.byHandTrade[p.mainCategory] ??
    (dir ? (intro.byHand[dir.slug] ?? intro.byHand.other) : null);

  return {
    lead,
    // The "what they do" line is intentionally gone: it was assembled from
    // the same services that already appear as their own block just below,
    // so it repeated them word for word. The introduction now introduces;
    // the services list lists.
    does: null,
    byHand,
    more: hasExternalLinks(p) ? intro.more : null,
  };
}
