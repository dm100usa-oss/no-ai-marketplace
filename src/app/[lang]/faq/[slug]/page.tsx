import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import {
  FAQ_PROFESSION_SLUGS,
  getFaqProfession,
} from "@/i18n/data/faqProfessions";

/**
 * One page per profession (HTVS). A page with a single clear topic ranks
 * higher than a page where everything sits together, and AI engines cite
 * single-topic pages rather than collections.
 *
 * FAQPage schema lives here, on the profession pages, and not on /faq,
 * where the four HTVS levels and the navigation live instead.
 */

export async function generateStaticParams() {
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
  const page = getFaqProfession(locale, slug);
  if (!page) return {};

  const languages = altLanguages(`/faq/${slug}`);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: localizedPath(locale, `/faq/${slug}`),
      languages,
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
  const page = getFaqProfession(locale, slug);
  if (!page) notFound();

  // The answers carry the links as plain text too, so the schema stays a
  // faithful copy of what a reader sees.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: page.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        lang={locale}
        items={[
          { label: dict.common.home, href: "/" },
          { label: dict.faqPage.title, href: "/faq" },
          { label: page.title },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{page.title}</h1>
        <p className="lead mt-4">{page.intro}</p>

        <div className="mt-10 space-y-6">
          {page.items.map((it, i) => (
            <section key={i}>
              <h2 className="!text-[1.2rem]">{it.q}</h2>
              <p className="mt-3 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
                {it.a}
              </p>
              {it.links && it.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {it.links.map((l) => (
                    <LocaleLink
                      key={l.href}
                      lang={locale}
                      href={l.href}
                      className="btn btn-quiet"
                    >
                      {l.label}
                    </LocaleLink>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{
            borderColor: "var(--color-brand)",
            background: "var(--color-brand-soft)",
          }}
        >
          <h2 className="!text-[1.25rem]">{dict.faqPage.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {dict.faqPage.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink
              lang={locale}
              href={`/categories/${page.category}`}
              className="btn btn-ink"
            >
              {dict.faqPage.ctaFind}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/join" className="btn btn-quiet">
              {dict.faqPage.ctaJoin}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
