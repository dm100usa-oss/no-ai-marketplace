import { LocaleLink } from "@/components/LocaleLink";
import { profileBasePath } from "@/lib/profile-path";
import type { Profile } from "@/lib/types";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerifiedBadge, FeaturedBadge } from "@/components/Badges";
import { CreatorCard } from "@/components/CreatorCard";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { ReportForm } from "@/components/ReportForm";
import { ExternalLink, ArrowRight, CheckShield } from "@/components/icons";
import { localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  categoryNameL,
  getAllProfilesL,
  getCategoryL,
  directionOfCategoryL,
  resolveVisitL,
} from "@/lib/localized-data";

/**
 * Full profile view. Covers every field on the profile: identity,
 * category, country, description, services and products, portfolio and
 * gallery, video, languages, working process, AI statement, verification
 * detail, all external links, Visit buttons, related profiles in the same
 * category, and a report form. Same component powers both creator and
 * company pages — profileType only changes JSON-LD.
 */
export function ProfileView({
  lang,
  dict,
  profile: p,
}: {
  lang: Locale;
  dict: Dictionary;
  profile: Profile;
}) {
  const dir = directionOfCategoryL(p.mainCategory, lang);
  const cat = getCategoryL(p.mainCategory, lang);
  const visit = resolveVisitL(p, {
    portfolio: dict.profile.visitPortfolio,
    website: dict.profile.visitWebsite,
    visit: dict.profile.visit,
  });
  const basePath = profileBasePath(p.profileType);

  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    inLanguage: lang,
    mainEntity: {
      "@type": p.profileType === "creator" ? "Person" : "Organization",
      name: p.name,
      description: p.shortDescription,
      address: { "@type": "PostalAddress", addressCountry: p.country, addressLocality: p.city },
      url: `${site.url}${localizedPath(lang, `${basePath}/${p.slug}`)}`,
    },
  };

  const externalLinks = collectLinks(p, dict);
  const relatedProfiles = getRelatedProfiles(p, 3, lang);
  const workingProcess = deriveWorkingProcess(p, dict);
  const kindWord = kindWordFor(p.profileType, dict);

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        lang={lang}
        items={[
          { label: dict.common.home, href: "/" },
          ...(dir ? [{ label: dir.name, href: `/directions/${dir.slug}` }] : []),
          ...(cat ? [{ label: cat.name, href: `/categories/${cat.slug}` }] : []),
          { label: p.name },
        ]}
      />

      {p.demo && (
        <div
          className="mb-6 rounded-xl border px-4 py-3"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <p
            className="text-[0.95rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.common.demoNoticeTitle}
          </p>
          <p className="mt-1 text-[0.88rem] leading-snug" style={{ color: "var(--color-muted)" }}>
            {dict.common.demoNoticeText}
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* ------------------------- Main column ------------------------- */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-4">
            {p.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatar}
                alt={p.name}
                width={600}
                height={600}
                decoding="async"
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-[1.3rem] font-bold text-white"
                style={{ background: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              >
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[1.75rem] leading-tight">{p.name}</h1>
                <FeaturedBadge status={p.status} dict={dict} />
                <VerifiedBadge status={p.verificationStatus} dict={dict} />
              </div>
              <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {cat ? cat.name : categoryNameL(p.mainCategory, lang)}
                {" · "}
                {p.city ? `${p.city}, ` : ""}
                {p.country}
              </p>
            </div>
          </div>

          {/* Main work image / hero */}
          <div
            className="mt-6 grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-2xl"
            style={{ background: "var(--color-brand-soft)", color: "var(--color-muted-soft)" }}
          >
            {p.mainImage ? (
              <GalleryLightbox
                images={
                  p.gallery?.length
                    ? Array.from(new Set([p.mainImage, ...p.gallery]))
                    : [p.mainImage]
                }
                name={p.name}
                variant="hero"
                heroAlt={p.name}
              />
            ) : (
              <span className="text-[0.85rem]">{dict.common.humanMadeWork}</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-[1.05rem]" style={{ color: "var(--color-ink)" }}>
              {p.shortDescription}
            </p>
            {p.fullDescription && (
              <p className="mt-3 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
                {p.fullDescription}
              </p>
            )}
          </div>

          {/* Services / products */}
          {(p.services?.length || p.products?.length) ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {p.services?.length ? (
                <div>
                  <h3 className="mb-2">{dict.profile.services}</h3>
                  <ul className="space-y-1.5">
                    {p.services.map((s) => (
                      <li key={s} className="flex gap-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                        <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {p.products?.length ? (
                <div>
                  <h3 className="mb-2">{dict.profile.products}</h3>
                  <ul className="space-y-1.5">
                    {p.products.map((s) => (
                      <li key={s} className="flex gap-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                        <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Portfolio / gallery */}
          {p.gallery?.length ? (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">{dict.profile.portfolio}</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                {dict.profile.portfolioHint}
              </p>
              <GalleryLightbox images={p.gallery} name={p.name} />
            </div>
          ) : null}

          {/* Video links */}
          {p.videoLinks?.length ? (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">{dict.profile.video}</h2>
              <ul className="mt-3 space-y-2">
                {p.videoLinks.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-2 text-[0.95rem] font-semibold"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {dict.profile.watchExternal}
                      <ExternalLink size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Working process */}
          {workingProcess.length > 0 && (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">{dict.profile.workingProcess}</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                {p.profileType === "creator"
                  ? dict.profile.workingProcessHintCreator
                  : dict.profile.workingProcessHintStudio}
              </p>
              <ol className="mt-4 space-y-3">
                {workingProcess.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.85rem] font-bold text-white"
                      style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* AI statement */}
          {p.aiUsageStatement && (
            <div
              className="mt-10 rounded-xl border p-4"
              style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
            >
              <h3 className="mb-1 text-[1rem]">{dict.profile.onAiTitle}</h3>
              <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {p.aiUsageStatement}
              </p>
            </div>
          )}

          {/* Verification detail */}
          {p.verificationStatus !== "none" && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
              <div className="mb-2 flex items-center gap-2">
                <VerifiedBadge status={p.verificationStatus} dict={dict} />
                <span className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                  {dict.profile.reviewedByHand}
                </span>
              </div>
              {p.verificationDescription && (
                <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  {p.verificationDescription}
                </p>
              )}
              <LocaleLink
                lang={lang}
                href="/verified"
                className="mt-2 inline-flex items-center gap-1 text-[0.9rem] font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {dict.profile.howVerificationWorks} <ArrowRight size={14} />
              </LocaleLink>
            </div>
          )}

          {/* Related profiles in the same category */}
          {relatedProfiles.length > 0 && (
            <div className="mt-12">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="!text-[1.35rem]">
                  {dict.profile.moreInPrefix} {cat ? cat.name.toLowerCase() : dict.profile.moreInFallback}
                </h2>
                {cat && (
                  <LocaleLink
                    lang={lang}
                    href={`/categories/${cat.slug}`}
                    className="text-[0.9rem] font-semibold"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {dict.profile.seeAll}
                  </LocaleLink>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProfiles.map((rp) => (
                  <CreatorCard
                    key={rp.slug}
                    lang={lang}
                    dict={dict}
                    profile={rp}
                    categoryName={categoryNameL(rp.mainCategory, lang)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Report a problem */}
          <div className="mt-12">
            <ReportForm dict={dict} profileName={p.name} profileSlug={`${basePath}/${p.slug}`} />
          </div>
        </div>

        {/* ------------------------- Sidebar ------------------------- */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="card p-5">
            <a
              href={visit.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn btn-accent btn-full"
            >
              {visit.label}
              <ExternalLink size={16} />
            </a>

            {externalLinks.length > 1 ? (
              <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <p className="mb-1 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  {p.profileType === "creator"
                    ? `${dict.profile.whereToFind} ${p.name.split(" ")[0]}`
                    : dict.profile.whereToFindThem}
                </p>
                {externalLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-between text-[0.92rem]"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {l.label}
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            ) : null}

            {p.languages?.length ? (
              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <p className="mb-1 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  {dict.profile.languages}
                </p>
                <p className="text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
                  {p.languages.join(", ")}
                </p>
              </div>
            ) : null}

            <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
              <div className="flex flex-wrap gap-1.5">
                <span className="pill">{p.country}</span>
                {(p.tags ?? []).map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            </div>

            <p
              className="mt-4 flex gap-2 border-t pt-4 text-[0.82rem]"
              style={{ color: "var(--color-muted-soft)", borderColor: "var(--color-line)" }}
            >
              <CheckShield size={14} className="mt-0.5 shrink-0" />
              {dict.profile.purchaseNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------- helpers ------------------------- */

function collectLinks(p: Profile, dict: Dictionary): { label: string; href: string }[] {
  const s = p.socialLinks;
  const out: { label: string; href: string }[] = [];
  if (s.website) out.push({ label: dict.profile.linkWebsite, href: s.website });
  if (s.portfolio) out.push({ label: dict.profile.linkPortfolio, href: s.portfolio });
  if (s.etsy) out.push({ label: dict.profile.linkEtsy, href: s.etsy });
  if (s.amazon) out.push({ label: dict.profile.linkAmazon, href: s.amazon });
  if (s.behance) out.push({ label: dict.profile.linkBehance, href: s.behance });
  if (s.dribbble) out.push({ label: dict.profile.linkDribbble, href: s.dribbble });
  if (s.linkedin) out.push({ label: dict.profile.linkLinkedin, href: s.linkedin });
  if (s.instagram) out.push({ label: dict.profile.linkInstagram, href: s.instagram });
  if (s.youtube) out.push({ label: dict.profile.linkYoutube, href: s.youtube });
  (s.other ?? []).forEach((o) => out.push({ label: o.label, href: o.url }));
  return out;
}

/** Same-category profiles excluding the current one, capped to `limit`. */
function getRelatedProfiles(p: Profile, limit: number, lang: Locale): Profile[] {
  return getAllProfilesL(lang)
    .filter(
      (x) =>
        x.slug !== p.slug &&
        (x.mainCategory === p.mainCategory ||
          (x.additionalCategories ?? []).includes(p.mainCategory)),
    )
    .slice(0, limit);
}

/** The word used for this participant: creator, team or studio. */
function kindWordFor(type: Profile["profileType"], dict: Dictionary): string {
  if (type === "company") return dict.profile.kindStudio;
  if (type === "team") return dict.profile.kindTeam;
  return dict.profile.kindCreator;
}

/** A short working-process outline derived from the profile, localized. */
function deriveWorkingProcess(p: Profile, dict: Dictionary): string[] {
  const kind = kindWordFor(p.profileType, dict);
  const step3 =
    p.profileType === "creator"
      ? dict.profile.processStep3Creator
      : dict.profile.processStep3Company;
  return [
    dict.profile.processStep1.replace("{kind}", kind),
    dict.profile.processStep2,
    step3,
    dict.profile.processStep4.replace("{kind}", kind),
  ];
}
