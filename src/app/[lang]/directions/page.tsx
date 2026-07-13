import type { Metadata } from "next";
import { getActiveDirectionsL, getCategoriesByDirectionL } from "@/lib/localized-data";
import { DirectionTile } from "@/components/DirectionTile";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  for (const l of LOCALES) languages[l] = localizedPath(l, "/directions");
  return {
    title: dict.directionsPage.metaTitle,
    description: dict.directionsPage.metaDescription,
    alternates: { canonical: localizedPath(locale, "/directions"), languages },
  };
}

export default async function DirectionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const dirs = getActiveDirectionsL(locale);

  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: dict.directionsPage.title }]}
      />

      <h1>{dict.directionsPage.title}</h1>
      <p className="lead mt-3 max-w-2xl">{dict.directionsPage.intro}</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
