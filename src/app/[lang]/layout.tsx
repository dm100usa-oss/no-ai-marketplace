import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/config";
import { getDictionary } from "@/i18n";
import { LOCALES, DEFAULT_LOCALE, isLocale, localizedPath, LOCALE_HTML_LANG } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

// Self-hosted fonts (Inter + Manrope) — no external fetch at build time.
const inter = localFont({
  src: [
    { path: "../fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const manrope = localFont({
  src: [
    { path: "../fonts/manrope-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/manrope-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/manrope-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

/** Build one static shell per language. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = localizedPath(l, "/");
  }

  return {
    title: {
      default: `${dict.site.name}. ${dict.site.tagline}, ${dict.site.taglineSub}. ${dict.site.slogan}`,
      template: `%s. ${dict.site.name}`,
    },
    description: dict.site.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: localizedPath(locale, "/"),
      languages: { ...languages, "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: dict.site.name,
      title: `${dict.site.name}. ${dict.site.tagline}, ${dict.site.taglineSub}`,
      description: dict.site.description,
      url: `${site.url}${localizedPath(locale, "/")}`,
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.site.name}. ${dict.site.tagline}, ${dict.site.taglineSub}`,
      description: dict.site.description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: dict.site.name,
        url: `${site.url}${localizedPath(locale, "/")}`,
        description: dict.site.description,
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}${localizedPath(locale, "/directory")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: dict.site.name,
        url: site.url,
        description: dict.site.description,
      },
    ],
  };

  return (
    <html lang={LOCALE_HTML_LANG[locale]} className={`${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col" style={{ fontFamily: "var(--font-inter), var(--font-body)" }}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header lang={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={locale} dict={dict} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
