import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedPath(l, "/faq");
  return {
    title: dict.faqPage.metaTitle,
    description: dict.faqPage.metaDescription,
    alternates: { canonical: localizedPath(locale, "/faq"), languages },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const p = dict.faqPage;

  // Flatten every Q&A into one FAQPage schema so search and AI engines
  // read the whole set at once.
  const allItems = p.groups.flatMap((g) => g.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: allItems.map((it) => ({
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
        items={[{ label: dict.common.home, href: "/" }, { label: p.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{p.title}</h1>
        <p className="lead mt-4">{p.intro}</p>

        <div className="mt-10 space-y-10">
          {p.groups.map((group) => (
            <section key={group.title}>
              <h2 className="!text-[1.35rem]">{group.title}</h2>
              <div className="mt-4">
                <FAQ items={group.items} />
              </div>
            </section>
          ))}
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{p.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {p.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/directory" className="btn btn-ink">
              {p.ctaFind}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/join" className="btn btn-quiet">
              {p.ctaJoin}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
