import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisitBeacon } from "@/components/VisitBeacon";
import { ImageGuard } from "@/components/ImageGuard";
import { site, owner } from "@/lib/config";
import { getDictionary } from "@/i18n";
import { LOCALES, DEFAULT_LOCALE, isLocale, localizedPath, altLanguages, LOCALE_HTML_LANG } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

// Self-hosted fonts (Inter + Manrope) — no external fetch at build time.
//
// Latin and Cyrillic are separate files at every weight, and both have to
// be here. With only the Latin ones loaded, Russian text quietly fell back
// to whatever the phone had — SF Pro on an iPhone — and a line mixing the
// two alphabets showed it: "Разработка и IT" put a heavy system bold next
// to Manrope's lighter bold, and the Latin half read as not-quite-bold.
// The same happened to every UI/UX, No AI and 3D on the site. Loading the
// Cyrillic subsets puts both alphabets in the same typeface, so the weights
// match because they are the same weight.
//
// The subsets carry unicode-range, so a browser only downloads the half it
// needs for the page it is showing. Each Cyrillic file is around 8 KB.

const manrope = localFont({
  src: [
    { path: "../fonts/manrope-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../fonts/manrope-cyrillic-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

// Onest carries the whole site: headings, body, everything except the
// wordmark. Cyrillic and Latin are drawn as one family, so a line
// mixing "No AI" with Russian words keeps an even weight. Manrope
// stays loaded for the logo alone, so the name keeps the shape it has
// had since the first day.
const onest = localFont({
  src: [
    { path: "../fonts/onest-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/onest-cyrillic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/onest-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/onest-cyrillic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/onest-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/onest-cyrillic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/onest-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/onest-cyrillic-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/onest-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../fonts/onest-cyrillic-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-onest",
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

  const languages = altLanguages("/");

  // The sub-headline carries a hard line break for the hero. Page titles and
  // social cards need it on one line, so flatten it here.
  const taglineSub = dict.site.taglineSub.replace(/\s*\n\s*/g, " ");

  return {
    title: {
      default: `${dict.site.name}. ${dict.site.tagline}. ${taglineSub}. ${dict.site.slogan}`,
      template: `%s. ${dict.site.name}`,
    },
    description: dict.site.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: localizedPath(locale, "/"),
      languages,
    },
    openGraph: {
      type: "website",
      siteName: dict.site.name,
      title: `${dict.site.name}. ${dict.site.tagline}. ${taglineSub}`,
      description: dict.site.description,
      url: `${site.url}${localizedPath(locale, "/")}`,
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.site.name}. ${dict.site.tagline}. ${taglineSub}`,
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
        // Ties the two nodes together: without this they are read as two
        // unrelated things that happen to share an address.
        publisher: { "@id": `${site.url}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}${localizedPath(locale, "/directory")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}#organization`,
        name: dict.site.name,
        legalName: owner.legalName,
        url: site.url,
        description: dict.site.description,
        foundingDate: owner.foundingYear,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}${owner.logoPath}`,
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: owner.country,
        },
        knowsAbout: owner.knowsAbout,
        // The three policy fields below are how an organisation that
        // publishes without bylines states its authority: not who wrote
        // this, but under what rules it was published, reviewed and
        // corrected. Answer engines read them as editorial process.
        publishingPrinciples: `${site.url}${localizedPath(locale, "/listing-policy")}`,
        // Named on purpose: the review procedure is the whole product.
        actionableFeedbackPolicy: `${site.url}${localizedPath(locale, "/verification-policy")}`,
        correctionsPolicy: `${site.url}${localizedPath(locale, "/content-removal")}`,
        ...(owner.contactEmail
          ? {
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: owner.contactEmail,
                availableLanguage: ["en", "ru"],
              },
            }
          : {}),
      },
    ],
  };

  return (
    <html lang={LOCALE_HTML_LANG[locale]} className={`${manrope.variable} ${onest.variable}`}>
      <body className="flex min-h-screen flex-col" style={{ fontFamily: "var(--font-body)" }}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header lang={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={locale} dict={dict} />
        <VisitBeacon />
        <ImageGuard />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
