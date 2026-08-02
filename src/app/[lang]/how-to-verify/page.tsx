import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { ArrowRight } from "@/components/icons";
import { documentSchema } from "@/lib/schema";
import { site } from "@/lib/config";
import { getDictionary } from "@/i18n";
import { getFaqProfessions } from "@/i18n/data/faqProfessions";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * The checklist: how somebody hiring checks that a piece was not generated.
 *
 * Every other page here is written for a member or about the catalog. This
 * one is written for a person who may never join and may never hire anyone
 * listed, and that is the point. It is useful on its own, which is what
 * makes it worth citing and worth linking to from outside.
 *
 * It also does not duplicate anything. "Our method" says how we check.
 * "Human-made standards" says what counts. "Work stages" says what a
 * member submits. This says what a client asks, using the same HTVS scale
 * so the four texts read as one body of work rather than four takes on the
 * same subject.
 */

const ROUTE = "/how-to-verify";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages = altLanguages(ROUTE);
  return {
    title: dict.howToVerify.metaTitle,
    description: dict.howToVerify.metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
  };
}

export default async function HowToVerifyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const p = dict.howToVerify;
  const professions = getFaqProfessions(locale);

  // The page as a dated document, plus the questions as an ordered list.
  //
  // Deliberately not FAQPage. These are questions to put to somebody else,
  // and the text under each is what you hope to hear back, not this site
  // answering. Declaring them as our own answers would be markup that says
  // something the page does not, which is the one mistake that gets a
  // whole file discounted.
  const jsonLd = {
    ...documentSchema({
      route: ROUTE,
      title: p.title,
      description: p.metaDescription,
      locale,
    }),
    mainEntity: {
      "@type": "ItemList",
      name: p.questionsTitle,
      numberOfItems: p.questions.length,
      itemListElement: p.questions.map((q, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: q.q,
        description: `${p.goodLabel}: ${q.good} ${p.badLabel}: ${q.bad}`,
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
          { label: p.title },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{p.title}</h1>
        <UpdatedStamp route={ROUTE} lang={locale} dict={dict} className="mt-3" />
        <p className="lead mt-4">{p.subtitle}</p>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{p.whyTitle}</h2>
          {p.whyParagraphs.map((text, i) => (
            <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
              {text}
            </p>
          ))}
        </section>

        <div
          className="mt-8 rounded-2xl border p-5"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.05rem]">{p.caveatTitle}</h2>
          <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
            {p.caveatText}
          </p>
        </div>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{p.questionsTitle}</h2>
          {p.questionsIntro.map((text, i) => (
            <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
              {text}
            </p>
          ))}

          <ol className="mt-6 space-y-4">
            {p.questions.map((q, i) => (
              <li
                key={q.q}
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--color-line)" }}
              >
                <h3 className="text-[1.05rem]">
                  <span className="mr-2" style={{ color: "var(--color-muted-soft)" }}>
                    {i + 1}
                  </span>
                  {q.q}
                </h3>
                <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-ink)" }}>{p.goodLabel}:</strong> {q.good}
                </p>
                <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  <strong style={{ color: "var(--color-ink)" }}>{p.badLabel}:</strong> {q.bad}
                </p>
                <p className="mt-2 text-[0.88rem]" style={{ color: "var(--color-muted-soft)" }}>
                  {p.levelLabel}: {q.level}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{p.decisionTitle}</h2>
          {p.decisionParagraphs.map((text, i) => (
            <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
              {text}
            </p>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{p.tracesTitle}</h2>
          {p.tracesParagraphs.map((text, i) => (
            <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
              {text}
            </p>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="section-title !text-[1.35rem]">{p.professionsTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {p.professionsIntro}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {professions.map((prof) => (
              <LocaleLink
                key={prof.slug}
                lang={locale}
                href={`/faq/${prof.slug}`}
                className="btn btn-quiet !flex h-full w-full justify-center text-center !leading-snug"
              >
                {prof.title}
              </LocaleLink>
            ))}
          </div>
        </section>

        <RelatedLinks
          lang={locale}
          dict={dict}
          links={["/method", "/human-made-standards", "/work-stages", "/directory"]}
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
