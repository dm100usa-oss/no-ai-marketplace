import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { faqSchema } from "@/lib/schema";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { getFaqProfessions } from "@/i18n/data/faqProfessions";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/faq";

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
    title: dict.faqPage.metaTitle,
    description: dict.faqPage.metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const p = dict.faqPage;

  const professions = getFaqProfessions(locale);

  // The hub declares its own questions and only its own. These are the
  // general ones about the catalog itself, asked by both sides; the
  // profession pages hold an entirely separate set and declare those.
  // Nothing is offered to an engine twice.
  const faqJsonLd = faqSchema({
    route: ROUTE,
    title: p.title,
    locale,
    items: p.groups.flatMap((g) => g.items),
  });

  return (
    // Tinted band behind the whole page: white question cards on white
    // background gave the page no shape at all. The colour is the same
    // one the catalog bands use, so nothing new is introduced.
    <div className="section-brand">
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: p.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{p.title}</h1>
        <UpdatedStamp route={ROUTE} lang={locale} dict={dict} className="mt-3" />
        <p className="lead mt-4">{p.intro}</p>

        <div className="mt-10 space-y-10">
          {p.groups.map((group) => (
            <section key={group.title}>
              <h2 className="!text-[1.35rem]">{group.title}</h2>
              <div className="mt-4">
                <FAQ items={group.items} />
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="!text-[1.35rem]">{p.byProfessionTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {p.byProfessionIntro}
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

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{p.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {p.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/directory" className="btn btn-ink">
              {p.ctaFind}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/join" className="btn btn-quiet">
              {p.ctaJoin}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
