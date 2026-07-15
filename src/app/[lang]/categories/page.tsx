import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import {
  getActiveDirectionsL,
  getCategoriesByDirectionL,
  getProfilesByCategoryL,
} from "@/lib/localized-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages = altLanguages("/categories");
  return {
    title: dict.categoriesPage.metaTitle,
    description: dict.categoriesPage.metaDescription,
    alternates: { canonical: localizedPath(locale, "/categories"), languages },
  };
}

export default async function CategoriesPage({
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
        items={[{ label: dict.common.home, href: "/" }, { label: dict.categoriesPage.title }]}
      />

      <h1>{dict.categoriesPage.title}</h1>
      <p className="lead mt-3 max-w-2xl">{dict.categoriesPage.intro}</p>

      <div className="mt-10 space-y-12">
        {dirs.map((dir) => {
          const cats = getCategoriesByDirectionL(dir.slug, locale);
          if (cats.length === 0) return null;
          return (
            <section key={dir.slug}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[1.3rem]">{dir.name}</h2>
                <LocaleLink
                  lang={locale}
                  href={`/directions/${dir.slug}`}
                  className="text-[0.9rem] font-semibold"
                  style={{ color: "var(--color-accent)" }}
                >
                  {dict.categoriesPage.viewDirection}
                </LocaleLink>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cats.map((c) => {
                  const n = getProfilesByCategoryL(c.slug, locale).length;
                  return (
                    <LocaleLink key={c.slug} lang={locale} href={`/categories/${c.slug}`} className="card card-hover p-4">
                      <span className="block font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                        {c.name}
                      </span>
                      <span className="mt-1 block text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                        {n} {n === 1 ? dict.common.profile : dict.common.profiles}
                      </span>
                    </LocaleLink>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
