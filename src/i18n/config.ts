/**
 * Language configuration for the whole site.
 *
 * English is the default language and is served from the site root (/).
 * Russian is served from /ru. The structure is laid down so that a third
 * language (Spanish, /es) can be added by extending LOCALES and adding one
 * dictionary file plus the data translations — no page logic changes.
 *
 * A single source of truth: every part of the site (routing, hreflang,
 * canonical, sitemap, language switcher) reads the list from here.
 */

export const LOCALES = ["en", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

/** The default language, served from the root path. */
export const DEFAULT_LOCALE: Locale = "en";

/** Human-readable names shown in the language switcher (each in its own
 *  language, the usual convention for language menus). */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

/** The value used for the <html lang> attribute and hreflang tags. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  ru: "ru",
};

/** Type guard: is a string one of our supported locales. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Build a path for a given locale. The default locale keeps clean root
 * paths (/, /pricing); other locales are prefixed (/ru, /ru/pricing).
 *
 * `path` is always the canonical, unprefixed path starting with "/".
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  if (locale === DEFAULT_LOCALE) {
    return clean === "" ? "/" : clean;
  }
  return `/${locale}${clean === "" ? "" : clean}`;
}

/**
 * Build the full hreflang map for a canonical path: one entry per language
 * plus x-default.
 *
 * x-default tells Google which version to show a user whose language we do
 * not cover. Without it Google picks on its own, and on a site where the
 * same page exists twice it may decide the two are duplicates and index
 * only one. The default locale is the fallback, so x-default points at the
 * unprefixed path.
 *
 * Every page builds its alternates through this so the set can never drift
 * apart page by page.
 */
export function altLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = localizedPath(l, path);
  }
  languages["x-default"] = localizedPath(DEFAULT_LOCALE, path);
  return languages;
}
