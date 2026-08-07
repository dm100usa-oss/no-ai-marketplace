import type { Profile, SocialLinks, TeamMember } from "@/lib/types";
import type { Submission } from "@/lib/redis";
import {
  categorySlugFromName,
  categorySlugsFromNames,
  directionSlugForCategory,
} from "@/lib/category-lookup";
import { uniqueSlug } from "@/lib/slugify";

/**
 * Turning an approved application into a catalog profile.
 *
 * Two shapes of the same person. The application is what somebody typed
 * into a form: categories written out as words, links in one blob, members
 * as a list of names. A profile is what the catalog runs on: slugs,
 * structured links, members pointing at real pages. This file is the only
 * translation between them, so publishing stays one call and nothing has
 * to be retyped by hand.
 *
 * Nothing is invented here. Where the application is silent the profile
 * field is left empty and the page falls back to what it already does for
 * a missing field. The one place that would be tempting to guess at — an
 * unrecognised category — deliberately refuses instead: a profile filed
 * under the wrong trade is worse than one waiting for a human to look.
 */

/** Split whatever the form sent into clean lines. Forms send one long
 *  string with newlines, or an array, depending on the field type. */
function lines(value: string[] | string | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : value.split(/[\n\r]+/);
  return raw.map((s) => s.trim()).filter(Boolean);
}

/** The same split, with the blanks left in place. Used where position
 *  carries meaning: stage three with no caption has to stay stage three. */
function slots(value: string[] | string | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : value.split(/[\n\r]+/);
  return raw.map((s) => s.trim());
}

/** An address as typed, made usable.
 *
 *  People write their own address the way they say it out loud:
 *  "www.amazon.com/stores/...", "amazon.com/...", occasionally with a
 *  stray space or a comma stuck to the end. A browser forgives all of
 *  that; our outbound link does not. It insists on a full address and
 *  sends anything else to the catalog instead, so a link that looked
 *  perfectly fine in the profile quietly went nowhere and the author's
 *  own page — the whole point of the listing — was unreachable.
 *
 *  So the missing beginning is added here, once, at the moment the
 *  application becomes a profile. Anything that already carries a scheme
 *  is left exactly as it is, including mailto: and other non-web
 *  addresses, which the outbound route still refuses on its own. */
function tidyUrl(value: string): string {
  let url = value.trim();
  if (!url) return url;

  // People label their links the way they would in a message: "Амазон
  // https://...", "мой Etsy: https://...". Taken whole, the label became
  // part of the address and the link led nowhere — and it failed silently,
  // because a broken address still looks like a link on the page. So the
  // address is lifted out of the line: everything from the scheme up to
  // the first space.
  const scheme = url.search(/https?:\/\//i);
  if (scheme > 0) url = url.slice(scheme);
  if (scheme < 0) {
    // No scheme anywhere: the address may still be sitting after a label,
    // so the first word that looks like a domain wins.
    const word = url
      .split(/\s+/)
      .find((w) => /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(w));
    if (word) url = word;
  }
  url = url.split(/\s+/)[0];

  url = url.replace(/[),.;]+$/, "");
  if (!url) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
  return `https://${url.replace(/^\/+/, "")}`;
}

/** Platform names as their owners write them. Used to label a second or
 *  third address on the same platform: "amazon.com" under an author's two
 *  books reads like a machine's note, "Amazon" reads like a link. */
const SLOT_NAMES: Partial<Record<keyof SocialLinks, string>> = {
  etsy: "Etsy",
  amazon: "Amazon",
  behance: "Behance",
  dribbble: "Dribbble",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
};

/** Sort a pile of links into named platforms. People paste them in any
 *  order and any format, so matching is by what the address contains,
 *  not by position. Anything unrecognised is kept under "other" rather
 *  than dropped: an unknown platform is still a way to reach someone. */
function buildSocialLinks(s: Submission): SocialLinks {
  const out: SocialLinks = {};
  const other: { label: string; url: string }[] = [];

  const all = [s.website, ...lines(s.otherLinks)]
    .filter(Boolean)
    .map((v) => tidyUrl(v as string))
    // A line with no address in it at all — "напишите мне в телеграм" —
    // used to end up as a link to a one-word host, printed on the page as
    // if it led somewhere. Anything without a dot in the host is not an
    // address and is dropped rather than shown.
    .filter((v) => {
      if (!v) return false;
      try {
        return new URL(v).hostname.includes(".");
      } catch {
        return false;
      }
    });

  // Which named slot a link belongs to, or nothing when the platform is
  // one we do not name.
  const slotOf = (u: string): keyof SocialLinks | undefined => {
    if (u.includes("etsy.")) return "etsy";
    // Amazon's own short links carry the shop's name nowhere in the
    // address, so without naming them a book link was labelled "Website"
    // and lost the one word that tells a visitor what waits on the other
    // side of it.
    if (u.includes("amazon.") || u.includes("amzn.to") || u.includes("//a.co/"))
      return "amazon";
    if (u.includes("behance.")) return "behance";
    if (u.includes("dribbble.")) return "dribbble";
    if (u.includes("linkedin.")) return "linkedin";
    if (u.includes("instagram.")) return "instagram";
    if (u.includes("youtube.") || u.includes("youtu.be")) return "youtube";
    return undefined;
  };

  for (const url of all) {
    const u = url.toLowerCase();
    const slot = slotOf(u);

    if (slot) {
      // A named slot holds one address, and an author with two books on
      // Amazon used to lose the second one without a word. The extras go
      // to the general list instead, so every address the author gave is
      // on the page — which is the whole point of the block.
      if (!out[slot]) (out[slot] as string) = url;
      else other.push({ label: SLOT_NAMES[slot] ?? hostOf(url), url });
      continue;
    }

    if (!out.website) out.website = url;
    else if (!out.portfolio) out.portfolio = url;
    else other.push({ label: hostOf(url), url });
  }

  if (other.length) out.other = other;
  return out;
}

/** The site name, for labelling a link nobody recognised. */
function hostOf(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(
      /^www\./,
      "",
    );
  } catch {
    return "Link";
  }
}

/** Names reduced to a comparable form, so "Анна Петрова" and
 *  "анна  петрова" are recognised as the same person. */
function nameKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Members of a team, matched against profiles that already exist.
 *
 * The catalog rule is that a member is always someone with their own
 * profile: that is what makes a team page a list of checkable people
 * rather than a list of names. Matching is by name, because a name is all
 * the contact person is asked for, and names are typed loosely — hence the
 * flattening above.
 *
 * A member who has not joined yet is returned with an empty slug. The team
 * page shows that row as plain grey text with no link, and it does not
 * count towards the team. The gap is deliberately visible: the contact
 * person pays for the page and looks at it, and an obvious blank does more
 * to get the others to sign up than any rule could.
 */
export function matchTeamMembers(
  raw: string[] | undefined,
  existing: Profile[],
): TeamMember[] {
  const byName = new Map<string, Profile>();
  for (const p of existing) {
    if (p.profileType !== "creator") continue;
    const key = nameKey(p.name);
    if (!byName.has(key)) byName.set(key, p);
  }

  return lines(raw).map((line) => {
    // "Анна Петрова, иллюстратор" — name first, role after the separator.
    // Splitting on a bare hyphen would be wrong: it lives inside names
    // ("Кто-то", "Жан-Люк", "Мария-Тереза") far more often than it
    // separates a role, so only a comma or a spaced dash counts.
    const [namePart, ...rolePart] = line.split(/,| [—–-] /);
    const name = namePart.trim();
    const role = rolePart.join(",").trim() || undefined;
    const found = byName.get(nameKey(name));
    // Once matched, the name shown is the one on that person's own
    // profile. The contact person types the roster from memory, in a
    // hurry, and a member listed as "анна  петрова" on one page and "Анна
    // Петрова" on her own looks like two different people.
    return { name: found?.name ?? name, role, slug: found?.slug ?? "" };
  });
}

/**
 * The captions exactly as the profile will print them.
 *
 * A caption belongs to a picture, and a picture the author did not upload
 * takes its caption with it. The profile drops both together; the
 * translator, working from the raw application, did not, and came back
 * with one caption more than there were pictures. Every English caption
 * then sat one work too early, while the Russian page, built from the
 * same application, was right — the kind of difference nobody spots
 * without opening both pages side by side.
 *
 * So the two now read from one place. Whatever is translated is what the
 * page shows, in the same order and the same number.
 */
export function submissionDisplayCaptions(s: Submission): {
  galleryCaptions?: string[];
  stageCaptions?: string[];
} {
  const rawWorks =
    s.mainImage && !(s.gallery ?? []).includes(s.mainImage)
      ? [s.mainImage, ...slots(s.gallery)]
      : slots(s.gallery);

  const galleryCaptions = rawWorks
    .map((src, i) => ({ src: src.trim(), caption: slots(s.galleryCaptions)[i]?.trim() ?? "" }))
    .filter((pair) => pair.src)
    .map((pair) => pair.caption);

  const stageCaptions = slots(s.stages)
    .map((src, i) => ({ src: src.trim(), caption: slots(s.stageCaptions)[i]?.trim() ?? "" }))
    .filter((pair) => pair.src)
    .map((pair) => pair.caption);

  return {
    galleryCaptions: galleryCaptions.length ? galleryCaptions : undefined,
    stageCaptions: stageCaptions.length ? stageCaptions : undefined,
  };
}

/** How many members actually count: only those with a profile. */
export function linkedMemberCount(members: TeamMember[]): number {
  return members.filter((m) => m.slug).length;
}

/**
 * Whether a team application may go live.
 *
 * Owner's rule: two real profiles. One person is not a team, but four are
 * not required either — two people working together are a team, and making
 * them wait for a full house would hold up something that is already true.
 * The contact person counts as one of the two.
 */
export function teamIsPublishable(members: TeamMember[]): boolean {
  return linkedMemberCount(members) >= 2;
}

export interface ConversionResult {
  profile?: Profile;
  /** Why this application could not be turned into a profile yet. Shown in
   *  the moderation screen so the reason is visible rather than guessed. */
  problem?: "unknown-category" | "team-too-small";
  /** Members named in a team application who have no profile yet. */
  missingMembers?: string[];
}

/**
 * One application, converted. `existing` is every profile already in the
 * catalog: it supplies the addresses that are taken and the people a team
 * can point at.
 */
export function submissionToProfile(
  s: Submission,
  existing: Profile[],
): ConversionResult {
  const mainCategory = categorySlugFromName(s.mainCategory);
  if (!mainCategory) return { problem: "unknown-category" };

  const direction = directionSlugForCategory(mainCategory);
  if (!direction) return { problem: "unknown-category" };

  const profileType = s.profileType ?? "creator";
  const taken = new Set(existing.map((p) => p.slug));
  const slug = uniqueSlug(s.name, taken, s.id);

  let members: TeamMember[] | undefined;
  let teamSize: number | undefined;
  let missingMembers: string[] | undefined;

  if (profileType === "team") {
    // The contact person is part of the team, not somebody above it, and
    // the form may or may not repeat them in the roster. Adding them when
    // they are missing means the count is the same either way.
    const roster = [...(s.members ?? [])];
    if (s.contactPerson && !roster.some((m) => nameKey(m).startsWith(nameKey(s.contactPerson!)))) {
      roster.unshift(s.contactPerson);
    }
    members = matchTeamMembers(roster, existing);
    const missing = members.filter((m) => !m.slug).map((m) => m.name);
    missingMembers = missing.length ? missing : undefined;

    if (!teamIsPublishable(members)) {
      return { problem: "team-too-small", missingMembers };
    }
    teamSize = linkedMemberCount(members);
  }

  // Works and their captions, paired by position before the blanks are
  // dropped.
  //
  // Each work is its own question in the form and so is each caption, and
  // an author who skips one picture in the middle still answers the
  // captions after it. Filtering the two lists separately then slid every
  // remaining caption up by one, and the page printed the wrong title
  // under the wrong picture, confidently and without any sign that
  // anything was missing. The stages were fixed this way already; the
  // works were left with the same fault.
  //
  // The first line puts work one back where it belongs. Older
  // applications were stored with it lifted out of the list, from the
  // days when the profile printed a large picture above the rest; that
  // heading is gone, so on those the author's first work was missing from
  // their own page and every caption sat one work too early. New
  // applications already arrive whole, which is why this only acts when
  // the picture is genuinely absent from the list.
  const rawWorks =
    s.mainImage && !(s.gallery ?? []).includes(s.mainImage)
      ? [s.mainImage, ...slots(s.gallery)]
      : slots(s.gallery);

  const gallery = rawWorks.map((src) => src.trim()).filter(Boolean);
  const captions = submissionDisplayCaptions(s).galleryCaptions ?? [];

  // Work stages. Two rules decide what travels here.
  //
  // First, permission: the pictures are kept in the application whatever
  // the answer was, because the owner has to see them at review time, but
  // only `stagesPublic` lets them onto the page. An author under an
  // agreement must be able to prove their process without publishing it.
  //
  // Second, order: a stage caption belongs to the stage above it, so the
  // two lists are paired by position before the empty slots are dropped.
  // Filtering each list on its own would slide caption three under stage
  // two the moment somebody left a picture out of the middle.
  const stagePairs = s.stagesPublic
    ? slots(s.stages)
        .map((src, i) => ({ src: src.trim(), caption: slots(s.stageCaptions)[i]?.trim() ?? "" }))
        .filter((pair) => pair.src)
    : [];
  const stages = stagePairs.map((pair) => pair.src);
  const stageCaptions = stagePairs.map((pair) => pair.caption);

  const profile: Profile = {
    id: s.id,
    slug,
    name: s.name,
    profileType,

    // Everyone starts on the free listing. Paid standing is a billing
    // matter and is set separately; publishing must never imply payment.
    status: "free",
    verificationStatus: s.verification ?? "none",
    verifiedDate: s.verifiedAt
      ? new Date(s.verifiedAt).toISOString().slice(0, 10)
      : undefined,

    mainCategory,
    additionalCategories: categorySlugsFromNames(s.additionalCategories, mainCategory),
    direction,

    country: s.country ?? "",
    city: s.city,

    // Carried through as typed. The page decides whether to use them,
    // because only the page knows which language it is being read in.
    nameAlt: s.nameAlt,
    cityAlt: s.cityAlt,

    shortDescription: s.shortDescription ?? "",
    fullDescription: s.fullDescription,

    // Which language these fields are in, and the same fields in the
    // other one. Carried through untouched: choosing between them is the
    // page's job, at the moment it knows which language it is being read
    // in, and this file has no idea.
    textLang: s.lang === "ru" ? "ru" : "en",
    textTranslations: s.translations,

    services: lines(s.services),

    socialLinks: buildSocialLinks(s),

    avatar: s.avatar,
    mainImage: s.mainImage ?? gallery[0],
    gallery: gallery.length ? gallery : undefined,
    galleryCaptions:
      gallery.length && captions.some(Boolean) ? captions : undefined,

    stages: stages.length ? stages : undefined,
    stageCaptions: stages.length && stageCaptions.some(Boolean) ? stageCaptions : undefined,

    showOnHomepage: s.showOnHomepage,
    foundedYear: profileType === "company" ? s.foundedYear : undefined,

    members,
    teamSize,
    contactPerson: profileType === "team" ? s.contactPerson : undefined,

    dateCreated: new Date(s.createdAt).toISOString().slice(0, 10),
  };

  // An empty additional list reads better as absent than as [].
  if (!profile.additionalCategories?.length) delete profile.additionalCategories;
  if (!profile.services?.length) delete profile.services;

  return { profile, missingMembers };
}
