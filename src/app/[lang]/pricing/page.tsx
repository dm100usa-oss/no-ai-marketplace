import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlansTable } from "@/components/PlansTable";
import { CheckShield, ArrowRight } from "@/components/icons";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { site, plans, PLAN_ORDER } from "@/lib/config";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/pricing";

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
    title: dict.pricing.metaTitle,
    description: dict.pricing.metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
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

  // Prices stated in the page are also stated in machine-readable form.
  // "How much does it cost" is one of the few questions an answer engine
  // will not guess at: given a figure only inside a sentence it tends to
  // say the price is on the site, which sends nobody anywhere. Given an
  // offer it says the number.
  //
  // Both periods are listed per plan, and the free places are an offer of
  // their own with the end date attached, so the free window cannot be
  // quoted back after it has closed.
  const offersJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: dict.site.name,
    description: dict.pricing.metaDescription,
    url: `${site.url}${localizedPath(locale, ROUTE)}`,
    provider: { "@id": `${site.url}#organization` },
    offers: [
      {
        "@type": "Offer",
        name: dict.pricing.freeNowLabel,
        price: 0,
        priceCurrency: "USD",
        availabilityEnds: "2026-12-31",
        description: dict.pricing.introBody,
      },
      ...PLAN_ORDER.flatMap((id) => [
        {
          "@type": "Offer",
          name: dict.pricing.planNames[id],
          price: plans[id].monthly.price,
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: plans[id].monthly.price,
            priceCurrency: "USD",
            billingDuration: 1,
            billingIncrement: 1,
            unitCode: "MON",
          },
        },
        {
          "@type": "Offer",
          name: dict.pricing.planNames[id],
          price: plans[id].yearly.price,
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: plans[id].yearly.price,
            priceCurrency: "USD",
            billingDuration: 1,
            billingIncrement: 1,
            unitCode: "ANN",
          },
        },
      ]),
    ],
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: dict.pricing.title }]}
      />

      <div>
        {/* The page title is set to the h2 size on purpose. At full h1 size
            it towered over "Выберите свой тариф" further down and made the
            word "Цены" the loudest thing on a page whose real subject is the
            offer underneath. Same weight and family, one step quieter. */}
        <h1 className="text-center" style={{ fontSize: "var(--text-h2)" }}>
          {dict.pricing.title}
        </h1>
        <UpdatedStamp route={ROUTE} lang={locale} dict={dict} className="mt-3 text-center" />
        <div className="mt-6">
          <PlansTable lang={locale} dict={dict} />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="!text-[1.25rem]">{dict.pricing.everythingTitle}</h2>
            <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
              {dict.pricing.everythingItems.map((line) => (
                <li key={line} className="flex gap-2 text-[1.15rem]">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="!text-[1.25rem]">{dict.pricing.howPaymentTitle}</h2>
            <p className="mt-3 text-[1.15rem]" style={{ color: "var(--color-muted)" }}>
              {dict.pricing.howPaymentText1}
            </p>
            <p className="mt-3 text-[1.15rem]" style={{ color: "var(--color-muted)" }}>
              {dict.pricing.howPaymentText2}
            </p>
          </div>
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{dict.pricing.readyTitle}</h2>
          <p className="mt-2 text-[1.15rem]" style={{ color: "var(--color-muted)" }}>
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
