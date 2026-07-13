import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { ru } from "@/i18n/dictionaries/ru";

/**
 * Central dictionary registry. Dictionaries are plain data, imported
 * statically so they are available in server components without async
 * loading and are tree-shaken into the build.
 *
 * To add a language: add its file under dictionaries/, import it here,
 * and add it to this map (plus LOCALES in config.ts).
 */
const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
};

/** Get the full dictionary for a locale. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from "@/i18n/types";
export { LOCALES, DEFAULT_LOCALE, isLocale, localizedPath } from "@/i18n/config";
export type { Locale } from "@/i18n/config";
