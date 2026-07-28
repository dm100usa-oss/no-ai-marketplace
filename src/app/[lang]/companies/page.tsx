import type { Metadata } from "next";
import { ParticipantPageView } from "@/components/ParticipantPageView";
import { getDictionary } from "@/i18n";
import {
  DEFAULT_LOCALE,
  isLocale,
  localizedPath,
  altLanguages,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/companies";
const KEY = "companies" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const page = getDictionary(locale).participants[KEY];
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: localizedPath(locale, ROUTE),
      languages: altLanguages(ROUTE),
    },
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
  return (
    <ParticipantPageView
      lang={locale}
      dict={dict}
      page={dict.participants[KEY]}
      type="company"
      route={ROUTE}
      browseHref="/directory?type=company"
    />
  );
}
