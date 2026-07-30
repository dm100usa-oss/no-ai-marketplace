import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

const ROUTE = "/profile-submitted";
const KEY = "profileSubmitted" as const;

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

/**
 * Where a finished Tally form lands the person.
 *
 * Each form redirects here with its own ?type=, so a creator, a team and a
 * company are told what happens next in their own words: a team is reminded
 * that its members need profiles of their own, a company that the letter
 * goes to the contact person it named. An address without a type, or with
 * one we do not know, falls back to the general wording, so a mistyped
 * redirect never leaves the page empty.
 */
type SubmittedType = keyof typeof KEYS_BY_TYPE;
const KEYS_BY_TYPE = { creator: 1, team: 1, company: 1 } as const;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { lang } = await params;
  const { type } = await searchParams;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const s = dict.status[KEY];
  const byType =
    type && type in KEYS_BY_TYPE
      ? dict.joinType.submitted[type as SubmittedType]
      : s.description;
  return (
    <StatusPage
      lang={locale}
      kind="success"
      title={s.title}
      description={byType}
      primary={{ href: "/", label: s.primary }}
      secondary={{ href: "/directory", label: s.secondary }}
    />
  );
}
