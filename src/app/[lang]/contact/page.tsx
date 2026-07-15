import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const CONTACT_EMAIL = "hello@no-ai-marketplace.example";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages = altLanguages("/contact");
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: { canonical: localizedPath(locale, "/contact"), languages },
  };
}

export default async function ContactPage({
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
        items={[{ label: dict.common.home, href: "/" }, { label: dict.contact.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{dict.contact.title}</h1>
        <p className="lead mt-4">{dict.contact.intro}</p>

        <div
          className="mt-8 rounded-2xl border p-6"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <p className="text-[0.82rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
            {dict.contact.emailLabel}
          </p>
          <p className="mt-1 text-[1.15rem] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>

        <h2 className="mt-10">{dict.contact.whatTitle}</h2>
        <div className="mt-3 space-y-4" style={{ color: "var(--color-muted)" }}>
          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>{dict.contact.addingTitle}</h3>
            <p className="mt-1 text-[0.98rem]">
              {dict.contact.addingText1}
              <LocaleLink lang={locale} href="/join" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {dict.contact.addingLink}
              </LocaleLink>
              {dict.contact.addingText2}
            </p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>{dict.contact.correctionsTitle}</h3>
            <p className="mt-1 text-[0.98rem]">{dict.contact.correctionsText}</p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>{dict.contact.reportingTitle}</h3>
            <p className="mt-1 text-[0.98rem]">{dict.contact.reportingText}</p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>{dict.contact.pressTitle}</h3>
            <p className="mt-1 text-[0.98rem]">{dict.contact.pressText}</p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>{dict.contact.legalTitle}</h3>
            <p className="mt-1 text-[0.98rem]">
              {dict.contact.legalText1}
              <LocaleLink lang={locale} href="/content-removal" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {dict.contact.legalLink}
              </LocaleLink>
              {dict.contact.legalText2}
            </p>
          </div>
        </div>

        <p className="mt-10 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {dict.contact.footNote}
        </p>
      </div>
    </div>
  );
}
