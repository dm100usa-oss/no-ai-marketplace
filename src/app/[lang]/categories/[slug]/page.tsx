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
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ProfileGrid } from "@/components/ProfileGrid";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LocaleLink } from "@/components/LocaleLink";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { getFaqForCategory } from "@/i18n/data/faqProfessions";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { ProfileType as ParticipantType } from "@/lib/types";

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
  const languages = altLanguages(`/categories/${cat.slug}`);
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
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const cat = getCategoryL(slug, locale);
  if (!cat) notFound();

  const sp = await searchParams;
  const raw = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const type: ParticipantType | "" =
    raw === "creator" || raw === "team" || raw === "company" ? raw : "";
  const suffix = type ? `?type=${type}` : "";

  // Anyone browsing a category is exactly the person the profession FAQ
  // is written for, so link the two together when that FAQ exists.
  const faqBlocks = getFaqForCategory(locale, cat.slug);

  const dir = directionOfCategoryL(cat.slug, locale);
  const list = (await getProfilesByCategoryL(cat.slug, locale)).filter(
    (p) => !type || p.profileType === type,
  );

  // The question schema has moved to /faq/<profession>, the page that
  // now carries these answers in full. Declaring the same questions here
  // as well would offer an engine two structured answers to one question
  // and let it pick the weaker page.

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
          {
            label: type ? dict.directionsPage.byType[type] : dict.categoriesPage.title,
            href: type ? `/directions${suffix}` : "/categories",
          },
          ...(dir ? [{ label: dir.name, href: `/directions/${dir.slug}${suffix}` }] : []),
          { label: cat.name },
        ]}
      />

      <h1>{cat.name}</h1>
      <UpdatedStamp route={`/categories/${cat.slug}`} lang={locale} dict={dict} className="mt-3" />

      {cat.professions && (
        <p
          className="mt-3 max-w-3xl rounded-xl px-4 py-3 text-[0.98rem]"
          style={{ background: "var(--color-brand-soft)", color: "var(--color-muted)" }}
        >
          {cat.professions}
        </p>
      )}

      {cat.seoText && <p className="lead mt-4 max-w-3xl">{cat.seoText}</p>}

      <div className="mt-10">
        <h2 className="!text-[1.35rem]">{dict.categoryDetail.allProfiles}</h2>
        {list.length > 0 && (
          <p className="mt-2 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
            {list.length} {list.length === 1 ? dict.common.profile : dict.common.profiles}
          </p>
        )}
        <div className="mt-5">
        <ProfileGrid
          lang={locale}
          dict={dict}
          profiles={list}
          showSlotCard
          slotCategoryName={cat.name}
          slotCategorySlug={cat.slug}
          emptyTitle={`${dict.categoryDetail.emptyTitlePrefix} ${cat.name.toLowerCase()}`}
          emptyMessage={dict.categoryDetail.emptyMessage}
        />
        </div>
      </div>

      {/* A taste of the profession FAQ, not the whole of it. The full set
          lives at /faq/<profession> under its own title, and repeating it
          here word for word would leave two addresses competing for the
          same question. Three questions are enough to show the reader
          that the answers exist. */}
      {faqBlocks.map((faq) => (
        <section key={faq.slug} className="mt-12 max-w-3xl">
          <h2 className="!text-[1.35rem]">{faq.title}</h2>
          <p className="mb-5 mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {faq.intro}
          </p>
          <FAQAccordion items={faq.items.slice(0, 3)} lang={locale} />
          {faq.items.length > 3 && (
            <div className="mt-4">
              <LocaleLink
                lang={locale}
                href={`/faq/${faq.slug}`}
                className="btn btn-quiet"
              >
                {dict.faqPage.professionAllQuestions}
                <ArrowRight size={16} />
              </LocaleLink>
            </div>
          )}
        </section>
      ))}

      <RelatedLinks
        lang={locale}
        dict={dict}
        links={["/method", "/human-made-standards", "/work-stages", "/verified"]}
      />
    </div>
  );
}
