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

/** Sort a pile of links into named platforms. People paste them in any
 *  order and any format, so matching is by what the address contains,
 *  not by position. Anything unrecognised is kept under "other" rather
 *  than dropped: an unknown platform is still a way to reach someone. */
function buildSocialLinks(s: Submission): SocialLinks {
  const out: SocialLinks = {};
  const other: { label: string; url: string }[] = [];

  const all = [s.website, ...lines(s.otherLinks)].filter(Boolean) as string[];

  for (const url of all) {
    const u = url.toLowerCase();
    if (u.includes("etsy.")) out.etsy ??= url;
    else if (u.includes("amazon.")) out.amazon ??= url;
    else if (u.includes("behance.")) out.behance ??= url;
    else if (u.includes("dribbble.")) out.dribbble ??= url;
    else if (u.includes("linkedin.")) out.linkedin ??= url;
    else if (u.includes("instagram.")) out.instagram ??= url;
    else if (u.includes("youtube.") || u.includes("youtu.be")) out.youtube ??= url;
    else if (!out.website) out.website = url;
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

  const gallery = lines(s.gallery);
  const captions = lines(s.galleryCaptions);

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

    shortDescription: s.shortDescription ?? "",
    fullDescription: s.fullDescription,

    services: lines(s.services),

    socialLinks: buildSocialLinks(s),

    avatar: s.avatar,
    mainImage: s.mainImage ?? gallery[0],
    gallery: gallery.length ? gallery : undefined,
    galleryCaptions: captions.length ? captions : undefined,

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
