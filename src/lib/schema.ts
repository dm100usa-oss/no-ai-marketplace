import { site, owner, pageUpdated } from "@/lib/config";
import { localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/**
 * Structured data shared by the explanatory pages.
 *
 * These pages are the reason an answer engine would name this catalog at
 * all: they are where the method is written down. Left as plain prose they
 * are just text on a page. Declared as dated documents belonging to a named
 * publisher they become something an engine can attribute and quote.
 *
 * Everything here is built from the same dictionary text the page renders,
 * so the markup cannot drift from what a reader sees. Markup that says
 * something the page does not is worse than no markup: it is caught, and
 * then the whole file is discounted.
 */

/** The review date for a page, or undefined if none is recorded. */
export function updatedFor(route: string): string | undefined {
  return pageUpdated[route];
}

/**
 * An explanatory page as a dated document.
 *
 * TechArticle rather than Article: this is documentation of a procedure,
 * not journalism, and the distinction is one an engine acts on when
 * deciding what kind of question the page answers.
 */
export function documentSchema({
  route,
  title,
  description,
  locale,
}: {
  route: string;
  title: string;
  description: string;
  locale: Locale;
}) {
  const url = `${site.url}${localizedPath(locale, route)}`;
  const updated = updatedFor(route);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    name: title,
    description,
    url,
    inLanguage: locale,
    // Both point at the organisation node declared once in the layout,
    // rather than repeating its details on every page. One entity, many
    // references: that is how an engine builds a picture of a publisher
    // instead of seeing a different one on each page.
    publisher: { "@id": `${site.url}#organization` },
    author: { "@id": `${site.url}#organization` },
    ...(updated ? { dateModified: updated, datePublished: updated } : {}),
    isPartOf: { "@id": `${site.url}#organization` },
    about: owner.knowsAbout,
  };
}

/** A set of questions and answers as declared structured data. */
export function faqSchema({
  route,
  title,
  locale,
  items,
}: {
  route: string;
  title: string;
  locale: Locale;
  items: { q: string; a: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: title,
    url: `${site.url}${localizedPath(locale, route)}`,
    inLanguage: locale,
    publisher: { "@id": `${site.url}#organization` },
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
