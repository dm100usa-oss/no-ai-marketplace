import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  for (const l of LOCALES) languages[l] = localizedPath(l, "/about");
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    alternates: { canonical: localizedPath(locale, "/about"), languages },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: dict.about.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{dict.about.title}</h1>
        <p className="lead mt-4">{dict.about.intro}</p>

        <h2 className="mt-10">{dict.about.whatTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.about.whatText}
        </p>

        <h2 className="mt-10">{dict.about.whyTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.about.whyText}
        </p>

        <h2 className="mt-10">{dict.about.howTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.about.howText}
        </p>

        <h2 className="mt-10">{dict.about.notClaimTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.about.notClaimText1}
          <LocaleLink lang={locale} href="/human-made-standards" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {dict.about.standardsLink}
          </LocaleLink>
          {dict.about.notClaimText2}
          <LocaleLink lang={locale} href="/verified" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {dict.about.verificationLink}
          </LocaleLink>
          {dict.about.notClaimText3}
        </p>

        <div className="mt-12 flex flex-wrap gap-2">
          <LocaleLink lang={locale} href="/directory" className="btn btn-quiet">
            {dict.about.browseCatalog}
          </LocaleLink>
          <LocaleLink lang={locale} href="/join" className="btn btn-ink">
            {dict.about.addProfile}
            <ArrowRight size={16} />
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
