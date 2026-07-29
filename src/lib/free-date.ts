import { site } from "@/lib/config";
import type { Locale } from "@/i18n/config";

/**
 * The end of the free period, written out for a human.
 *
 * WHY THIS EXISTS AS ITS OWN FILE
 *
 * The date in config is a plain "2026-12-31". Handed to new Date() it is
 * read as midnight UTC, and every timezone behind London then prints the
 * day before: Miami saw "30 декабря 2026" for a date set to the 31st. A
 * promise about money must not lose a day to the reader's clock, so the
 * date is formatted in UTC, where it was written.
 *
 * Two pages show this date — pricing and join — and they must never
 * disagree, which is the other reason it lives in one place.
 */
export function freeUntilLabel(locale: Locale): string {
  return new Date(site.freeUntil).toLocaleDateString(
    locale === "ru" ? "ru-RU" : "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
}
