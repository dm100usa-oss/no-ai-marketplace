import { LocaleLink } from "./LocaleLink";
import type { Profile } from "@/lib/types";
import { VerifiedBadge, FeaturedBadge } from "./Badges";
import { profileBasePath } from "@/lib/profile-path";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

/**
 * Creator card: the work, then three short lines under it.
 *
 * The picture is what a visitor stops on, so it gets the space; the name,
 * the trade and the badges say who made it, and everything else belongs
 * on the profile page rather than on a tile in a row of tiles.
 */
/** "3 человека" / "3 people" — Russian needs one, few and many forms. */
function peopleCount(n: number, dict: Dictionary): string {
  const [one, few, many] = dict.common.peopleForms;
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word = many;
  if (mod10 === 1 && mod100 !== 11) word = one;
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = few;
  return `${n} ${word}`;
}

/** Badge shown over the work image for teams and companies. A single
 *  creator gets none — the plain card already reads as one person. */
function typeBadge(
  profile: Profile,
  dict: Dictionary,
): { label: string; bg: string } | null {
  if (profile.profileType === "company") {
    return { label: dict.common.badgeCompany, bg: "#2f5cb0" };
  }
  if (profile.profileType === "team") {
    const label = profile.teamSize
      ? dict.common.badgeTeamWithSize.replace("{n}", peopleCount(profile.teamSize, dict))
      : dict.common.badgeTeam;
    return { label, bg: "#0f7a58" };
  }
  return null;
}

export async function CreatorCard({
  lang,
  dict,
  profile,
  categoryName,
  visitLabel,
  visitHref,
}: {
  lang: Locale;
  dict: Dictionary;
  profile: Profile;
  categoryName: string;
  /** Visit label + href resolved by caller (portfolio vs website). */
  visitLabel?: string;
  visitHref?: string;
}) {
  const basePath = profileBasePath(profile.profileType);
  const profileHref = `${basePath}/${profile.slug}`;
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const badge = typeBadge(profile, dict);
  // A single creator reads as a person (round avatar); a team or company
  // reads as a group (rounded square).
  const isGroup = profile.profileType !== "creator";

  return (
    <article className="card card-hover flex flex-col">
      {/* Work image.
          Two behaviours on purpose.
          On a phone the catalog is a single column, so the cards can be any
          height without anything getting out of order: the work is shown
          whole, in its own shape, exactly as its author made it. Cutting a
          book cover down to a strip of its middle is the last thing a
          directory built on trusting people should do.
          From tablet width up the cards stand side by side and have to line
          up, so there the work is fitted inside one frame and the leftover
          space is filled with the soft brand colour. Nothing is cropped
          either way. */}
      {/* The work, in one frame for every card.
          Cropped, deliberately. A catalog is a row of things being
          compared, and rows only compare when they line up; a frame that
          fits every shape leaves half the cards floating in empty space,
          which is exactly what made the page look twenty years old. The
          crop is taken from the middle, and the work is shown whole on
          the profile, one tap away. */}
      <LocaleLink lang={lang} href={profileHref} className="relative block aspect-[4/3] overflow-hidden" style={{ background: "var(--color-brand-soft)" }}>
        {profile.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.mainImage} alt={`${dict.common.humanMadeWork}: ${profile.name}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <PlaceholderArt seed={profile.slug} label={dict.common.humanMadeWork} />
        )}
        {badge && (
          <span
            className="absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-md px-2.5 py-1 text-[0.72rem] font-semibold text-white"
            style={{ background: badge.bg, fontFamily: "var(--font-display)" }}
          >
            {badge.label}
          </span>
        )}
        {profile.demo && (
          <span
            className="absolute right-2.5 top-2.5 rounded-md px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide"
            style={{
              background: "rgba(22,35,58,0.72)",
              color: "#fff",
              fontFamily: "var(--font-display)",
            }}
          >
            {dict.common.badgeDemo}
          </span>
        )}
      </LocaleLink>

      {/* Everything under the picture, kept short on purpose.
          The card used to carry nine things: avatar, name, trade, badges,
          a team line, a description, a "makes" line, country tags and a
          button. That is a profile page squeezed into a tile, and it read
          like a directory from twenty years ago: the work, which is the
          only reason anyone stops, got a third of the card and the text
          got the rest.
          Now the picture leads and three lines follow. Everything else
          lives on the profile, one tap away. */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2.5">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt=""
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
              className={`h-9 w-9 shrink-0 object-cover ${isGroup ? "rounded-[0.6rem]" : "rounded-full"}`}
            />
          ) : (
            <span
              aria-hidden
              className={`grid h-9 w-9 shrink-0 place-items-center text-[0.8rem] font-bold text-white ${
                isGroup ? "rounded-[0.6rem]" : "rounded-full"
              }`}
              style={{
                background: badge?.bg ?? "var(--color-ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              {initials}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-semibold leading-tight notranslate" translate="no" style={{ fontFamily: "var(--font-display)" }}>
              {profile.name}
            </span>
            <span className="block truncate text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
              {[categoryName, profile.city].filter(Boolean).join(" \u00b7 ")}
            </span>
          </span>
        </div>

        {(profile.status === "featured" ||
          profile.verificationStatus !== "none") && (
          <div className="flex flex-wrap items-center gap-1.5">
            <FeaturedBadge status={profile.status} dict={dict} />
            <VerifiedBadge
              status={profile.verificationStatus}
              dict={dict}
              profileType={profile.profileType}
            />
          </div>
        )}
      </div>
    </article>
  );
}

/** Deterministic soft placeholder when a card has no image yet. */
function PlaceholderArt({ seed, label }: { seed: string; label: string }) {
  const hues = ["#e3ecfb", "#dff1e9", "#eae4fa", "#fbeedb", "#fbe4e9", "#fce7dc", "#ddf0f2"];
  let h = 0;
  for (const c of seed) h = (h + c.charCodeAt(0)) % hues.length;
  const bg = hues[h];
  const bg2 = hues[(h + 3) % hues.length];
  return (
    <div className="grid h-full w-full place-items-center" style={{ background: `linear-gradient(135deg, ${bg}, ${bg2})` }}>
      <span className="text-[0.78rem] font-medium tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
        {label}
      </span>
    </div>
  );
}
