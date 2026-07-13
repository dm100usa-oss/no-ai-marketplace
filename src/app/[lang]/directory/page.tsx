import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DirectoryClient } from "@/components/DirectoryClient";
import {
  getAllCategoriesL,
  getActiveDirectionsL,
  getAllProfilesL,
  getCountriesL,
} from "@/lib/localized-data";
import { buildSearchDocs, filtersFromParams } from "@/lib/search";
import { site } from "@/lib/config";
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
  for (const l of LOCALES) languages[l] = localizedPath(l, "/directory");
  return {
    title: dict.directory.metaTitle,
    description: dict.directory.metaDescription,
    alternates: { canonical: localizedPath(locale, "/directory"), languages },
  };
}

export default async function DirectoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const sp = await searchParams;
  const flat: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) {
    flat[k] = Array.isArray(v) ? v[0] : v;
  }
  const initial = filtersFromParams(flat);

  const profiles = getAllProfilesL(locale);
  const categories = getAllCategoriesL(locale);
  const directions = getActiveDirectionsL(locale);
  const countries = getCountriesL(locale);
  const docs = buildSearchDocs(profiles, categories, directions);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: locale,
    name: dict.directory.title,
    description: dict.directory.metaDescription,
    url: `${site.url}${localizedPath(locale, "/directory")}`,
    isPartOf: { "@type": "WebSite", name: dict.site.name, url: site.url },
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
        items={[{ label: dict.common.home, href: "/" }, { label: dict.directory.title }]}
      />

      <h1>{dict.directory.title}</h1>
      <p className="lead mt-3 max-w-3xl">{dict.directory.intro}</p>

      <DirectoryClient
        lang={locale}
        dict={dict}
        profiles={profiles}
        docs={docs}
        directions={directions}
        categories={categories}
        countries={countries}
        initial={initial}
      />
    </div>
  );
}
