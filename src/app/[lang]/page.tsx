import { LocaleLink } from "@/components/LocaleLink";
import { DirectionTile } from "@/components/DirectionTile";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { FAQ } from "@/components/FAQ";
import {
  SearchIcon,
  ArrowRight,
  CheckShield,
  UsersIcon,
  HandshakeIcon,
  SparkIcon,
} from "@/components/icons";
import { getDictionary } from "@/i18n";
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

const ICONS = [<UsersIcon key="u" />, <HandshakeIcon key="h" />, <CheckShield key="c" size={22} />];

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
      <section className="relative">
        <img src="/images/hero.webp" alt="" className="block w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="mx-auto w-[85%] max-w-md rounded-2xl px-6 py-7 text-center sm:w-[70%] sm:px-10 sm:py-10"
            style={{ background: "rgba(219,233,255,0.72)", backdropFilter: "blur(2px)" }}
          >
            <h1 className="text-balance text-[0.95rem] sm:text-[1.35rem] md:text-[1.7rem]" style={{ marginTop: "0" }}>{dict.site.name}</h1>
            <p
              className="mt-3 text-[1.25rem] font-bold leading-tight sm:text-[1.9rem] md:text-[2.15rem]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {dict.site.tagline}
            </p>
            <p className="mt-3 text-[1.05rem] italic leading-tight sm:text-[1.5rem]" style={{ color: "var(--color-muted)" }}>
              {dict.site.slogan}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Hero content ---------- */}
      <section className="section">
        <div className="container-page">
          {/* Intro line — same display font as tagline */}
          <p
            className="mx-auto max-w-2xl text-center text-[1.35rem] font-bold md:text-[1.6rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.home.heroIntro}
          </p>

          {/* Options list — bullets with raised gradient circles in hero-plate tone */}
          <ul className="mx-auto mt-5 flex max-w-2xl flex-col items-center gap-2.5 text-[1.05rem]">
            {dict.home.heroOptions.map((item) => (
              <li key={item} className="flex items-center gap-3" style={{ color: "var(--color-ink)" }}>
                <span
                  aria-hidden="true"
                  className="shrink-0 rounded-full"
                  style={{
                    width: "0.7rem",
                    height: "0.7rem",
                    background: "radial-gradient(circle at 30% 30%, #eaf2ff, #a9c8ff 70%, #7ba7f0)",
                    boxShadow: "0 1px 2px rgba(60,90,140,0.35), inset 0 1px 1px rgba(255,255,255,0.7)",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>

          {/* No-AI — centered text with blue checks, no boxes */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 text-[1.05rem] sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
            {dict.home.heroNoAi.map((item) => (
              <span key={item} className="inline-flex items-center gap-2" style={{ color: "var(--color-ink)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </span>
            ))}
          </div>

          {/* Advantages + principles — no card wrappers */}
          <div className="mx-auto mt-10 grid max-w-2xl gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-[1.05rem]">{dict.home.heroAdvantagesTitle}</h3>
              <ul className="mt-3 space-y-2 text-[1.05rem]">
                {dict.home.heroAdvantages.map((line, i) => {
                  const head = i === 0 ? "100%" : i === 1 ? "0%" : "Больше";
                  return (
                    <li key={line} style={{ color: "var(--color-ink)" }}>
                      {line.startsWith(head) ? (
                        <>
                          <span className="font-bold" style={{ color: "var(--color-accent)" }}>
                            {head}
                          </span>
                          {line.slice(head.length)}
                        </>
                      ) : (
                        line
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="text-[1.05rem]">{dict.home.heroPrinciplesTitle}</h3>
              <ul className="mt-3 space-y-2 text-[1.05rem]" style={{ color: "var(--color-ink)" }}>
                {dict.home.heroPrinciples.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Three action buttons with hints */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {dict.home.heroActions.map((action, i) => (
              <LocaleLink
                key={action.label}
                lang={locale}
                href={action.href}
                className="flex flex-col items-center rounded-2xl border px-4 py-4 text-center transition-colors hover:border-[var(--color-accent)]"
                style={{
                  borderColor: "var(--color-line)",
                  background: i === 0 ? "var(--color-brand-soft)" : i === 1 ? "#eef4ff" : "#fff",
                }}
              >
                <span className="text-[0.85rem]" style={{ color: "var(--color-muted)" }}>
                  {action.hint}
                </span>
                <span
                  className="mt-1.5 text-[1.05rem] font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
                >
                  {action.label}
                </span>
              </LocaleLink>
            ))}
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
                  subtitle={`${count} ${count === 1 ? dict.common.category : dict.common.categories}`}
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
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: "var(--color-brand-soft)", color: "var(--color-accent)" }}
                >
                  {ICONS[i]}
                </span>
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
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: "var(--color-brand-soft)", color: "var(--color-accent)" }}
              >
                <SearchIcon />
              </span>
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
              <span
                className="grid h-11 w-11 place-items-center rounded-xl bg-white"
                style={{ color: "var(--color-accent)" }}
              >
                <SparkIcon />
              </span>
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
