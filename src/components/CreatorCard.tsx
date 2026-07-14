import { LocaleLink } from "./LocaleLink";
import type { Profile } from "@/lib/types";
import { VerifiedBadge, FeaturedBadge } from "./Badges";
import { ExternalLink } from "./icons";
import { profileBasePath } from "@/lib/profile-path";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

/**
 * Creator card: work image on top, author row (avatar, name bold,
 * category regular, status badge right), one-two line description, tags
 * (country + a keyword or two), external "Visit" button — a jump to the
 * creator's own platform, not a purchase on the site.
 */
export function CreatorCard({
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

  const href =
    visitHref ??
    profile.socialLinks.portfolio ??
    profile.socialLinks.website ??
    "#";
  const label =
    visitLabel ??
    (profile.socialLinks.portfolio ? dict.profile.visitPortfolio : dict.profile.visitWebsite);

  return (
    <article className="card card-hover flex flex-col">
      {/* Work image */}
      <LocaleLink lang={lang} href={profileHref} className="relative block aspect-[4/3] overflow-hidden" style={{ background: "var(--color-brand-soft)" }}>
        {profile.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.mainImage} alt={`${dict.common.humanMadeWork} — ${profile.name}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <PlaceholderArt seed={profile.slug} label={dict.common.humanMadeWork} />
        )}
      </LocaleLink>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Author row */}
        <div className="flex items-start justify-between gap-2">
          <LocaleLink lang={lang} href={profileHref} className="flex min-w-0 items-center gap-2.5">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt={profile.name}
                loading="lazy"
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.8rem] font-bold text-white"
                style={{ background: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              >
                {initials}
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                {profile.name}
              </span>
              <span className="block truncate text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                {categoryName}
              </span>
            </span>
          </LocaleLink>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <FeaturedBadge status={profile.status} dict={dict} />
            <VerifiedBadge status={profile.verificationStatus} dict={dict} />
          </div>
        </div>

        {/* Short description */}
        <p className="line-clamp-2 text-[0.92rem] leading-snug" style={{ color: "var(--color-muted)" }}>
          {profile.shortDescription}
        </p>

        {/* Tags: country + a keyword or two */}
        <div className="flex flex-wrap gap-1.5">
          <span className="pill">{profile.country}</span>
          {(profile.tags ?? []).slice(0, 2).map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>

        {/* Visit button */}
        <div className="mt-auto pt-1">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="btn btn-quiet btn-full !py-2.5 text-[0.92rem]"
          >
            {label}
            <ExternalLink size={16} />
          </a>
        </div>
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
