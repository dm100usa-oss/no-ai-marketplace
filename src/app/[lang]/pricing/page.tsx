import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pricing, planCheckoutHref, site } from "@/lib/config";
import { CheckoutButton } from "@/components/CheckoutButton";
import { CheckShield, ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedPath(l, "/pricing");
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
        <h1>{dict.pricing.title}</h1>
        <p className="lead mt-4">{dict.pricing.intro}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <PlanCard
            lang={locale}
            plan="free"
            title={dict.pricing.planFree}
            price={pricing.free.priceLabel}
            period={dict.pricing.periodFree}
            features={dict.pricing.featuresFree}
            highlight={false}
            claimLabel={dict.pricing.claimFree}
            getStartedLabel={dict.pricing.getStarted}
          />
          <PlanCard
            lang={locale}
            plan="monthly"
            title={dict.pricing.planMonthly}
            price={pricing.monthly.priceLabel}
            period={dict.pricing.periodMonthly}
            features={dict.pricing.featuresMonthly}
            highlight={false}
            claimLabel={dict.pricing.claimFree}
            getStartedLabel={dict.pricing.getStarted}
          />
          <PlanCard
            lang={locale}
            plan="yearly"
            title={dict.pricing.planYearly}
            price={pricing.yearly.priceLabel}
            period={dict.pricing.periodYearly}
            note={dict.pricing.yearlyNote}
            features={dict.pricing.featuresYearly}
            highlight
            claimLabel={dict.pricing.claimFree}
            getStartedLabel={dict.pricing.getStarted}
          />
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
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/join" className="btn btn-ink">
              {dict.pricing.addProfile}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/human-made-standards" className="btn btn-quiet">
              {dict.pricing.readStandards}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  lang,
  plan,
  title,
  price,
  period,
  note,
  features,
  highlight,
  claimLabel,
  getStartedLabel,
}: {
  lang: Locale;
  plan: "free" | "monthly" | "yearly";
  title: string;
  price: string;
  period: string;
  note?: string;
  features: string[];
  highlight: boolean;
  claimLabel: string;
  getStartedLabel: string;
}) {
  const href = plan === "free" ? "/join#form" : planCheckoutHref(plan);
  const label = plan === "free" ? claimLabel : getStartedLabel;
  const btnClass = `btn mt-6 ${highlight ? "btn-ink" : "btn-quiet"}`;

  return (
    <div
      className="flex flex-col rounded-2xl border p-6"
      style={{
        borderColor: highlight ? "var(--color-accent)" : "var(--color-line)",
        background: highlight ? "var(--color-brand-soft)" : "#fff",
      }}
    >
      <p
        className="text-[0.78rem] font-semibold uppercase tracking-wide"
        style={{ color: highlight ? "var(--color-accent)" : "var(--color-muted-soft)" }}
      >
        {title}
      </p>
      <p
        className="mt-2 text-[2rem] font-bold leading-none"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        {price}
      </p>
      <p className="mt-1 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
        {period}
      </p>
      {note && (
        <p className="mt-2 text-[0.85rem] font-semibold" style={{ color: "var(--color-accent)" }}>
          {note}
        </p>
      )}

      <ul className="mt-4 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
            <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
            {f}
          </li>
        ))}
      </ul>

      <CheckoutButton lang={lang} plan={plan} href={href} label={label} className={btnClass} />
    </div>
  );
}
