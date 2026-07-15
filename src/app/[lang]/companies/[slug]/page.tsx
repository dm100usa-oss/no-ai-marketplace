import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileL } from "@/lib/localized-data";
import { profiles as baseProfiles } from "@/data/profiles";
import { site } from "@/lib/config";
import { ProfileView } from "@/components/ProfileView";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/** Static pages for companies only, per language. */
export function generateStaticParams() {
  const companies = baseProfiles.filter((p) => p.profileType === "company");
  return LOCALES.flatMap((lang) => companies.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const p = getProfileL(slug, locale);
  if (!p) return {};
  const title = p.seoTitle ?? p.name;
  const description = p.seoDescription ?? p.shortDescription;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedPath(l, `/companies/${p.slug}`);
  return {
    title,
    description,
    // A made-up profile should not compete in search with real ones.
    robots: p.demo ? { index: false, follow: true } : undefined,
    alternates: { canonical: localizedPath(locale, `/companies/${p.slug}`), languages },
    openGraph: { title, description, url: `${site.url}${localizedPath(locale, `/companies/${p.slug}`)}`, type: "profile" },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const p = getProfileL(slug, locale);
  if (!p || p.profileType !== "company") notFound();
  return <ProfileView lang={locale} dict={dict} profile={p} />;
}
