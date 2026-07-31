import { cache } from "react";
import type { Profile } from "@/lib/types";
import { profiles as staticProfiles } from "@/data/profiles";
import { getConfirmedSubmissions } from "@/lib/redis";
import { submissionToProfile } from "@/lib/submission-to-profile";

/**
 * The catalog as it actually stands: the profiles kept in the repository
 * plus everyone who has been approved and has confirmed their email.
 *
 * Until now a profile only existed if somebody added it to src/data by
 * hand, which meant every new author waited for a deploy. Approval now
 * puts them in the catalog on its own. The repository file stays as the
 * source of the demo profile and of anything that has to survive an empty
 * store, so the site is never blank.
 *
 * Two people are involved in every published profile and both have to act:
 * the owner approves the application, and the applicant clicks the link in
 * the welcome letter. `getConfirmedSubmissions` is exactly that pair of
 * conditions, which is why it is the only door in.
 *
 * If the store is unreachable this returns the repository profiles alone.
 * A catalog missing its newest entries is a bad day; a catalog that throws
 * on every page is a broken site.
 */

/** Wrapped in `cache` so one page render reads the store once, however
 *  many components ask for the list. */
export const getLiveProfiles = cache(async (): Promise<Profile[]> => {
  let submissions;
  try {
    submissions = await getConfirmedSubmissions();
  } catch {
    return staticProfiles;
  }

  if (!submissions.length) return staticProfiles;

  // Oldest first, so addresses are handed out in the order people joined
  // and stay the same as the catalog grows. Building newest-first would
  // reshuffle who gets "anna-petrova" and who gets "anna-petrova-2" every
  // time somebody new arrived.
  const ordered = [...submissions].sort((a, b) => a.createdAt - b.createdAt);

  // Two passes, and the order matters. A team can only point at members
  // who already have a profile, and a team is often approved before some
  // of its people have joined. Converting everyone else first means a team
  // is matched against the finished catalog rather than against whoever
  // happened to be published earlier that week — so a member who joins
  // later is picked up on the next build with nothing to re-approve.
  const out: Profile[] = [...staticProfiles];

  for (const s of ordered) {
    if (s.profileType === "team") continue;
    const { profile } = submissionToProfile(s, out);
    if (profile) out.push(profile);
  }

  for (const s of ordered) {
    if (s.profileType !== "team") continue;
    const { profile } = submissionToProfile(s, out);
    if (profile) out.push(profile);
  }

  return out;
});
