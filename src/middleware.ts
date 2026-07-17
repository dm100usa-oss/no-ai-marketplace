import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/config";
import { FAQ_PROFESSION_CATEGORY } from "@/i18n/data/faqProfessions";

/**
 * Locale routing.
 *
 * English is the default and keeps clean URLs at the root (/, /pricing).
 * Internally those requests are rewritten to /en/... so a single set of
 * pages under app/[lang] serves every language. Non-default locales carry
 * a visible prefix (/ru, /ru/pricing) and pass straight through.
 *
 * On every request we also set an x-locale header so the root layout can
 * render the correct <html lang> attribute.
 *
 * Files, Next internals, and the SEO endpoints (sitemap, robots) are left
 * untouched by the matcher below.
 */

const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/**
 * The per-profession FAQ pages that used to live at /faq/<profession> now
 * sit on the matching category page, next to the profiles they talk about.
 * The old URLs redirect permanently so nothing they earned is lost.
 */
function faqRedirectTarget(pathname: string): string | null {
  const m = pathname.match(/^(\/[a-z]{2})?\/faq\/([^/]+)\/?$/);
  if (!m) return null;
  const prefix = m[1] ?? "";
  const category = FAQ_PROFESSION_CATEGORY[m[2]];
  return category ? `${prefix}/categories/${category}` : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const faqTarget = faqRedirectTarget(pathname);
  if (faqTarget) {
    const url = request.nextUrl.clone();
    url.pathname = faqTarget;
    return NextResponse.redirect(url, 301);
  }

  // Which locale does this path already carry?
  const prefixLocale = PREFIXED_LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (prefixLocale) {
    // e.g. /ru/pricing — serve as-is, just tag the locale.
    const res = NextResponse.next();
    res.headers.set("x-locale", prefixLocale);
    return res;
  }

  // No locale prefix: this is the default language. Rewrite to /en/... so
  // the [lang] segment resolves, but keep the clean URL in the address bar.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-locale", DEFAULT_LOCALE);
  return res;
}

export const config = {
  // Run on everything except Next internals, static files, and SEO files
  // that must stay at the root without a locale rewrite.
  matcher: [
    "/((?!_next/|api/|favicon|apple-touch-icon|android-chrome|icon|robots.txt|sitemap.xml|site.webmanifest|images/|fonts/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|woff2?)$).*)",
  ],
};
