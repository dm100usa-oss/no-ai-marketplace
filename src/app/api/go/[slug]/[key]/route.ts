import { NextResponse } from "next/server";
import { getLiveProfiles } from "@/lib/live-profiles";
import type { Profile } from "@/lib/types";

/**
 * Outbound links, resolved at the moment somebody clicks.
 *
 * A professional's own address is the payoff of this whole directory: it
 * is what a client came for and what a member pays to have listed. Printed
 * into the page it is also the one thing a machine can lift and hand back
 * without anybody visiting — the answer given, the catalog skipped, and
 * the listing paid for but bypassed.
 *
 * So the page carries a link to this route instead, and the real address
 * is looked up here and returned as a redirect. A visitor notices nothing:
 * same single click, same destination. What changes is that the address is
 * no longer sitting in the HTML for anything that reads the page without
 * clicking. robots.txt disallows this path, so a well-behaved crawler does
 * not follow it either.
 *
 * This is deliberately not a defence against a determined scraper — a
 * script can follow a redirect. It is a defence against the ordinary case:
 * bulk collection that reads pages and never clicks.
 */

/** Which link each key stands for. Keys are short and stable because they
 *  end up in URLs; renaming one would break links already sent around. */
function linkFor(p: Profile, key: string): string | undefined {
  const s = p.socialLinks;

  switch (key) {
    case "website":
      return s.website;
    case "portfolio":
      return s.portfolio;
    case "etsy":
      return s.etsy;
    case "amazon":
      return s.amazon;
    case "behance":
      return s.behance;
    case "dribbble":
      return s.dribbble;
    case "linkedin":
      return s.linkedin;
    case "instagram":
      return s.instagram;
    case "youtube":
      return s.youtube;
    default:
      break;
  }

  // Anything the sorter did not recognise is numbered: other-0, other-1.
  // Position is stable for a given profile because the links are read in
  // the order the professional entered them.
  const m = /^other-(\d+)$/.exec(key);
  if (m) return (s.other ?? [])[Number(m[1])]?.url;

  return undefined;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string; key: string }> },
) {
  const { slug, key } = await ctx.params;

  const profiles = await getLiveProfiles();
  const profile = profiles.find((p) => p.slug === slug);
  const target = profile ? linkFor(profile, key) : undefined;

  // No profile, no such link, or a link that is not a web address: send the
  // visitor to the catalog rather than showing them an error. They were on
  // their way to somebody's work; the catalog is the nearest useful place.
  if (!target || !/^https?:\/\//i.test(target)) {
    return NextResponse.redirect(new URL("/directory", _req.url), 302);
  }

  // 302 rather than 301: the destination belongs to the member and changes
  // when they edit their profile. A permanent redirect would be cached by
  // browsers and outlive the edit.
  const res = NextResponse.redirect(target, 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
