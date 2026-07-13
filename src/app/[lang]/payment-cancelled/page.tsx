import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/payment-cancelled";
const KEY = "paymentCancelled" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.status[KEY].title,
    description: dict.status[KEY].description,
    robots: { index: false, follow: false },
    alternates: { canonical: localizedPath(locale, ROUTE) },
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
  const s = dict.status[KEY];
  return (
    <StatusPage
      lang={locale}
      kind="info"
      title={s.title}
      description={s.description}
      primary={{ href: "/join", label: s.primary }}
      secondary={{ href: "/pricing", label: s.secondary }}
    />
  );
}
