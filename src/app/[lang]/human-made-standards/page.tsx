import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckShield } from "@/components/icons";
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
  const languages = altLanguages("/human-made-standards");
  return {
    title: dict.standards.metaTitle,
    description: dict.standards.metaDescription,
    alternates: { canonical: localizedPath(locale, "/human-made-standards"), languages },
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

  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: s.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{s.title}</h1>
        <p className="lead mt-4">{s.intro}</p>

        <h2 className="mt-10">{s.oneLineTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {s.oneLineText}
        </p>

        <h2 className="mt-10">{s.belongsTitle}</h2>
        <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
          {s.belongsItems.map((it) => (
            <BulletItem key={it}>{it}</BulletItem>
          ))}
        </ul>

        <h2 className="mt-10">{s.hybridTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {s.hybridText1}
          <strong style={{ color: "var(--color-ink)" }}>{s.hybridStrong}</strong>
          {s.hybridText2}
        </p>

        <h2 className="mt-10">{s.notBelongTitle}</h2>
        <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
          {s.notBelongItems.map((it) => (
            <BulletItem key={it}>{it}</BulletItem>
          ))}
        </ul>

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
            <h3 className="text-[1.05rem]">{s.verificationBoxTitle}</h3>
            <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              {s.verificationBoxText1}
              <LocaleLink lang={locale} href="/verified" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {s.verificationLink}
              </LocaleLink>
              {s.verificationBoxText2}
            </p>
          </div>
        </div>

        <h2 className="mt-10">{s.ifWrongTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {s.ifWrongText1}
          <LocaleLink lang={locale} href="/listing-policy" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {s.listingPolicyLink}
          </LocaleLink>
          {s.ifWrongText2}
        </p>
      </div>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-[0.98rem]">
      <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
      <span>{children}</span>
    </li>
  );
}
