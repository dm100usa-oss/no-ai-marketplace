import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckShield } from "@/components/icons";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { documentSchema } from "@/lib/schema";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/human-made-standards";

/**
 * Human-Made standards: the definition, on an address of its own.
 *
 * It was folded into "Our method" for a while and has been separated
 * again on purpose. The two pages answer different questions. Method
 * answers how this catalog works; this one answers what counts as made
 * without generative AI, which is a definition, and a definition is the
 * kind of thing that gets cited by name. Method now carries a short
 * version and a link here rather than the whole account, so the two never
 * compete for the same question.
 */

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
    title: dict.standards.metaTitle,
    description: dict.standards.metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
  };
}

export default async function StandardsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const s = dict.standards;

  const jsonLd = documentSchema({
    route: ROUTE,
    title: s.title,
    description: s.metaDescription,
    locale,
  });

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: s.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{s.title}</h1>
        <UpdatedStamp route={ROUTE} lang={locale} dict={dict} className="mt-3" />
        <p className="lead mt-4">{s.intro}</p>

        <h2 className="section-title mt-10">{s.oneLineTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {s.oneLineText}
        </p>

        <h2 className="section-title mt-10">{s.belongsTitle}</h2>
        <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
          {s.belongsItems.map((it) => (
            <BulletItem key={it}>{it}</BulletItem>
          ))}
        </ul>

        <h2 className="section-title mt-10">{s.hybridTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {s.hybridText1}
          <strong style={{ color: "var(--color-ink)" }}>{s.hybridStrong}</strong>
          {s.hybridText2}
        </p>

        <h2 className="section-title mt-10">{s.notBelongTitle}</h2>
        <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
          {s.notBelongItems.map((it) => (
            <BulletItem key={it}>{it}</BulletItem>
          ))}
        </ul>

        {/* Two lines instead of the two sections that used to sit here.
            This page is a definition; it stopped being one as soon as it
            re-explained verification and reporting, both of which belong
            to pages of their own. Repeating them here also meant an answer
            engine met the same answer at two addresses and trusted
            neither. */}
        <div
          className="mt-10 flex gap-4 rounded-2xl border p-6"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: "#dff1e9", color: "#157a58" }}
          >
            <CheckShield size={20} />
          </span>
          <div>
            <h2 className="!text-[1.05rem]">{s.nextTitle}</h2>
            <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              {s.nextMethodText}
              <LocaleLink lang={locale} href="/method" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {s.nextMethodLink}
              </LocaleLink>
              .
            </p>
            <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              {s.nextReportText}
              <LocaleLink lang={locale} href="/listing-policy" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {s.nextReportLink}
              </LocaleLink>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-[0.98rem]">
      <span aria-hidden className="bullet-ball" />
      <span>{children}</span>
    </li>
  );
}
