import { LocaleLink } from "./LocaleLink";
import { site } from "@/lib/config";
import { localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export interface Crumb {
  label: string;
  href?: string; // canonical, unprefixed; last crumb usually has no href
}

/**
 * Breadcrumbs with BreadcrumbList JSON-LD. Visible trail plus structured
 * data so search engines and AI see the hierarchy. Hrefs are canonical
 * paths; the visible links and the JSON-LD are localized per language.
 */
export function Breadcrumbs({ lang, items }: { lang: Locale; items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${site.url}${localizedPath(lang, c.href)}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <LocaleLink lang={lang} href={c.href} className="transition-colors hover:text-[var(--color-accent)]">
                {c.label}
              </LocaleLink>
            ) : (
              <span style={{ color: "var(--color-muted)" }}>{c.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
