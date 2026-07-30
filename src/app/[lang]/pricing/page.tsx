import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlansTable } from "@/components/PlansTable";
import { CheckShield, ArrowRight } from "@/components/icons";
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
  const languages = altLanguages("/pricing");
  return {
    title: dict.pricing.metaTitle,
    description: dict.pricing.metaDescription,
    alternates: { canonical: localizedPath(locale, "/pricing"), languages },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: dict.pricing.title }]}
      />

      <div className="mx-auto max-w-3xl">
        {/* The page title is set to the h2 size on purpose. At full h1 size
            it towered over "Выберите свой тариф" further down and made the
            word "Цены" the loudest thing on a page whose real subject is the
            offer underneath. Same weight and family, one step quieter. */}
        <h1 className="text-center" style={{ fontSize: "var(--text-h2)" }}>
          {dict.pricing.title}
        </h1>
        {/* The subtitle, part of the title block rather than a paragraph of
            its own: centred with the title, in the display face, one step
            below it in size. It says why anyone should be on this page at
            all, so it comes before the bookkeeping about who pays for what.
            It used to stand lower, between that paragraph and the offer;
            leaving a copy there would be the same sentence twice. */}
        <p
          className="mx-auto mt-3 max-w-2xl text-center text-[1.15rem] font-semibold leading-snug md:text-[1.3rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {dict.pricing.headline}
        </p>

        <p className="lead mt-6">{dict.pricing.intro}</p>

        <div className="mt-10">
          <PlansTable lang={locale} dict={dict} />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="!text-[1.25rem]">{dict.pricing.everythingTitle}</h2>
            <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
              {dict.pricing.everythingItems.map((line) => (
                <li key={line} className="flex gap-2 text-[0.95rem]">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="!text-[1.25rem]">{dict.pricing.howPaymentTitle}</h2>
            <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              {dict.pricing.howPaymentText1}
            </p>
            <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              {dict.pricing.howPaymentText2}
            </p>
          </div>
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{dict.pricing.readyTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {dict.pricing.readyText}
          </p>
          {/* Both actions run the full width of the plate they stand on and
              sit one under the other. Side by side they were two short
              buttons floating in a wide box with empty space to the right,
              which read as a leftover rather than as a choice. */}
          <div className="mt-4 flex flex-col gap-2">
            <LocaleLink
              lang={locale}
              href="/join"
              className="btn btn-ink btn-full"
              style={{ minHeight: "var(--h-action-lg)" }}
            >
              {dict.pricing.addProfile}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink
              lang={locale}
              href="/method"
              className="btn btn-quiet btn-full"
              style={{ minHeight: "var(--h-action-lg)" }}
            >
              {dict.pricing.readStandards}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
