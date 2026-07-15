import { LocaleLink } from "@/components/LocaleLink";
import { DirectionTile } from "@/components/DirectionTile";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { FAQ } from "@/components/FAQ";
import { FindAccordion } from "@/components/FindAccordion";
import { PeopleMarquee } from "@/components/PeopleMarquee";
import {
  ArrowRight,
  CheckShield,
} from "@/components/icons";
import { getDictionary } from "@/i18n";
import { categoryCount } from "@/lib/plural";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const dirs = getActiveDirectionsL(locale);
  const featured = getFeaturedProfilesL(locale).slice(0, 6);
  const newest = getNewestProfilesL(locale, 6);

  const popularCategories = getAllCategoriesL(locale).slice(0, 8).map((c) => ({
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
            <p className="mt-3 text-[1.05rem] italic leading-tight sm:text-[1.5rem]" style={{ color: "var(--color-muted)" }}>
              {dict.site.slogan}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- People band ---------- */}
      <PeopleMarquee lang={locale} />

      {/* ---------- Hero content ---------- */}
      {/* Tighter on top than a normal .section: this block belongs to the
          people band above it, not to the page below. */}
      <section className="section pt-6 sm:pt-8">
        <div className="container-page">
          {/* Intro line — same display font as tagline */}
          <p
            className="text-left text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroIntro}
          </p>

          {/* Options list — bullets with raised gradient circles, aligned to text start */}
          <div className="mt-5">
            <ul className="flex flex-col gap-2.5 text-[1.05rem]">
              {dict.home.heroOptions.map((item) => (
                <li key={item} className="flex items-start gap-3" style={{ color: "var(--color-ink)" }}>
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
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <FindAccordion
            lang={locale}
            label={dict.home.heroFindButton}
            actions={dict.home.heroActions}
          />

          {/* Advantages — same heading style and bullets as the options list */}
          <p
            className="mt-10 text-left text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroAdvantagesTitle}
          </p>
          <div className="mt-5">
            <ul className="flex flex-col gap-2.5 text-[1.05rem]">
              {dict.home.heroAdvantages.map((line) => {
                const m = line.match(/^(\d+%|Больше|More)\b/);
                const head = m ? m[1] : null;
                return (
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
                    <span>
                      {head ? (
                        <>
                          <span className="font-bold" style={{ color: "var(--color-accent)" }}>
                            {head}
                          </span>
                          {line.slice(head.length)}
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Principles — same heading style and bullets */}
          <p
            className="mt-10 text-left text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroPrinciplesTitle}
          </p>
          <div className="mt-5">
            <ul className="flex flex-col gap-2.5 text-[1.05rem]">
              {dict.home.heroPrinciples.map((line) => (
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

        </div>
      </section>

      {/* ---------- Explore directions ---------- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            lang={locale}
            title={dict.home.exploreDirections}
            action={{ href: "/directions", label: dict.common.allDirections }}
          >
            {dict.home.exploreDirectionsSub}
          </SectionHeading>
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
            <span
              className="mx-auto grid h-12 w-12 place-items-center rounded-xl"
              style={{ background: "#dff1e9", color: "#157a58" }}
            >
              <CheckShield size={22} />
            </span>
            <h2 className="mt-4">{dict.home.verificationTitle}</h2>
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
