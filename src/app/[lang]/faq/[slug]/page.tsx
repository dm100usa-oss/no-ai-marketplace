import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import {
  getFaqProfession,
  FAQ_PROFESSION_SLUGS,
} from "@/i18n/data/faqProfessions";
import { getCategoryL } from "@/lib/localized-data";
import { site } from "@/lib/config";
import {
  DEFAULT_LOCALE,
  isLocale,
  localizedPath,
  LOCALES,
  altLanguages,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * One page per profession, carrying that profession's questions in full.
 *
 * These answers used to live only at the foot of the catalog category
 * page, under the list of people. That put a page's best material in its
 * basement: an engine looking at /categories/illustrators sees a listing
 * page that happens to end with some text, and quotes accordingly. The
 * same words under their own address, with their own title and their own
 * question schema, are a page about the question — which is the thing
 * that gets cited.
 *
 * The two pages are deliberately not copies of each other. This one
 * answers, the category page lists; each carries a link to the other, and
 * the category page keeps only the first few questions as a taste. That
 * way the two never compete for the same query, which is what happens
 * when the same block of text sits at two addresses.
 */

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    FAQ_PROFESSION_SLUGS.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const prof = getFaqProfession(locale, slug);
  if (!prof) return {};
  const path = `/faq/${prof.slug}`;
  return {
    title: prof.metaTitle,
    description: prof.metaDescription,
    alternates: { canonical: localizedPath(locale, path), languages: altLanguages(path) },
    openGraph: {
      title: prof.metaTitle,
      description: prof.metaDescription,
      url: `${site.url}${localizedPath(locale, path)}`,
    },
  };
}

export default async function FaqProfessionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const prof = getFaqProfession(locale, slug);
  if (!prof) notFound();

  const cat = getCategoryL(prof.category, locale);
  const p = dict.faqPage;

  // The question schema lives here and only here. The category page shows
  // a few of the same questions for the reader's benefit but declares
  // none of them, so the two pages never offer an engine the same
  // structured answer twice.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    name: prof.title,
    url: `${site.url}${localizedPath(locale, `/faq/${prof.slug}`)}`,
    mainEntity: prof.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs
        lang={locale}
        items={[
          { label: dict.common.home, href: "/" },
          { label: p.title, href: "/faq" },
          { label: prof.title },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{prof.title}</h1>
        <p className="lead mt-4">{prof.intro}</p>

        <div className="mt-8">
          <FAQAccordion items={prof.items} lang={locale} />
        </div>

        {/* Straight to the people who do this work. Someone who has just
            read how to tell hand-made work apart is exactly the person
            about to go looking for it. */}
        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{cat?.name ?? prof.title}</h2>
          {cat?.shortDescription ? (
            <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
              {cat.shortDescription}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink
              lang={locale}
              href={`/categories/${prof.category}`}
              className="btn btn-ink"
            >
              {p.professionSeeCatalog}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/faq" className="btn btn-quiet">
              {p.professionBackToFaq}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
