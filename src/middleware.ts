import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/config";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
