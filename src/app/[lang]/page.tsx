import { LocaleLink } from "@/components/LocaleLink";
import { DirectionTile } from "@/components/DirectionTile";
import { SectionHeading } from "@/components/States";
import { FAQ } from "@/components/FAQ";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FindAccordion } from "@/components/FindAccordion";
import { PeopleMarquee } from "@/components/PeopleMarquee";
import { NewMembersMarquee } from "@/components/NewMembersMarquee";
import { StatsBand } from "@/components/StatsBand";
import { PulseIcon } from "@/components/PulseIcon";
import {
  ArrowRight,
  TeamIcon,
} from "@/components/icons";
import { getDictionary } from "@/i18n";
import { profileBasePath } from "@/lib/profile-path";
import { categoryCount } from "@/lib/plural";
import { getWeeklyVisits, getAverageRating } from "@/lib/redis";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import {
  getActiveDirectionsL,
  getAllCategoriesL,
  getCategoriesByDirectionL,
  getNewestProfilesL,
  directionOfCategoryL,
} from "@/lib/localized-data";

/** Drawings for "How the platform works", one per card, in card order.
 *  Each keeps its own aspect ratio: the box is fixed at 64 wide, the height
 *  follows the drawing, so nothing is stretched or squashed. */
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

  // New works strip: real works from the newest profiles, newest first.
  // A profile qualifies if it carries a picture and is set to show. Real
  // authors always win; the demo profile fills the strip only while there
  // are no real works yet, and drops out on its own the moment the first
  // real author with a work is published — no manual step either way.
  const shown = getNewestProfilesL(locale).filter(
    (p) => p.mainImage && p.showOnHomepage,
  );
  const realWorks = shown.filter((p) => !p.demo);
  const newWorks = (realWorks.length > 0 ? realWorks : shown).slice(0, 6);

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
      <section className="relative flex items-center justify-center overflow-hidden py-4 sm:py-8">
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
        <div className="relative flex w-full items-center justify-center px-2 sm:px-4">
          <div
            className="mx-auto w-[98%] max-w-2xl rounded-2xl px-4 py-5 text-center sm:w-[80%] sm:px-10 sm:py-8"
            style={{ background: "rgba(219,233,255,0.61)", backdropFilter: "blur(2px)" }}
          >
            <h1 className="text-balance text-[0.95rem] sm:text-[1.35rem] md:text-[1.7rem]" style={{ marginTop: "0" }}>{dict.site.name}</h1>
            <p
              className="mt-3 text-[1.3125rem] font-bold leading-tight sm:text-[1.9rem] md:text-[2.15rem]"
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

      {/* ---------- Who this is for ---------- */}
      {/* Nine trades, three by three, straight under the band. The hero
          says "professionals who work without AI", which is accurate but
          abstract, and a visitor scanning for a second cannot tell whether
          it means them. Naming the trades answers that before they scroll.

          Each tile wears its direction's colour and the same raised look as
          the direction tiles further down, so the strip reads as part of
          the catalog rather than a banner bolted on top. Plain text, not
          links: the job here is recognition, not navigation — a click would
          pull people off the page before they have read anything. */}
      <section className="pt-4 sm:pt-6">
        <div className="container-page">
          <ul className="mx-auto grid max-w-2xl grid-cols-3 gap-2.5 sm:gap-3">
            {dict.home.audienceTrades.map((trade) => (
              <li key={trade.label}>
                <LocaleLink
                  lang={locale}
                  href={trade.href}
                  className="press-btn flex h-full items-center justify-center rounded-2xl px-2 py-3 text-center text-[0.9rem] font-semibold sm:px-3 sm:py-4 sm:text-[1.05rem]"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: `var(--color-dir-${trade.color}-bg)`,
                    color: "var(--color-ink)",
                    border: "1px solid rgba(22, 35, 58, 0.06)",
                    boxShadow:
                      "inset 0 2px 0 rgba(255, 255, 255, 0.6), var(--shadow-raise)",
                  }}
                >
                  {trade.label}
                </LocaleLink>
              </li>
            ))}
            {/* Ninth tile. Eight trades name people, this one names the
                catalog: a visitor whose own trade is not on the list can
                see it is simply not among the eight, and a client can see
                how wide the catalog actually is. The figure is counted from
                the catalog itself, so adding a profession updates it with
                no edit here. */}
            <li>
              <LocaleLink
                lang={locale}
                href="/categories"
                className="press-btn flex h-full items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center text-[0.9rem] font-semibold sm:px-3 sm:py-4 sm:text-[1.05rem]"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "var(--color-dir-craft-bg)",
                  color: "var(--color-ink)",
                  border: "1px solid rgba(22, 35, 58, 0.06)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255, 255, 255, 0.6), var(--shadow-raise)",
                }}
              >
                {dict.home.audienceAllPrefix}{" "}
                <span
                  className="text-[1.05rem] font-bold leading-none sm:text-[1.2rem]"
                >
                  {allCats.length}
                </span>
              </LocaleLink>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- Steps ---------- */}
      <section className="pb-0 sm:pb-16" style={{ paddingTop: "18px" }}>
        <div className="container-page">
          <div className="flex flex-col gap-2.5">
            {dict.home.steps.map((step) => (
              <div key={step.title}>
                <p
                  className="text-[1.35rem] font-bold md:text-[1.6rem]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-[1.05rem]" style={{ color: "var(--color-ink)" }}>
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
      <section className="pt-3.5 pb-10 sm:pt-8 sm:pb-16">
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
          <div className="mt-0">
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
            className="mt-10 w-screen relative left-1/2 -translate-x-1/2 py-2.5 text-center text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)", background: "rgba(85,128,208,0.28)" }}
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
            className="mt-10 w-screen relative left-1/2 -translate-x-1/2 py-2.5 text-center text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)", background: "rgba(24,154,142,0.28)" }}
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
                      background: "radial-gradient(circle at 30% 30%, #3fb8ab, #189a8e 70%, #0f6d64)",
                      boxShadow: "0 1px 2px rgba(15,90,80,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
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

      {/* ---------- New works ---------- */}
      {/* Shows real works from the newest authors first, each linking to
          that author's profile. Any slot with no work yet is a coloured
          "your work" invitation that links to /join. With no works at all
          the whole strip is invitations — a living colour field, not an
          empty shelf. It fills itself in as real authors arrive; nothing to
          switch on by hand. */}
      <section className="pb-[clamp(2.5rem,6vw,4.5rem)]" style={{ paddingTop: "26px" }}>
        <div className="container-page">
          <p
            className="mb-[18px] text-center text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.newWorksTitle}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const slotGradients = [
                "linear-gradient(135deg, rgba(255,154,108,0.75) 0%, rgba(255,106,136,0.75) 55%, rgba(255,153,172,0.75) 100%)",
                "linear-gradient(135deg, rgba(79,172,254,0.75) 0%, rgba(47,128,237,0.75) 55%, rgba(86,204,242,0.75) 100%)",
                "linear-gradient(135deg, rgba(161,140,209,0.75) 0%, rgba(123,108,217,0.75) 55%, rgba(251,194,235,0.75) 100%)",
                "linear-gradient(135deg, rgba(67,233,123,0.75) 0%, rgba(18,185,138,0.75) 55%, rgba(56,249,215,0.75) 100%)",
                "linear-gradient(135deg, rgba(251,198,135,0.75) 0%, rgba(247,121,125,0.75) 55%, rgba(251,215,134,0.75) 100%)",
                "linear-gradient(135deg, rgba(91,107,214,0.75) 0%, rgba(106,63,181,0.75) 55%, rgba(176,106,179,0.75) 100%)",
              ];
              const cards = [];

              // Real works first: picture of the work, linking to the author.
              for (const p of newWorks) {
                const href = `${profileBasePath(p.profileType)}/${p.slug}`;
                cards.push(
                  <LocaleLink
                    key={`work-${p.slug}`}
                    lang={locale}
                    href={href}
                    className="press-btn relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl"
                  >
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span
                      className="relative w-full px-3 py-2 text-[0.95rem] font-semibold"
                      style={{
                        color: "#ffffff",
                        background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
                      }}
                    >
                      {p.name}
                    </span>
                  </LocaleLink>,
                );
              }

              // Fill remaining slots up to six with invitation cards.
              for (let i = newWorks.length; i < 6; i++) {
                cards.push(
                  <LocaleLink
                    key={`slot-${i}`}
                    lang={locale}
                    href="/join"
                    className="press-btn relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl"
                    style={{ background: slotGradients[i % slotGradients.length] }}
                  >
                    <span
                      className="text-[1.15rem] font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#ffffff",
                        textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                      }}
                    >
                      {dict.states.slotYourWork}
                    </span>
                  </LocaleLink>,
                );
              }

              return cards;
            })()}
          </div>
        </div>
      </section>

      {/* ---------- Explore directions ---------- */}
      <section className="pb-[clamp(2.5rem,6vw,4.5rem)]" style={{ paddingTop: "12px" }}>
        <div className="container-page">
          {/* A plain heading, not a SectionHeading: the subtitle explained
              how to use tiles that explain themselves, and the "all
              directions" link pointed at a page showing the same ten tiles
              already on screen. Both were noise. Indented to the same
              1.45rem as the headings above, so the whole page keeps one
              left edge. */}
          <p
            className="mb-[18px] text-center text-[1.35rem] font-bold md:text-[1.6rem]"
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
      <section className="section-brand pb-[clamp(2.5rem,6vw,4.5rem)]" style={{ paddingTop: "26px" }}>
        <div className="container-page">
          <div className="mb-6 text-center">
            <h2 className="whitespace-nowrap">{dict.home.popularCategories}</h2>
            <p className="lead mt-1.5">{dict.home.popularCategoriesSub}</p>
          </div>
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
          <div className="mt-4 flex justify-end">
            <LocaleLink
              lang={locale}
              href="/categories"
              className="text-[0.92rem] font-semibold"
              style={{ color: "var(--color-accent)" }}
            >
              {dict.common.seeAll} →
            </LocaleLink>
          </div>
        </div>
      </section>

      {/* ---------- How the platform works ---------- */}
      <section className="pb-[clamp(2.5rem,6vw,4.5rem)]" style={{ paddingTop: "31px" }}>
        <div className="container-page">
          <div className="mb-6">
            <h2 className="text-center">{dict.home.howItWorks}</h2>
            <p className="lead mt-3 text-justify">{dict.home.howItWorksSub}</p>
          </div>
          <FAQAccordion
            lang={locale}
            items={dict.home.howSteps}
          />
          <p
            className="mt-6 text-justify text-[0.95rem] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {dict.home.howReport}
          </p>
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
