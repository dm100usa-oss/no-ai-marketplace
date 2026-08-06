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
import { buildIntroduction } from "@/lib/introduction";
import { countryCode } from "@/lib/country-name";
import { localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  categoryNameL,
  getAllProfilesL,
  getCategoryL,
  directionOfCategoryL,
  resolveVisitL,
  getTeamOfCreatorL,
} from "@/lib/localized-data";

/**
 * Full profile view. Covers every field on the profile: identity,
 * category, country, description, services and products, portfolio and
 * gallery, video, languages, working process, AI statement, verification
 * detail, all external links, Visit buttons, related profiles in the same
 * category, and a report form. Same component powers both creator and
 * company pages — profileType only changes JSON-LD.
 */
/** Where a member's photo will go.
 *
 *  Same silhouette as the empty catalog slot: it reads as "a face goes
 *  here" without asking anyone to decode initials that belong to nobody.
 *  The tint is picked from the slug, so each row keeps its own colour and
 *  four people never end up in four identical grey squares. Once a member
 *  has an avatar on their own profile, that photo takes this place. */
const MEMBER_TINTS = [
  { bg: "#e3ecfb", ink: "rgba(47,92,176,0.55)" },
  { bg: "#dff1e9", ink: "rgba(15,122,88,0.55)" },
  { bg: "#eae4fa", ink: "rgba(103,84,168,0.55)" },
  { bg: "#fbeedb", ink: "rgba(169,105,26,0.55)" },
  { bg: "#fbe4e9", ink: "rgba(180,72,104,0.5)" },
  { bg: "#ddf0f2", ink: "rgba(30,140,150,0.55)" },
];

function memberTint(seed: string) {
  let h = 0;
  for (const c of seed) h = (h + c.charCodeAt(0)) % MEMBER_TINTS.length;
  return MEMBER_TINTS[h];
}

function MemberAvatar({ src, seed, alt }: { src?: string; seed: string; alt: string }) {
  const tint = memberTint(seed);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        width={200}
        height={200}
        loading="lazy"
        decoding="async"
        className="h-11 w-11 shrink-0 rounded-[0.7rem] object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.7rem]"
      style={{ background: tint.bg }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.6" fill={tint.ink} />
        <path d="M4.8 20c0-3.6 3.2-6 7.2-6s7.2 2.4 7.2 6" fill={tint.ink} />
      </svg>
    </span>
  );
}

export async function ProfileView({
  lang,
  dict,
  profile: p,
}: {
  lang: Locale;
  dict: Dictionary;
  profile: Profile;
}) {
  const dir = directionOfCategoryL(p.mainCategory, lang);
  // The team this person belongs to, if any. Stored once on the team and
  // read back here, so the two pages point at each other without keeping
  // the same list twice.
  const team =
    p.profileType === "creator" ? await getTeamOfCreatorL(p.slug, lang) : undefined;
  const members = p.profileType === "team" ? (p.members ?? []) : [];
  // A member's own photo, when their profile already carries one. Looked
  // up once here rather than per row.
  const memberAvatars: Record<string, string | undefined> = {};
  if (members.length > 0) {
    const all = await getAllProfilesL(lang);
    for (const m of members) {
      memberAvatars[m.slug] = all.find((x) => x.slug === m.slug)?.avatar;
    }
  }
  const cat = getCategoryL(p.mainCategory, lang);
  const visit = resolveVisitL(p, {
    portfolio: dict.profile.visitPortfolio,
    website: dict.profile.visitWebsite,
    visit: dict.profile.visit,
  });

  // The main button goes through the site as well, so the destination is
  // not printed in the page. Which of the professional's addresses it
  // leads to is already decided by resolveVisitL; this only converts that
  // choice into the matching key.
  const visitKey =
    visit.href && visit.href === p.socialLinks.portfolio ? "portfolio" : "website";
  const visitHref = `/api/go/${p.slug}/${visitKey}`;
  const basePath = profileBasePath(p.profileType);

  // Whether the words on this page are the author's own or a machine's.
  // True only when a translation actually exists and is being shown: an
  // author writing in the language of the page needs no notice, and one
  // whose translation failed is reading their own original, not a
  // translation, so the notice would be a lie in the other direction.
  const showsTranslation =
    !!p.textLang && p.textLang !== lang && !!p.textTranslations?.[lang];

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
      // The two-letter country code rather than its name. Schema.org asks
      // for it, and a code is the same fact in every language: a search
      // engine reading the Russian page and one reading the English page
      // should not conclude they are looking at two different countries.
      address: {
        "@type": "PostalAddress",
        addressCountry: countryCode(p.country) ?? p.country,
        addressLocality: p.city,
      },
      url: `${site.url}${localizedPath(lang, `${basePath}/${p.slug}`)}`,
      // Schema.org has a field for exactly this, and answer engines read it
      // when someone asks for an established studio rather than any studio.
      // Person has no foundingDate, so it is added for organizations only.
      ...(p.profileType !== "creator" && p.foundedYear
        ? { foundingDate: p.foundedYear }
        : {}),
      // The services list doubles as the machine-readable answer to "what
      // do they actually do", which is the question an AI answer is built
      // around. Written out as a plain list of offered services.
      ...(p.services?.length
        ? {
            makesOffer: p.services.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s },
            })),
          }
        : {}),
    },
  };

  // The address the big button leads to is left out of the list below:
  // "Открыть сайт" followed by a line saying "Сайт" is the same address
  // written twice.
  const externalLinks = collectLinks(p, dict, visitKey);
  const relatedProfiles = await getRelatedProfiles(p, 3, lang);
  const workingProcess = deriveWorkingProcess(p, dict);
  const kindWord = kindWordFor(p.profileType, dict);
  const intro = buildIntroduction(p, dict, lang);

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
        <div className="lg:col-start-1 lg:row-start-1">
          {/* Header */}
          <div className="flex items-start gap-5">
            {p.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatar}
                alt={p.name}
                width={600}
                height={600}
                decoding="async"
                className="h-32 w-32 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="grid h-32 w-32 shrink-0 place-items-center rounded-2xl text-[2.2rem] font-bold text-white"
                style={{ background: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              >
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="text-[1.75rem] leading-tight notranslate" translate="no">{p.name}</h1>
              {/* Badges stacked, First-in-category above Verified, each on
                  its own line so they never drift apart on a narrow phone. */}
              {(p.status === "featured" ||
                p.verificationStatus !== "none") && (
                <div className="mt-2 flex flex-col items-start gap-1.5">
                  <FeaturedBadge status={p.status} dict={dict} />
                  <VerifiedBadge status={p.verificationStatus} dict={dict} />
                </div>
              )}
              <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {cat ? cat.name : categoryNameL(p.mainCategory, lang)}
                {" · "}
                {p.city ? `${p.city}, ` : ""}
                {p.country}
                {/* How long the company has been working. Sits in the same
                    grey line as trade and place rather than in a badge of
                    its own: it is context, not an award. Companies only —
                    for one person the year of a first order says little. */}
                {p.profileType === "company" && p.foundedYear
                  ? ` · ${dict.profile.inBusinessSince} ${p.foundedYear}`
                  : ""}
              </p>
              {/* Additional categories, shown as clickable tags. Follows the
                  common portfolio pattern (Behance, Dribbble): the main role
                  reads above, secondary specialisations sit below as pills,
                  each linking to its own category page. This surfaces the
                  author under every discipline they picked in the join form
                  — both for people browsing and for search/AI. The main
                  category is filtered out so it is not repeated, and the row
                  renders only when there is at least one extra. */}
              {(() => {
                const extras = (p.additionalCategories ?? []).filter(
                  (slug) => slug !== p.mainCategory,
                );
                if (extras.length === 0) return null;
                return (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {extras.map((slug) => (
                      <LocaleLink
                        key={slug}
                        lang={lang}
                        href={`/categories/${slug}`}
                        className="rounded-full px-2.5 py-1 text-[0.8rem] transition-colors"
                        style={{
                          background: "var(--color-brand-soft)",
                          color: "var(--color-ink)",
                        }}
                      >
                        {categoryNameL(slug, lang)}
                      </LocaleLink>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Introduction. The platform speaking about the author, before
              anything else on the page. A profile that opens with a name
              and a job title reads like a listing in a phone book; a few
              warm, accurate sentences read like an introduction between
              people, which is what this place is for.

              Set on its own soft plate so it is clearly the platform's
              voice, not the author's own words further down the page. */}
          <div
            className="mt-5 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4"
            style={{
              background: "var(--color-brand-soft)",
              border: "1px solid rgba(22, 35, 58, 0.05)",
            }}
          >
            {"text" in intro ? (
              <p
                className="whitespace-pre-line text-[1.1rem] leading-relaxed"
                style={{ color: "var(--color-ink)", textAlign: "justify" }}
              >
                {(() => {
                  // If the introduction opens with a lead word and a colon
                  // ("Знакомьтесь: ...", "Meet: ..."), that opener is set in
                  // bold so the warm greeting stands out; the rest reads as
                  // normal prose. No colon — the whole text stays plain.
                  const m = intro.text.match(/^([^\s:]+):\s([\s\S]*)$/);
                  if (m) {
                    return (
                      <>
                        <strong style={{ fontWeight: 700 }}>{m[1]}:</strong> {m[2]}
                      </>
                    );
                  }
                  return intro.text;
                })()}
              </p>
            ) : (
              <>
                <p
                  className="text-[1.05rem] font-semibold leading-snug sm:text-[1.15rem]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {intro.lead}
                </p>
                {intro.does && (
                  <p
                    className="mt-1 text-[0.98rem] leading-relaxed"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {intro.does}
                  </p>
                )}
                {intro.byHand && (
                  <p
                    className="mt-1.5 text-[0.95rem] leading-relaxed"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {intro.byHand}
                  </p>
                )}
                {intro.more && (
                  <p
                    className="mt-1.5 text-[0.95rem] leading-relaxed"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {intro.more}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Description. Shown only when there is no hand-written
              introduction: the introduction up top already tells the
              author's story in their own words, so repeating the
              description here would say the same thing twice. Profiles
              without a hand-written intro still show it, so the page never
              opens with the assembled one-liner alone. */}
          {!p.introduction && (
            <div className="mt-6">
              <p className="text-[1.05rem]" style={{ color: "var(--color-ink)" }}>
                {p.shortDescription}
              </p>
              {p.fullDescription && (
                <p className="mt-3 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
                  {p.fullDescription}
                </p>
              )}
              {/* Said plainly, once, under the words it applies to. A
                  machine translation passed off as the author's own would
                  be the one dishonest thing on a page whose entire subject
                  is honesty about how work gets made. Naming the original
                  language also tells a reader who speaks it where to go. */}
              {showsTranslation && (
                <p
                  className="mt-3 text-[0.82rem]"
                  style={{ color: "var(--color-muted-soft)" }}
                >
                  {dict.profile.autoTranslated.replace(
                    "{lang}",
                    dict.profile.autoTranslatedFrom[p.textLang as "en" | "ru"],
                  )}
                </p>
              )}
            </div>
          )}

          {/* Who is in the team. It sits high on the page on purpose: the
              catalog sells checkable people, and a team is only as
              convincing as the four profiles behind it. Every row leads to
              that person's own profile, because a member without one is
              not a member at all. */}
          {members.length > 0 && (
            <div className="mt-8">
              <h2 className="!text-[1.35rem]">{dict.profile.membersTitle}</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                {dict.profile.membersHint}
              </p>
              <ul className="mt-3">
                {members.map((m) => (
                  <li
                    key={m.slug}
                    className="border-t"
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    <LocaleLink
                      lang={lang}
                      href={`/creators/${m.slug}`}
                      className="flex items-center gap-3 py-3"
                    >
                      <MemberAvatar src={memberAvatars[m.slug]} seed={m.slug} alt={m.name} />
                      <span className="min-w-0 flex-1">
                        <span
                          className="block truncate font-semibold notranslate"
                          translate="no"
                          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                        >
                          {m.name}
                        </span>
                        {m.role ? (
                          <span className="block truncate text-[0.9rem]" style={{ color: "var(--color-muted)" }}>
                            {m.role}
                          </span>
                        ) : null}
                      </span>
                      <ArrowRight size={16} />
                    </LocaleLink>
                  </li>
                ))}
              </ul>
              {p.contactPerson ? (
                <p
                  className="border-t pt-3 text-[0.92rem]"
                  style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
                >
                  {dict.profile.contactPerson}: {p.contactPerson}
                </p>
              ) : null}
            </div>
          )}

          {/* The other direction: a creator's page says which team they are
              part of and leads there. */}
          {team && (
            <div className="mt-6">
              <LocaleLink
                lang={lang}
                href={`/teams/${team.slug}`}
                className="inline-flex items-center gap-2 text-[0.95rem] font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {dict.profile.memberOfTeam.replace("{team}", team.name)}
                <ArrowRight size={15} />
              </LocaleLink>
            </div>
          )}

          {/* Services / products — one compact line each, so they name what
              the author does without pushing the portfolio down the page. */}
          {(p.services?.length || p.products?.length) ? (
            <div className="mt-6 space-y-2">
              {p.services?.length ? (
                <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
                    {dict.profile.services}:
                  </span>{" "}
                  {p.services.join(" · ")}
                </p>
              ) : null}
              {p.products?.length ? (
                <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
                    {dict.profile.products}:
                  </span>{" "}
                  {p.products.join(" · ")}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Portfolio / gallery — the whole set. There is no separate hero
              image above any more, so every work lives here in one place,
              under its own heading. */}
          {p.gallery?.length ? (
            <div className="mt-8">
              <h2 className="!text-[1.35rem]">{dict.profile.portfolio}</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                {dict.profile.portfolioHint}
              </p>
              <GalleryLightbox
                images={p.gallery}
                captions={p.galleryCaptions}
                name={p.name}
                workLabel={dict.states.slotTagWork ?? "Work"}
              />
              <p className="mt-3 text-[0.95rem] leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {dict.profile.portfolioMore}
              </p>
            </div>
          ) : null}

          {/* Work stages — the proof block, under the portfolio because it
              is read after the work, not instead of it. Present only when
              the author sent stages and allowed them to be shown; the
              permission is decided upstream, so an empty field here means
              exactly one thing: nothing to show. */}
          {p.stages?.length ? (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">{dict.profile.stagesTitle}</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                {dict.profile.stagesHint}
              </p>
              <GalleryLightbox
                images={p.stages}
                captions={p.stageCaptions}
                name={p.name}
                variant="stages"
                workLabel={dict.profile.stageLabel}
              />
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
                  {p.verifiedDate
                    ? `${dict.profile.reviewedByHand}, ${new Intl.DateTimeFormat(
                        lang === "ru" ? "ru-RU" : "en-US",
                        { day: "numeric", month: "long", year: "numeric" },
                      ).format(new Date(p.verifiedDate))}`
                    : dict.profile.reviewedByHand}
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

        </div>

        {/* ------------------------- Sidebar ------------------------- */}
        <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-32 lg:self-start">
          <div className="card p-5">
            {p.demo ? (
              // On the demo profile the Visit button has nowhere real to go,
              // so it leads to the join page instead: someone who liked the
              // example can step straight into making their own.
              <LocaleLink
                lang={lang}
                href="/join"
                className="btn btn-accent btn-full"
              >
                {visit.label}
                <ArrowRight size={16} />
              </LocaleLink>
            ) : (
              <a
                href={visitHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn btn-accent btn-full"
              >
                {visit.label}
                <ExternalLink size={16} />
              </a>
            )}

            {externalLinks.length > 0 ? (
              <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                {/* No name here. The heading used to read "Где найти
                    Дмитрий", which is wrong Russian — the name would have
                    to change its ending — and no wording works for every
                    name in every language a directory this size will
                    collect. The kind of participant says the same thing
                    and never has to be declined. */}
                <p className="mb-1 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  {p.profileType === "company"
                    ? dict.profile.ownPagesStudio
                    : p.profileType === "team"
                      ? dict.profile.ownPagesTeam
                      : dict.profile.ownPagesCreator}
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

          {/* How the work is done, tucked under the contact card.

              It belongs next to the links, not in the middle of the
              story: it answers the question a visitor asks right after
              deciding they like somebody — what happens if I write to
              them. In the main column it sat between the work and the
              rest of the catalog, where nobody was asking it yet. */}
          {/* Working process */}
          {workingProcess.length > 0 && (
            <div className="card mt-4 p-5">
              <h2 className="!text-[1.05rem]">{dict.profile.workingProcess}</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                {p.profileType === "creator"
                  ? dict.profile.workingProcessHintCreator
                  : dict.profile.workingProcessHintStudio}
              </p>
              <ol className="mt-4 space-y-3">
                {workingProcess.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.78rem] font-bold text-white"
                      style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>

        {/* --------------------- Below the fold ---------------------
            Related profiles and the report form used to sit at the end of
            the main column, which put them above the contact panel on a
            phone: the panel is a side column only while there is a side,
            and on a narrow screen it simply falls to the bottom. So a
            visitor scrolled past somebody's profile, met six other
            people, and only then found the link they came for.

            They are their own block now, placed on the second row of the
            grid. On a wide screen nothing moves; on a phone the contacts
            come first and these follow. */}
        <div className="lg:col-start-1 lg:row-start-2">
          {/* Related profiles in the same category */}
          {relatedProfiles.length > 0 && (
            <div className="mt-4 lg:mt-12">
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
      </div>
    </div>
  );
}

/* ------------------------- helpers ------------------------- */

/**
 * The professional's own addresses, as links to go through this site.
 *
 * `href` points at /api/go/... rather than at the destination. The real
 * address is resolved when somebody clicks; see that route for why. A
 * visitor sees no difference — one click, same place.
 *
 * `skipKey` is the address the big button above already leads to. Without
 * it the panel said "Открыть сайт" and then listed "Сайт" underneath: the
 * same address twice, one line apart, which reads like a mistake because
 * it is one.
 *
 * Two addresses on the same platform are kept together and numbered. An
 * author with two books on Amazon used to see them split by whatever
 * platform happened to sort between them, and both labelled "Amazon", so
 * the list looked broken and neither label said which book it led to.
 */
function collectLinks(
  p: Profile,
  dict: Dictionary,
  skipKey?: string,
): { label: string; href: string }[] {
  const s = p.socialLinks;
  const go = (key: string) => `/api/go/${p.slug}/${key}`;

  /** group: what platform this address belongs to, so the list can keep
   *  them side by side and number them. */
  const items: { label: string; href: string; group: string }[] = [];
  const add = (key: string, label: string, url?: string) => {
    if (!url || key === skipKey) return;
    items.push({ label, href: go(key), group: label });
  };

  add("website", dict.profile.linkWebsite, s.website);
  add("portfolio", dict.profile.linkPortfolio, s.portfolio);
  add("etsy", dict.profile.linkEtsy, s.etsy);
  add("amazon", dict.profile.linkAmazon, s.amazon);
  add("behance", dict.profile.linkBehance, s.behance);
  add("dribbble", dict.profile.linkDribbble, s.dribbble);
  add("linkedin", dict.profile.linkLinkedin, s.linkedin);
  add("instagram", dict.profile.linkInstagram, s.instagram);
  add("youtube", dict.profile.linkYoutube, s.youtube);
  (s.other ?? []).forEach((o, i) =>
    items.push({ label: o.label, href: go(`other-${i}`), group: o.label }),
  );

  // Regroup, keeping the order each platform first appeared in.
  const groups: string[] = [];
  for (const it of items) if (!groups.includes(it.group)) groups.push(it.group);

  const out: { label: string; href: string }[] = [];
  for (const g of groups) {
    const inGroup = items.filter((it) => it.group === g);
    inGroup.forEach((it, i) =>
      out.push({
        // Numbered only when there is something to tell apart. A lone
        // Amazon link is "Amazon", not "Amazon 1".
        label: inGroup.length > 1 ? `${it.label} ${i + 1}` : it.label,
        href: it.href,
      }),
    );
  }
  return out;
}

/** Same-category profiles excluding the current one, capped to `limit`. */
async function getRelatedProfiles(
  p: Profile,
  limit: number,
  lang: Locale,
): Promise<Profile[]> {
  return (await getAllProfilesL(lang))
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
