import type { Metadata } from "next";
import { getLiveProfiles } from "@/lib/live-profiles";
import { notFound } from "next/navigation";
import { getProfileL } from "@/lib/localized-data";
import { site } from "@/lib/config";
import { ProfileView } from "@/components/ProfileView";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/** Static pages for creators only, per language. */
/**
 * Addresses built up front. Reads the live catalog, so a profile
 * approved since the last deploy gets its page here too; anything that
 * arrives later is rendered on first visit and then kept.
 */
export async function generateStaticParams() {
  const all = await getLiveProfiles();
  const creators = all.filter((p) => p.profileType === "creator");
  return LOCALES.flatMap((lang) => creators.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const p = await getProfileL(slug, locale);
  if (!p) return {};
  const title = p.seoTitle ?? p.name;
  const description = p.seoDescription ?? p.shortDescription;
  const languages = altLanguages(`/creators/${p.slug}`);
  return {
    title,
    description,
    // A made-up profile should not compete in search with real ones.
    robots: p.demo ? { index: false, follow: true } : undefined,
    alternates: { canonical: localizedPath(locale, `/creators/${p.slug}`), languages },
    openGraph: { title, description, url: `${site.url}${localizedPath(locale, `/creators/${p.slug}`)}`, type: "profile" },
  };
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const p = await getProfileL(slug, locale);
  if (!p || p.profileType !== "creator") notFound();
  return <ProfileView lang={locale} dict={dict} profile={p} />;
}
