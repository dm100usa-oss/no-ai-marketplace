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
