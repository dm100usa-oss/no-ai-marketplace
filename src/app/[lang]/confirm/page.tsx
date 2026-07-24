import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { confirmSubmissionEmail } from "@/lib/redis";

/**
 * The page the welcome-email link opens.
 *
 * The token from the link is checked on the server: a match marks the
 * submission confirmed and shows the success page; anything else — a used
 * link, a bad token, a store hiccup — shows the neutral "no longer active"
 * page rather than an error. Either way the visitor lands somewhere calm
 * with a way onward.
 *
 * Never indexed: it is a one-time action link, not a page for search.
 */

const ROUTE = "/confirm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.status.confirmOk.title,
    description: dict.status.confirmOk.description,
    robots: { index: false, follow: false },
    alternates: { canonical: localizedPath(locale, ROUTE) },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { lang } = await params;
  const { token } = await searchParams;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const confirmed = token ? await confirmSubmissionEmail(token) : null;
  const s = confirmed ? dict.status.confirmOk : dict.status.confirmFail;

  return (
    <StatusPage
      lang={locale}
      kind={confirmed ? "success" : "warn"}
      title={s.title}
      description={s.description}
      primary={{ href: "/", label: s.primary }}
      secondary={{
        href: confirmed ? "/directory" : "/contact",
        label: s.secondary,
      }}
    />
  );
}
