import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlansTable } from "@/components/PlansTable";
import { CheckShield, ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

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
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/join" className="btn btn-ink">
              {dict.pricing.addProfile}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/method" className="btn btn-quiet">
              {dict.pricing.readStandards}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
