import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { ArrowRight } from "@/components/icons";
import { documentSchema } from "@/lib/schema";
import { site } from "@/lib/config";
import { getDictionary } from "@/i18n";
import { getOriginCheck, ORIGIN_CHECK_SLUGS } from "@/i18n/data/originCheck";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * No AI Directory Origin Check: the entry page.
 *
 * Two ways in, one destination. Somebody searching "how to check a
 * photographer for AI" should land straight on the trade page; somebody
 * already on the site picks a field here and arrives at the same address.
 * That is why every trade has a real URL instead of a panel that swaps
 * text on click: a panel exists for people and for nobody else, and this
 * page was built to be linked to from outside.
 */

const ROUTE = "/origin-check";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const oc = getOriginCheck(locale);
  const languages = altLanguages(ROUTE);
  return {
    title: oc.metaTitle,
    description: oc.metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
  };
}

export default async function OriginCheckPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const oc = getOriginCheck(locale);

  const trades = ORIGIN_CHECK_SLUGS.map((slug) => ({
    slug,
    title: oc.professions[slug]?.title ?? slug,
  }));

  const jsonLd = {
    ...documentSchema({
      route: ROUTE,
      title: `${oc.title}. ${oc.tagline}`,
      description: oc.definition,
      locale,
    }),
    mainEntity: {
      "@type": "ItemList",
      name: oc.chooseTitle,
      numberOfItems: trades.length,
      itemListElement: trades.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: `${site.url}${localizedPath(locale, `${ROUTE}/${t.slug}`)}`,
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
          { label: dict.footer.knowledge, href: "/knowledge" },
          { label: oc.title },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{oc.title}</h1>
        <UpdatedStamp route={ROUTE} lang={locale} dict={dict} className="mt-3" />
        <p className="lead mt-4">{oc.tagline}</p>
        <p className="mt-4" style={{ color: "var(--color-muted)" }}>
          {oc.definition}
        </p>

        {/* Said early and plainly. The neighbours in this space are AI
            detectors, and a reader who arrives expecting one will judge
            this page by their yardstick unless told otherwise. */}
        <div
          className="mt-8 rounded-2xl border p-5"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.05rem]">{oc.notDetectorTitle}</h2>
          <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
            {oc.notDetectorText}
          </p>
        </div>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.howTitle}</h2>
          <ol className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
            {oc.howSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-[0.98rem]">
                <span
                  aria-hidden
                  className="shrink-0 font-semibold"
                  style={{ color: "var(--color-muted-soft)" }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.chooseTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {oc.chooseIntro}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {trades.map((t) => (
              <LocaleLink
                key={t.slug}
                lang={locale}
                href={`${ROUTE}/${t.slug}`}
                className="btn btn-quiet !flex h-full w-full justify-center text-center !leading-snug"
              >
                {t.title}
              </LocaleLink>
            ))}
          </div>
          <p className="mt-4 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
            {oc.chooseEmpty}
          </p>
        </section>

        <RelatedLinks
          lang={locale}
          dict={dict}
          links={["/how-to-verify", "/method", "/human-made-standards", "/work-stages"]}
        />

        <div className="mt-6">
          <LocaleLink lang={locale} href="/directory" className="btn btn-ink">
            {dict.common.browseCatalog}
            <ArrowRight size={16} />
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
