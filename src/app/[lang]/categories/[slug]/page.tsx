import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryL,
  getProfilesByCategoryL,
  directionOfCategoryL,
} from "@/lib/localized-data";
import { categories as baseCategories } from "@/data/categories";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/** One static page per category per language. */
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    baseCategories.map((c) => ({ lang, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const cat = getCategoryL(slug, locale);
  if (!cat) return {};
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedPath(l, `/categories/${cat.slug}`);
  return {
    title: cat.seoTitle ?? cat.name,
    description: cat.seoDescription ?? cat.shortDescription,
    alternates: { canonical: localizedPath(locale, `/categories/${cat.slug}`), languages },
    openGraph: {
      title: cat.seoTitle ?? cat.name,
      description: cat.seoDescription ?? cat.shortDescription,
      url: `${site.url}${localizedPath(locale, `/categories/${cat.slug}`)}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const cat = getCategoryL(slug, locale);
  if (!cat) notFound();

  const dir = directionOfCategoryL(cat.slug, locale);
  const list = getProfilesByCategoryL(cat.slug, locale);
  const featured = list.filter((p) => p.status === "featured" || p.featured);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = list.filter((p) => !featuredSlugs.has(p.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: locale,
    name: cat.name,
    description: cat.seoDescription ?? cat.shortDescription,
    url: `${site.url}${localizedPath(locale, `/categories/${cat.slug}`)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}${localizedPath(locale, `/creators/${p.slug}`)}`,
        name: p.name,
      })),
    },
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
          { label: dict.categoriesPage.title, href: "/categories" },
          ...(dir ? [{ label: dir.name, href: `/directions/${dir.slug}` }] : []),
          { label: cat.name },
        ]}
      />

      <h1>{cat.name}</h1>
      {cat.seoText && <p className="lead mt-3 max-w-3xl">{cat.seoText}</p>}

      {featured.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="!text-[1.35rem]">{dict.categoryDetail.featuredIn} {cat.name.toLowerCase()}</h2>
            <span className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
              {dict.categoryDetail.leadersPickedByHand}
            </span>
          </div>
          <ProfileGrid lang={locale} dict={dict} profiles={featured} />
        </div>
      )}

      <div className="mt-10">
        <h2 className="!text-[1.35rem]">{dict.categoryDetail.allProfiles}</h2>
        <p className="mb-5 mt-2 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {rest.length} {rest.length === 1 ? dict.common.profile : dict.common.profiles}
        </p>
        <ProfileGrid
          lang={locale}
          dict={dict}
          profiles={rest}
          emptyTitle={`${dict.categoryDetail.emptyTitlePrefix} ${cat.name.toLowerCase()}`}
          emptyMessage={dict.categoryDetail.emptyMessage}
        />
      </div>
    </div>
  );
}
