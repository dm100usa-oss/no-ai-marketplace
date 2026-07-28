import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { getFaqProfessions } from "@/i18n/data/faqProfessions";
import {
  getActiveDirectionsL,
  getCategoriesByDirectionL,
} from "@/lib/localized-data";
import { site } from "@/lib/config";
import {
  DEFAULT_LOCALE,
  isLocale,
  localizedPath,
  altLanguages,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/knowledge";

/** Tile colours for the platform documents, in the catalog's own order. */
const DOC_TONES = ["services", "art", "writing", "craft", "design"] as const;

/**
 * The knowledge base: one address that gathers every explanatory page on
 * the site.
 *
 * The catalog answers "who does this work". Nothing until now answered
 * "what counts as work made without AI, and how would I tell" in a place
 * of its own — those answers were scattered across category pages and
 * policy documents, each reachable only by knowing it was there. A
 * subject with no centre reads, to a search or answer engine, as a
 * collection of loose pages rather than as a body of work on one topic.
 *
 * Grouped by direction rather than listed flat: forty-one links in a
 * column is a wall, the same forty-one under Art, Literature, Design and
 * so on is a table of contents. The grouping also states the shape of the
 * subject, which is the part an engine reads.
 *
 * Nothing here is written twice. Every card is a link to the page that
 * holds the text; this page holds only the map.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.knowledge.metaTitle,
    description: dict.knowledge.metaDescription,
    alternates: {
      canonical: localizedPath(locale, ROUTE),
      languages: altLanguages(ROUTE),
    },
    openGraph: {
      title: dict.knowledge.metaTitle,
      description: dict.knowledge.metaDescription,
      url: `${site.url}${localizedPath(locale, ROUTE)}`,
    },
  };
}

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const k = dict.knowledge;

  const professions = getFaqProfessions(locale);

  // Group the profession guides by direction, keeping the catalog's own
  // order so the section reads the same way as the rest of the site.
  const groups = getActiveDirectionsL(locale)
    .map((dir) => {
      const catSlugs = new Set(
        getCategoriesByDirectionL(dir.slug, locale).map((c) => c.slug),
      );
      return {
        dir,
        items: professions.filter((p) => catSlugs.has(p.category)),
      };
    })
    .filter((g) => g.items.length > 0);

  // Declared as a collection of the guides it links to: this is the page
  // that says the subject exists and what it contains.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: locale,
    name: k.title,
    description: k.metaDescription,
    url: `${site.url}${localizedPath(locale, ROUTE)}`,
    hasPart: professions.map((p) => ({
      "@type": "WebPage",
      name: p.title,
      url: `${site.url}${localizedPath(locale, `/faq/${p.slug}`)}`,
    })),
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: k.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{k.title}</h1>
        <p className="lead mt-4">{k.intro}</p>

        {/* Platform documents first: they set the terms every guide below
            then uses. */}
        <section className="mt-12">
          <h2 className="!text-[1.35rem]">{k.docsTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {k.docsIntro}
          </p>
          {/* Raised colour tiles, the same device as the direction tiles on
              the home page. A document is a place to go, not a line in a
              list, and the reader already knows what a tile of this shape
              means here. Colours are taken in the catalog's own order so
              nothing new is invented for this page. */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {k.docs.map((doc, i) => (
              <LocaleLink
                key={doc.href}
                lang={locale}
                href={doc.href}
                className="press-btn rounded-2xl p-5"
                style={{
                  background: `var(--color-dir-${DOC_TONES[i % DOC_TONES.length]}-bg)`,
                  border: "1px solid rgba(22, 35, 58, 0.06)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255, 255, 255, 0.6), var(--shadow-raise)",
                }}
              >
                <span
                  className="block text-[1.1rem] font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {doc.title}
                </span>
                <span
                  className="mt-1.5 block text-[0.95rem] leading-relaxed"
                  style={{ color: "var(--color-ink)", opacity: 0.75 }}
                >
                  {doc.text}
                </span>
              </LocaleLink>
            ))}
          </div>
        </section>

        <section className="mt-14">
          {/* The heading sits on colour, so the long list below it reads as
              one section rather than as loose links on the page. */}
          <div
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "var(--color-brand-soft)" }}
          >
            <h2 className="!mt-0 !text-[1.35rem]">{k.professionsTitle}</h2>
            <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
              {k.professionsIntro}
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {groups.map(({ dir, items }) => (
              <div key={dir.slug}>
                {/* Each direction wears its own colour from the catalog, the
                    same one its tile carries on the home page, so a reader
                    recognizes the section before reading the word. */}
                <h3
                  className="rounded-xl py-2.5 text-center text-[1.05rem] font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: `var(--color-dir-${dir.color}-bg)`,
                    color: `var(--color-dir-${dir.color}-ink)`,
                  }}
                >
                  {dir.name}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {items.map((prof) => (
                    <LocaleLink
                      key={prof.slug}
                      lang={locale}
                      href={`/faq/${prof.slug}`}
                      className="btn btn-quiet !flex h-full w-full justify-center text-center !leading-snug"
                    >
                      {prof.title}
                    </LocaleLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div
          className="mt-14 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{k.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {k.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/directory" className="btn btn-ink">
              {k.ctaFind}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/join" className="btn btn-quiet">
              {k.ctaJoin}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
