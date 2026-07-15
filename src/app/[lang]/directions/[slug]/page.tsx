import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/LocaleLink";
import {
  getDirectionL,
  getCategoriesByDirectionL,
  getProfilesByDirectionL,
  getProfilesByCategoryL,
} from "@/lib/localized-data";
import { directions as baseDirections } from "@/data/directions";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { ProfileType as ParticipantType } from "@/lib/types";

/** One static page per active direction per language. */
export function generateStaticParams() {
  const active = baseDirections.filter((d) => d.active);
  return LOCALES.flatMap((lang) => active.map((d) => ({ lang, slug: d.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dir = getDirectionL(slug, locale);
  if (!dir) return {};
  const languages = altLanguages(`/directions/${dir.slug}`);
  return {
    title: dir.seoTitle ?? dir.name,
    description: dir.seoDescription ?? dir.shortDescription,
    alternates: { canonical: localizedPath(locale, `/directions/${dir.slug}`), languages },
    openGraph: {
      title: dir.seoTitle ?? dir.name,
      description: dir.seoDescription ?? dir.shortDescription,
      url: `${site.url}${localizedPath(locale, `/directions/${dir.slug}`)}`,
    },
  };
}

export default async function DirectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const dir = getDirectionL(slug, locale);
  if (!dir || !dir.active) notFound();

  const sp = await searchParams;
  const raw = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const type: ParticipantType | "" =
    raw === "creator" || raw === "team" || raw === "company" ? raw : "";
  const suffix = type ? `?type=${type}` : "";
  const ofType = (p: { profileType: ParticipantType }) =>
    !type || p.profileType === type;

  const cats = getCategoriesByDirectionL(dir.slug, locale);
  const featured = getProfilesByDirectionL(dir.slug, locale)
    .filter(ofType)
    .filter((p) => p.status === "featured" || p.featured);

  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={locale}
        items={[
          { label: dict.common.home, href: "/" },
          {
            label: type ? dict.directionsPage.byType[type] : dict.directionsPage.title,
            href: `/directions${suffix}`,
          },
          { label: dir.name },
        ]}
      />

      <h1>{dir.name}</h1>
      {dir.seoText && <p className="lead mt-3 max-w-3xl">{dir.seoText}</p>}

      {/* Categories in this direction */}
      <div className="mt-10">
        <SectionHeading lang={locale} title={dict.directionDetail.categories} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => {
            const n = getProfilesByCategoryL(c.slug, locale).filter(ofType).length;
            return (
              <LocaleLink
                key={c.slug}
                lang={locale}
                href={`/categories/${c.slug}${suffix}`}
                className="card card-hover flex items-center justify-between p-4"
              >
                <span>
                  <span className="block font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {c.name}
                  </span>
                  {c.shortDescription && (
                    <span className="mt-0.5 block text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                      {c.shortDescription}
                    </span>
                  )}
                </span>
                <span className="shrink-0 pl-3" style={{ color: "var(--color-muted-soft)" }}>
                  <span className="mr-2 text-[0.85rem]">{n}</span>
                  <ArrowRight size={18} className="inline" />
                </span>
              </LocaleLink>
            );
          })}
        </div>
      </div>

      {/* Featured in this direction */}
      {featured.length > 0 && (
        <div className="mt-14">
          <SectionHeading lang={locale} title={`${dict.directionDetail.featuredIn} ${dir.name}`}>
            {dict.directionDetail.leadersPickedByHand}
          </SectionHeading>
          <ProfileGrid lang={locale} dict={dict} profiles={featured} />
        </div>
      )}
    </div>
  );
}
