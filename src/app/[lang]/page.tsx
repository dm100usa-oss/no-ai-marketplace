import { LocaleLink } from "@/components/LocaleLink";
import { DirectionTile } from "@/components/DirectionTile";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { FAQ } from "@/components/FAQ";
import { FindAccordion } from "@/components/FindAccordion";
import { PeopleMarquee } from "@/components/PeopleMarquee";
import { NewMembersMarquee } from "@/components/NewMembersMarquee";
import { StatsBand } from "@/components/StatsBand";
import { PulseIcon } from "@/components/PulseIcon";
import {
  ArrowRight,
  CheckShield,
  TeamIcon,
} from "@/components/icons";
import { getDictionary } from "@/i18n";
import { categoryCount } from "@/lib/plural";
import { getWeeklyVisits, getAverageRating } from "@/lib/redis";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import {
  getActiveDirectionsL,
  getAllCategoriesL,
  getCategoriesByDirectionL,
  getFeaturedProfilesL,
  getNewestProfilesL,
  directionOfCategoryL,
} from "@/lib/localized-data";

/** Drawings for "How the platform works", one per card, in card order.
 *  Each keeps its own aspect ratio: the box is fixed at 64 wide, the height
 *  follows the drawing, so nothing is stretched or squashed. */
const HOW_ICONS = [
  { file: "people", w: 64, h: 75 },
  { file: "shopfront", w: 64, h: 55 },
  { file: "verified", w: 64, h: 72 },
];

/** Re-read on every request: the band must show today's numbers, not
 *  the numbers that happened to be true when the site was built. */
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  // Live figures for the band. Both come back null when there is nothing
  // real yet, and the band renders nothing at all in that case.
  const [visits, { average: rating }] = await Promise.all([
    getWeeklyVisits(),
    getAverageRating(),
  ]);

  const dirs = getActiveDirectionsL(locale);
  const featured = getFeaturedProfilesL(locale).slice(0, 6);
  const newest = getNewestProfilesL(locale, 6);

  // Named, not sliced. Taking the first eight of the list gave whatever
  // happened to sit at the top of categories.ts — four painters and four
  // writers, in file order, which is not what "popular" means. These eight
  // are the ones actually in demand, and the order here is the order on
  // screen.
  const POPULAR = [
    "graphic-designers",
    "web-developers",
    "video-editors",
    "ui-ux-designers",
    "illustrators",
    "copywriters",
    "photographers",
    "3d-designers",
  ];

  const allCats = getAllCategoriesL(locale);
  const popularCategories = POPULAR.map((slug) => allCats.find((c) => c.slug === slug))
    // A typo in a slug should drop one tile, not take down the page.
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .map((c) => ({
      ...c,
      direction: directionOfCategoryL(c.slug, locale),
    }));

  const faqItems = dict.home.faq;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ---------- Hero ---------- */}
      <section className="relative flex items-center justify-center overflow-hidden py-6 sm:py-10">
        {/* The hero image is the LCP element on the home page. fetchPriority
            tells the browser to start it ahead of the lazy images further
            down, and width/height give it the aspect ratio up front so the
            block never resizes once the file lands. */}
        <img
          src="/images/hero.webp"
          alt=""
          width={1799}
          height={929}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "18% center" }}
        />
        <div className="relative flex w-full items-center justify-center px-4">
          <div
            className="mx-auto w-[92%] max-w-2xl rounded-2xl px-6 py-5 text-center sm:w-[80%] sm:px-10 sm:py-8"
            style={{ background: "rgba(219,233,255,0.61)", backdropFilter: "blur(2px)" }}
          >
            <h1 className="text-balance text-[0.95rem] sm:text-[1.35rem] md:text-[1.7rem]" style={{ marginTop: "0" }}>{dict.site.name}</h1>
            <p
              className="mt-3 text-[1.25rem] font-bold leading-tight sm:text-[1.9rem] md:text-[2.15rem]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {dict.site.tagline}
            </p>
            <p
              className="mt-1.5 text-[1.05rem] font-normal leading-tight sm:text-[1.5rem] md:text-[1.7rem]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {dict.site.taglineSub}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- People band ---------- */}
      <PeopleMarquee lang={locale} />

      {/* ---------- Stats band ---------- */}
      {/* Live from Redis: views over the last 7 days and the average of
          approved reviews.

          The star always shows. With no approved reviews the average comes
          back null and the band shows 0.0 — a site with nothing rated yet,
          said plainly. The moment the first review is approved the real
          average takes its place on the next page load, with no code
          change: the page is force-dynamic and reads Redis every time.

          Views keep the other rule: no views means no counter at all,
          because a "0 visits this week" would be counting the person who
          is reading it. */}
      <StatsBand
        locale={locale}
        visits={visits}
        visitsLabel={dict.home.statsVisitsLabel}
        rating={rating ?? 0}
      />

      {/* ---------- Steps ---------- */}
      <section className="section pt-6 sm:pt-8">
        <div className="container-page">
          <div className="flex flex-col gap-7">
            {dict.home.steps.map((step) => (
              <div key={step.title}>
                <p
                  className="text-[1.35rem] font-bold md:text-[1.6rem]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {step.title}
                </p>
                <p className="mt-1.5 text-[1.05rem]" style={{ color: "var(--color-ink)" }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Hero content ---------- */}
      {/* Tighter on top than a normal .section: this block belongs to the
          people band above it, not to the page below. */}
      <section className="section pt-6 sm:pt-8">
        <div className="container-page">
          {/* Advantages — the page opens on the numbers: they answer
              "why this platform" before anything else is asked of the reader.
              The intro line lives in the hero above and is not repeated here. */}
          {/* Indented by the width of a bullet plus its gap (0.7rem +
              0.75rem), so the heading starts exactly above the text of the
              points below it rather than above their bullets.

              Spacing rhythm for all three headings on this page: 2.5rem of
              air above, 0.75rem below. A heading equidistant from the block
              before it and the list under it belongs to neither; pulling it
              close to its own text is what makes it read as a heading. */}
          <p
            className="pl-[1.45rem] text-left text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroAdvantagesTitle}
          </p>
          <div className="mt-3">
            <ul className="flex flex-col gap-2.5 text-[1.05rem]">
              {dict.home.heroAdvantages.map((line) => {
                const m = line.match(/^(\d+%)/);
                const head = m ? m[1] : null;
                return (
                  <li
                    key={line}
                    className={head ? "flex items-center gap-3" : "flex items-start gap-3"}
                    style={{ color: "var(--color-ink)" }}
                  >
                    {/* The bullet hangs from the top of a normal line, but a
                        row carrying a big figure is taller than one line, so
                        there it centres against the figure instead. */}
                    <span
                      aria-hidden="true"
                      className={`shrink-0 rounded-full${head ? "" : " mt-[0.45rem]"}`}
                      style={{
                        width: "0.7rem",
                        height: "0.7rem",
                        background: "radial-gradient(circle at 30% 30%, #6f92cf, #325ba3 70%, #274a86)",
                        boxShadow: "0 1px 2px rgba(30,50,90,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
                      }}
                    />
                    <span>
                      {head ? (
                        <span className="flex items-center gap-2.5">
                          {/* Double size on the figure itself: it is the one
                              thing that has to land before anything is read.
                              leading-none keeps the taller glyph from pushing
                              the line apart. */}
                          <span
                            className="text-[2.1rem] font-bold leading-none"
                            style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
                          >
                            {head}
                          </span>
                          <span>{line.slice(head.length).trim()}</span>
                        </span>
                      ) : (
                        line
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* For clients — same heading style and bullets, then the Find action */}
          <p
            className="mt-10 pl-[1.45rem] text-left text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroClientsTitle}
          </p>
          <div className="mt-3">
            <ul className="flex flex-col gap-2.5 text-[1.05rem]">
              {dict.home.heroClients.map((line) => (
                <li key={line} className="flex items-start gap-3" style={{ color: "var(--color-ink)" }}>
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] shrink-0 rounded-full"
                    style={{
                      width: "0.7rem",
                      height: "0.7rem",
                      background: "radial-gradient(circle at 30% 30%, #6f92cf, #325ba3 70%, #274a86)",
                      boxShadow: "0 1px 2px rgba(30,50,90,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
                    }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <FindAccordion
            lang={locale}
            label={dict.home.heroFindButton}
            actions={dict.home.heroActions}
          />

          {/* For creators — same heading style and bullets, then the Join action */}
          <p
            className="mt-10 pl-[1.45rem] text-left text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroCreatorsTitle}
          </p>
          <div className="mt-3">
            <ul className="flex flex-col gap-2.5 text-[1.05rem]">
              {dict.home.heroCreators.map((line) => (
                <li key={line} className="flex items-start gap-3" style={{ color: "var(--color-ink)" }}>
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] shrink-0 rounded-full"
                    style={{
                      width: "0.7rem",
                      height: "0.7rem",
                      background: "radial-gradient(circle at 30% 30%, #6f92cf, #325ba3 70%, #274a86)",
                      boxShadow: "0 1px 2px rgba(30,50,90,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
                    }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Built to match the find button above it exactly: same rounding,
              same padding, same type size, same lift. Only the colour differs,
              and the icon on the right is a team rather than a magnifier. */}
          <div className="mt-6">
            <LocaleLink
              lang={locale}
              href="/join"
              className="join-btn press-btn relative flex w-full items-center justify-center rounded-2xl px-6 py-4"
              style={{ color: "#ffffff" }}
            >
              <span
                className="text-[1.15rem] font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {dict.home.heroJoinButton}
              </span>
              <span className="absolute right-6 flex items-center">
                <PulseIcon offbeat>
                  <TeamIcon size={30} />
                </PulseIcon>
              </span>
            </LocaleLink>
          </div>

          {/* The project's call, closing the block. It lands where the
              reader has just been told what the platform gives creators and
              is deciding whether to join, so it argues rather than
              decorates. Centred and quiet: a line that has to shout is a
              line that is not believed. */}
          <p
            className="mt-5 text-center text-[1.05rem] italic leading-snug sm:text-[1.15rem]"
            style={{ color: "var(--color-muted)" }}
          >
            {dict.home.heroSlogan}
          </p>

        </div>
      </section>

      {/* ---------- New members marquee ---------- */}
      <NewMembersMarquee
        lang={locale}
        title={dict.home.newMembersTitle}
        namePlaceholder={dict.home.newMembersNamePlaceholder}
      />

      {/* ---------- Explore directions ---------- */}
      <section className="section">
        <div className="container-page">
          {/* A plain heading, not a SectionHeading: the subtitle explained
              how to use tiles that explain themselves, and the "all
              directions" link pointed at a page showing the same ten tiles
              already on screen. Both were noise. Indented to the same
              1.45rem as the headings above, so the whole page keeps one
              left edge. */}
          <p
            className="mb-3 text-center text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.exploreDirections}
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {dirs.map((d) => {
              const count = getCategoriesByDirectionL(d.slug, locale).length;
              return (
                <DirectionTile
                  key={d.slug}
                  lang={locale}
                  href={`/directions/${d.slug}`}
                  title={d.name}
                  color={d.color}
                  subtitle={categoryCount(count, dict)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Popular categories ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading
            lang={locale}
            title={dict.home.popularCategories}
            action={{ href: "/categories", label: dict.common.seeAll }}
          >
            {dict.home.popularCategoriesSub}
          </SectionHeading>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((c) => (
              <LocaleLink
                key={c.slug}
                lang={locale}
                href={`/categories/${c.slug}`}
                className="rounded-xl border bg-white px-4 py-3 transition-colors hover:border-[var(--color-accent)]"
                style={{ borderColor: "var(--color-line)" }}
              >
                <div
                  className="text-[0.72rem] font-semibold uppercase tracking-wide"
                  style={{ color: c.direction ? `var(--color-dir-${c.direction.color}-ink)` : "var(--color-muted-soft)" }}
                >
                  {c.direction?.name ?? dict.common.category}
                </div>
                <div
                  className="mt-1 text-[0.98rem] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {c.name}
                </div>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How the platform works ---------- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading lang={locale} title={dict.home.howItWorks}>
            {dict.home.howItWorksSub}
          </SectionHeading>
          <div className="grid gap-6 sm:grid-cols-3">
            {dict.home.howItWorksCards.map((item, i) => (
              <div key={i} className="flex gap-3">
                <img
                  src={`/images/how/${HOW_ICONS[i].file}.webp`}
                  alt=""
                  aria-hidden="true"
                  width={HOW_ICONS[i].w}
                  height={HOW_ICONS[i].h}
                  loading="lazy"
                  decoding="async"
                  className="block shrink-0 self-start"
                />
                <div>
                  <h3>{item.t}</h3>
                  <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What this place is ---------- */}
      {/* Moved below "how the platform works": the reader now knows how it
          runs, and this states plainly what the place is. Same tint as the
          stats band so the quiet claims read as one voice. */}
      <section className="pt-2">
        <div className="container-page">
          <div
            className="mx-[1.45rem] rounded-xl px-6 py-5"
            style={{
              background: "rgba(219,233,255,0.61)",
              borderLeft: "3px solid var(--color-accent)",
            }}
          >
            <p
              className="text-[1rem] leading-[1.7] sm:text-[1.05rem]"
              style={{ color: "var(--color-ink)" }}
            >
              {dict.home.heroStatement}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Featured creators ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading
            lang={locale}
            title={dict.home.featuredCreators}
            action={{ href: "/directory?sort=featured", label: dict.common.seeAll }}
          >
            {dict.home.featuredCreatorsSub}
          </SectionHeading>
          <ProfileGrid lang={locale} dict={dict} profiles={featured} />
        </div>
      </section>

      {/* ---------- For buyers & For creators ---------- */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Buyers */}
            <div
              className="flex flex-col rounded-2xl border p-6 md:p-8"
              style={{ borderColor: "var(--color-line)", background: "#fff" }}
            >
              <img
                src="/images/how/buyers.webp"
                alt=""
                aria-hidden="true"
                width={120}
                height={97}
                loading="lazy"
                decoding="async"
                className="block"
              />
              <h2 className="mt-4">{dict.home.forBuyers}</h2>
              <p className="mt-3" style={{ color: "var(--color-muted)" }}>
                {dict.home.forBuyersText}
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {dict.home.forBuyersPoints.map((line) => (
                  <li key={line} className="flex gap-2">
                    <CheckShield size={16} className="mt-0.5 shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <LocaleLink lang={locale} href="/directory" className="btn btn-quiet">
                  {dict.home.browseCatalog}
                  <ArrowRight size={16} />
                </LocaleLink>
              </div>
            </div>

            {/* Creators */}
            <div
              className="flex flex-col rounded-2xl border p-6 md:p-8"
              style={{
                borderColor: "var(--color-brand)",
                background: "var(--color-brand-soft)",
              }}
            >
              <img
                src="/images/how/creators.webp"
                alt=""
                aria-hidden="true"
                width={120}
                height={88}
                loading="lazy"
                decoding="async"
                className="block"
              />
              <h2 className="mt-4">{dict.home.forCreators}</h2>
              <p className="mt-3" style={{ color: "var(--color-muted)" }}>
                {dict.home.forCreatorsText}
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {dict.home.forCreatorsPoints.map((line) => (
                  <li key={line} className="flex gap-2">
                    <CheckShield size={16} className="mt-0.5 shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <LocaleLink lang={locale} href="/join" className="btn btn-ink">
                  {dict.home.addProfile}
                  <ArrowRight size={16} />
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- New profiles ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading
            lang={locale}
            title={dict.home.newProfiles}
            action={{ href: "/directory", label: dict.common.browseCatalog }}
          >
            {dict.home.newProfilesSub}
          </SectionHeading>
          <ProfileGrid lang={locale} dict={dict} profiles={newest} />
        </div>
      </section>

      {/* ---------- Verification block ---------- */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2>{dict.home.verificationTitle}</h2>
            <p className="lead mt-4">{dict.home.verificationText}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <LocaleLink lang={locale} href="/verified" className="btn btn-quiet">
                {dict.home.seeVerified}
              </LocaleLink>
              <LocaleLink lang={locale} href="/method" className="btn btn-quiet">
                {dict.home.standardsLink}
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading lang={locale} title={dict.home.faqTitle} />
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="section-dark section">
        <div className="container-page text-center">
          <h2 className="text-white">{dict.home.closingTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">{dict.home.closingText}</p>
          <LocaleLink lang={locale} href="/join" className="btn btn-accent btn-lg mt-6">
            {dict.home.closingCta}
            <ArrowRight />
          </LocaleLink>
        </div>
      </section>
    </>
  );
}
