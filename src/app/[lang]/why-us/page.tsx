import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/why-us";
const KEY = "whyUs" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedPath(l, ROUTE);
  return {
    title: dict[KEY].metaTitle,
    description: dict[KEY].metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return <ContentPage lang={locale} dict={dict} data={dict[KEY]} />;
}
