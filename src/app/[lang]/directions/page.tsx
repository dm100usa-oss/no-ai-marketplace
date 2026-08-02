import type { Metadata } from "next";
import { getActiveDirectionsL, getCategoriesByDirectionL } from "@/lib/localized-data";
import { DirectionTile } from "@/components/DirectionTile";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { site } from "@/lib/config";
import { getDictionary } from "@/i18n";
import { categoryCount } from "@/lib/plural";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { ProfileType as ParticipantType } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages = altLanguages("/directions");
  return {
    title: dict.directionsPage.metaTitle,
    description: dict.directionsPage.metaDescription,
    alternates: { canonical: localizedPath(locale, "/directions"), languages },
  };
}

export default async function DirectionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const dirs = getActiveDirectionsL(locale);

  const sp = await searchParams;
  const raw = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const type: ParticipantType | "" =
    raw === "creator" || raw === "team" || raw === "company" ? raw : "";
  const suffix = type ? `?type=${type}` : "";
  const heading = type ? dict.directionsPage.byType[type] : dict.directionsPage.title;

  // The nine fields as a declared list rather than nine tiles an engine has
  // to infer from markup. Asked what a directory covers, a list it can read
  // is the difference between naming the fields and saying "various".
  //
  // Only the unfiltered view declares it. A filtered view is the same nine
  // fields seen through one participant type, and declaring it again would
  // offer the same list twice under two addresses.
  const listJsonLd = type
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: dict.directionsPage.title,
        description: dict.directionsPage.metaDescription,
        url: `${site.url}${localizedPath(locale, "/directions")}`,
        inLanguage: locale,
        isPartOf: { "@id": `${site.url}#organization` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: dirs.length,
          itemListElement: dirs.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: d.name,
            url: `${site.url}${localizedPath(locale, `/directions/${d.slug}`)}`,
          })),
        },
      };

  return (
    <div className="container-page section">
      {listJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
        />
      )}
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: heading }]}
      />

      <h1>{heading}</h1>
      <UpdatedStamp route={"/directions"} lang={locale} dict={dict} className="mt-3" />
      <p className="lead mt-3 max-w-2xl">
        {type ? dict.directionsPage.byTypeIntro[type] : dict.directionsPage.intro}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dirs.map((d) => {
          const count = getCategoriesByDirectionL(d.slug, locale).length;
          return (
            <DirectionTile
              key={d.slug}
              lang={locale}
              href={`/directions/${d.slug}${suffix}`}
              title={d.name}
              color={d.color}
              subtitle={categoryCount(count, dict)}
            />
          );
        })}
      </div>
    </div>
  );
}
