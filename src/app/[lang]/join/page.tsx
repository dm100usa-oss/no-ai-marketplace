import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/config";
import { FAQ } from "@/components/FAQ";
import { JoinPicker } from "@/components/JoinPicker";
import { ArrowRight } from "@/components/icons";
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
  const languages = altLanguages("/join");
  return {
    title: dict.join.metaTitle,
    description: dict.join.metaDescription,
    alternates: { canonical: localizedPath(locale, "/join"), languages },
  };
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const freeDate = new Date(site.freeUntil).toLocaleDateString(
    locale === "ru" ? "ru-RU" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );

  // The thank-you intro is two sentences: the first reads as a heading,
  // the rest as a softer line under it.
  const introParts = dict.join.intro.split(/(?<=\.)\s+/);
  const introLead = introParts[0].replace(/\.$/, "");
  const introRest = introParts.slice(1).join(" ");

  const faqItems = dict.join.faq;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: dict.join.title }]}
      />

      <div className="mx-auto max-w-3xl">
        {/* Thank-you intro — first sentence as a heading, no card, no image
            (the welcome line lives on the published profile page instead). */}
        <p
          className="text-[1.5rem] font-bold md:text-[1.8rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {introLead}
        </p>
        {introRest ? <p className="lead mt-3">{introRest}</p> : null}

        {/* Steps — how it works. Indented so the "How it works" heading sits
            above the step titles (which start after the number circle). */}
        <div className="mt-12 pl-12">
          <h2>{dict.join.howTitle}</h2>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {dict.join.steps.map((s, i) => (
            <div key={s.t} className="flex gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold text-white"
                style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
              >
                {i + 1}
              </span>
              <div>
                <p
                  className="text-[1.2rem] font-bold md:text-[1.35rem]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {s.t}
                </p>
                <p className="mt-0.5 text-[1rem]" style={{ color: "var(--color-muted)" }}>
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Who you are — accordion, each type opens its own form */}
        <div id="form" className="mt-12 scroll-mt-32">
          <JoinPicker lang={locale} dict={dict} />
        </div>

        {/* Plans — one source of truth lives on /pricing */}
        <h2 className="mt-12">{dict.join.plansTitle}</h2>
        <div
          className="mt-4 rounded-2xl border p-5"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <p
            className="text-[1.05rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {dict.pricing.freeBannerTitle.replace("{n}", String(site.freeSlots))}
          </p>
          <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
            {dict.pricing.freeBannerText
              .replace("{n}", String(site.freeSlots))
              .replace("{date}", freeDate)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/pricing" className="btn btn-quiet">
              {dict.join.seePricing}
              <ArrowRight size={16} />
            </LocaleLink>
          </div>
        </div>

        {/* Rules and standards */}
        <h2 className="mt-12">{dict.join.rulesTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.join.rulesText1}
          <LocaleLink lang={locale} href="/method" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {dict.join.rulesLink1}
          </LocaleLink>
          {dict.join.rulesText2}
          <LocaleLink lang={locale} href="/listing-policy" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {dict.join.rulesLink2}
          </LocaleLink>
          {dict.join.rulesText3}
        </p>

        {/* FAQ */}
        <h2 className="mt-12">{dict.join.faqTitle}</h2>
        <div className="mt-4">
          <FAQ items={faqItems} />
        </div>
      </div>
    </div>
  );
}
