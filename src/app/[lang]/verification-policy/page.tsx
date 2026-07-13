import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/verification-policy";
const KEY = "verificationPolicy" as const;

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
    title: dict.legal[KEY].title,
    description: dict.legal[KEY].intro,
    alternates: { canonical: localizedPath(locale, ROUTE), languages },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return (
    <StubPage
      lang={locale}
      dict={dict}
      title={dict.legal[KEY].title}
      intro={dict.legal[KEY].intro}
      note={dict.stub.ownerNote}
    />
  );
}
