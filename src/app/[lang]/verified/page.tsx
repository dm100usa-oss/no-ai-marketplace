import type { Metadata } from "next";
import { getVerifiedProfilesL } from "@/lib/localized-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";
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
  const languages = altLanguages("/verified");
  return {
    title: dict.verified.metaTitle,
    description: dict.verified.metaDescription,
    alternates: { canonical: localizedPath(locale, "/verified"), languages },
  };
}

export default async function VerifiedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const list = getVerifiedProfilesL(locale);

  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: dict.verified.title }]}
      />

      <h1>{dict.verified.title}</h1>
      <p className="lead mt-3 max-w-3xl">{dict.verified.intro}</p>

      <div
        className="mt-6 rounded-xl border p-4 text-[0.9rem]"
        style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)", color: "var(--color-muted)" }}
      >
        {dict.verified.banner}
      </div>

      <div className="mt-10">
        <h2 className="!text-[1.35rem]">{dict.verified.howTitle}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {dict.verified.howCards.map((item, i) => (
            <div key={i} className="rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
              <h3 className="text-[1rem]">{item.t}</h3>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
                {item.d}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {dict.verified.twoBadges}
        </p>
      </div>

      <div className="mt-10">
        <p className="mb-5 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {list.length} {list.length === 1 ? dict.verified.countSuffixOne : dict.verified.countSuffixMany}
        </p>
        <ProfileGrid
          lang={locale}
          dict={dict}
          profiles={list}
          emptyTitle={dict.verified.emptyTitle}
          emptyMessage={dict.verified.emptyMessage}
        />
      </div>
    </div>
  );
}
