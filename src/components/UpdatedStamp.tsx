import { updatedFor } from "@/lib/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * "Reviewed on <date>" under the heading of an explanatory page.
 *
 * The date is shown as well as declared, and on purpose. A reader deciding
 * whether to trust a standard wants to know when it was last looked at,
 * and so does anything reading the page: given two sources saying the same
 * thing, the one that states when it last checked itself wins.
 *
 * Renders nothing when no date is recorded for the route, so a page
 * without one simply looks as it did before.
 */
export function UpdatedStamp({
  route,
  lang,
  dict,
  className = "",
}: {
  route: string;
  lang: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const updated = updatedFor(route);
  if (!updated) return null;

  const formatted = new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(updated));

  return (
    <p
      className={`text-[0.85rem] ${className}`}
      style={{ color: "var(--color-muted-soft)" }}
    >
      {dict.common.updatedLabel}: <time dateTime={updated}>{formatted}</time>
    </p>
  );
}
