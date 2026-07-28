import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { site } from "@/lib/config";
import {
  DEFAULT_LOCALE,
  isLocale,
  localizedPath,
  altLanguages,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/glossary";

/**
 * The glossary.
 *
 * Long before anyone asks where to hire an illustrator, they ask what
 * "human-made" actually means and whether using a background remover
 * counts as using AI. Those questions are asked constantly and answered
 * badly, because most of the writing on the subject is either an essay or
 * a slogan. A definition of two or three sentences answers them better
 * than either, and it is the shape an answer engine can lift whole.
 *
 * Two things make this page ours rather than generic. First, the careful
 * wording: every definition says what a thing proves and, where it
 * matters, what it does not — a claim nobody makes unless they have had
 * to review the evidence themselves. Second, HTVS sits here in full. A
 * definition of a named scale cannot be repeated without naming whose
 * scale it is, which is the difference between being read and being
 * cited.
 *
 * DefinedTermSet markup, one DefinedTerm per entry: the vocabulary of a
 * subject, declared as a vocabulary.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const g = getDictionary(locale).glossary;
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: {
      canonical: localizedPath(locale, ROUTE),
      languages: altLanguages(ROUTE),
    },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      url: `${site.url}${localizedPath(locale, ROUTE)}`,
    },
  };
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const g = dict.glossary;

  const allTerms = g.groups.flatMap((group) => group.terms);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    inLanguage: locale,
    name: g.title,
    description: g.metaDescription,
    url: `${site.url}${localizedPath(locale, ROUTE)}`,
    publisher: { "@type": "Organization", name: dict.site.name, url: site.url },
    hasDefinedTerm: allTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      ...(t.aka ? { alternateName: t.aka } : {}),
      description: t.definition,
      inDefinedTermSet: `${site.url}${localizedPath(locale, ROUTE)}`,
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
        items={[
          { label: dict.common.home, href: "/" },
          { label: dict.knowledge.title, href: "/knowledge" },
          { label: g.title },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{g.title}</h1>
        <p className="lead mt-4">{g.intro}</p>

        <div className="mt-12 space-y-12">
          {g.groups.map((group) => (
            <section key={group.title}>
              <h2 className="!text-[1.35rem]">{group.title}</h2>
              <dl className="mt-5 space-y-6">
                {group.terms.map((t) => (
                  <div
                    key={t.term}
                    className="rounded-xl p-4"
                    style={{ background: "var(--color-brand-soft)" }}
                  >
                    <dt
                      className="text-[1.1rem] font-bold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                    >
                      {t.term}
                      {t.aka ? (
                        <span
                          className="ml-2 text-[0.92rem] font-normal"
                          style={{ color: "var(--color-muted-soft)" }}
                        >
                          {t.aka}
                        </span>
                      ) : null}
                    </dt>
                    <dd
                      className="mt-1.5 text-[1.05rem] leading-relaxed"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {t.definition}
                      {t.href && t.hrefLabel ? (
                        <LocaleLink
                          lang={locale}
                          href={t.href}
                          className="mt-2 flex items-center gap-1.5 text-[0.95rem] font-semibold"
                          style={{ color: "var(--color-brand)" }}
                        >
                          {t.hrefLabel}
                          <ArrowRight size={14} />
                        </LocaleLink>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div
          className="mt-14 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{g.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {g.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/knowledge" className="btn btn-ink">
              {g.ctaKnowledge}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/directory" className="btn btn-quiet">
              {g.ctaBrowse}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
