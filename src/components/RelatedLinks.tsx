import { LocaleLink } from "@/components/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * A short row of links to the pages that explain the thing the reader is
 * looking at.
 *
 * Every profession page, every direction page, the catalog and the
 * verified list end at the same moment: the reader has seen who is here
 * and now wants to know what any of it means. Without a way through, each
 * of those pages is a leaf, and the documents that carry the whole idea of
 * the catalog sit with nothing pointing at them but the footer.
 *
 * Footer links do not count for this. They are identical on every page, so
 * they say nothing about what a particular page is about. A link inside
 * the body of a profession page saying "this is how we check" is what ties
 * that profession to the method, and it is that tie an answer engine reads
 * when deciding which page on the site is the authority on a subject.
 *
 * Same set, same order, same wording everywhere on purpose. Forty-five
 * pages each inventing their own phrasing would read as forty-five
 * different claims rather than one repeated one.
 */

/** Canonical paths this block knows how to label, from the footer copy so
 *  a page name is written once for the whole site. */
function labelFor(path: string, dict: Dictionary): string | undefined {
  switch (path) {
    case "/method":
      return dict.footer.method;
    case "/human-made-standards":
      return dict.footer.humanMadeStandards;
    case "/work-stages":
      return dict.footer.workStages;
    case "/verified":
      return dict.footer.verifiedProfiles;
    case "/directory":
      return dict.footer.directory;
    case "/creators":
      return dict.footer.creators;
    case "/teams":
      return dict.footer.teams;
    case "/companies":
      return dict.footer.companies;
    case "/pricing":
      return dict.footer.pricing;
    case "/join":
      return dict.footer.addYourProfile;
    default:
      return undefined;
  }
}

export function RelatedLinks({
  lang,
  dict,
  links,
  title,
  className = "mt-10",
}: {
  lang: Locale;
  dict: Dictionary;
  links: string[];
  /** Defaults to the shared "how this works" heading. */
  title?: string;
  className?: string;
}) {
  const items = links
    .map((href) => ({ href, label: labelFor(href, dict) }))
    .filter((x): x is { href: string; label: string } => Boolean(x.label));

  if (items.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
    >
      <h2 className="!text-[1.05rem]">{title ?? dict.common.relatedTitle}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((it) => (
          <LocaleLink
            key={it.href}
            lang={lang}
            href={it.href}
            className="btn btn-quiet !text-[0.92rem]"
          >
            {it.label}
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}
