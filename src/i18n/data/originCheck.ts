import type { Locale } from "@/i18n/config";
import type { OriginCheckCopy, OriginCheckProfession } from "./originCheck.types";
import { originCheckRu } from "./originCheck.ru";
import { originCheckEn } from "./originCheck.en";

export type { OriginCheckCopy, OriginCheckProfession } from "./originCheck.types";

export function getOriginCheck(locale: Locale): OriginCheckCopy {
  return locale === "ru" ? originCheckRu : originCheckEn;
}

export function getOriginCheckProfession(
  locale: Locale,
  slug: string,
): OriginCheckProfession | undefined {
  return getOriginCheck(locale).professions[slug];
}

/**
 * Slugs that have a written guide, in a fixed order.
 *
 * Taken from the English copy so both languages always offer the same set
 * of pages: a trade that exists in one language and not the other would
 * leave a dead hreflang pair, which search engines read as a broken pair
 * rather than as a missing translation.
 */
export const ORIGIN_CHECK_SLUGS = Object.keys(originCheckEn.professions);
