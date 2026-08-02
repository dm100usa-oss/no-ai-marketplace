import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { OriginCheckActions } from "@/components/OriginCheckActions";
import { ArrowRight } from "@/components/icons";
import { documentSchema } from "@/lib/schema";
import { site } from "@/lib/config";
import { getDictionary } from "@/i18n";
import {
  getOriginCheck,
  getOriginCheckProfession,
  ORIGIN_CHECK_SLUGS,
} from "@/i18n/data/originCheck";
import { getCategoryL } from "@/lib/localized-data";
import { getFaqProfession } from "@/i18n/data/faqProfessions";
import { LOCALES, DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * One trade, one address.
 *
 * This is the page the whole tool exists for: it answers a question
 * somebody types into a search box word for word, it is useful with no
 * catalog behind it, and it is small enough to be quoted whole. Pages are
 * generated only for trades that have a written guide, so the set grows
 * with the copy rather than ahead of it.
 */

export async function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    ORIGIN_CHECK_SLUGS.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const prof = getOriginCheckProfession(locale, slug);
  if (!prof) return {};
  const languages = altLanguages(`/origin-check/${slug}`);
  return {
    title: prof.metaTitle,
    description: prof.metaDescription,
    alternates: { canonical: localizedPath(locale, `/origin-check/${slug}`), languages },
  };
}

/** The guide as plain text, for the copy button. Built from the same copy
 *  the page renders, so the two can never drift apart. */
function asPlainText(
  oc: ReturnType<typeof getOriginCheck>,
  prof: NonNullable<ReturnType<typeof getOriginCheckProfession>>,
): string {
  const lines: string[] = [];
  lines.push(`${oc.title}. ${prof.title}`);
  lines.push("");
  lines.push(prof.lead);
  lines.push("");
  lines.push(oc.signsTitle);
  prof.signs.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push(oc.askTitle);
  prof.ask.forEach((a, i) => {
    lines.push(`${i + 1}. ${a.q}`);
    lines.push(`   ${oc.goodLabel}: ${a.good}`);
    lines.push(`   ${oc.badLabel}: ${a.bad}`);
  });
  lines.push("");
  lines.push(oc.warnTitle);
  prof.warn.forEach((w) => lines.push(`- ${w}`));
  lines.push("");
  lines.push(oc.decisionText);
  return lines.join("\n");
}

export default async function OriginCheckProfessionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const oc = getOriginCheck(locale);
  const prof = getOriginCheckProfession(locale, slug);
  if (!prof) notFound();

  const route = `/origin-check/${slug}`;
  // The catalog page for this trade, and its question guide, when they
  // exist under the same slug. Both are separate answers to separate
  // questions, so they are offered rather than merged.
  const category = getCategoryL(slug, locale);
  const faq = getFaqProfession(locale, slug);

  const jsonLd = {
    ...documentSchema({
      route,
      title: prof.metaTitle,
      description: prof.metaDescription,
      locale,
    }),
    mainEntity: {
      "@type": "ItemList",
      name: oc.askTitle,
      numberOfItems: prof.ask.length,
      itemListElement: prof.ask.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.q,
        description: `${oc.goodLabel}: ${a.good} ${oc.badLabel}: ${a.bad}`,
      })),
    },
    isPartOf: {
      "@type": "WebPage",
      name: oc.title,
      url: `${site.url}${localizedPath(locale, "/origin-check")}`,
    },
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="no-print">
        <Breadcrumbs
          lang={locale}
          items={[
            { label: dict.common.home, href: "/" },
            { label: oc.title, href: "/origin-check" },
            { label: prof.title },
          ]}
        />
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
          {oc.title}
        </p>
        <h1 className="mt-1">{prof.metaTitle}</h1>
        <UpdatedStamp route={route} lang={locale} dict={dict} className="mt-3" />

        <OriginCheckActions
          printLabel={oc.downloadLabel}
          copyLabel={oc.copyLabel}
          copiedLabel={oc.copiedLabel}
          copyText={asPlainText(oc, prof)}
        />

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.professionLeadTitle}</h2>
          <p className="mt-3" style={{ color: "var(--color-muted)" }}>
            {prof.lead}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.signsTitle}</h2>
          <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
            {prof.signs.map((s) => (
              <li key={s} className="flex gap-3 text-[0.98rem]">
                <span aria-hidden className="bullet-ball" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.askTitle}</h2>
          <ol className="mt-4 space-y-4">
            {prof.ask.map((a, i) => (
              <li
                key={a.q}
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--color-line)" }}
              >
                <h3 className="text-[1.05rem]">
                  <span className="mr-2" style={{ color: "var(--color-muted-soft)" }}>
                    {i + 1}
                  </span>
                  {a.q}
                </h3>
                <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-ink)" }}>{oc.goodLabel}:</strong> {a.good}
                </p>
                <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-ink)" }}>{oc.badLabel}:</strong> {a.bad}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.warnTitle}</h2>
          <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
            {prof.warn.map((w) => (
              <li key={w} className="flex gap-3 text-[0.98rem]">
                <span aria-hidden className="bullet-ball" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{oc.decisionTitle}</h2>
          <p className="mt-3" style={{ color: "var(--color-muted)" }}>
            {oc.decisionText}
          </p>
        </section>

        <div className="no-print">
          <div className="mt-10 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/origin-check" className="btn btn-quiet">
              {oc.backLabel}
            </LocaleLink>
            {faq && (
              <LocaleLink lang={locale} href={`/faq/${slug}`} className="btn btn-quiet">
                {dict.faqPage.professionAllQuestions}
              </LocaleLink>
            )}
            {category && (
              <LocaleLink lang={locale} href={`/categories/${slug}`} className="btn btn-ink">
                {dict.faqPage.professionSeeCatalog}
                <ArrowRight size={16} />
              </LocaleLink>
            )}
          </div>

          <RelatedLinks
            lang={locale}
            dict={dict}
            links={["/how-to-verify", "/method", "/human-made-standards", "/work-stages"]}
          />
        </div>
      </div>
    </div>
  );
}
