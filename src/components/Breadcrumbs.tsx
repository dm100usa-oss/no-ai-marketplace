import Link from "next/link";
import { site } from "@/lib/config";

export interface Crumb {
  label: string;
  href?: string; // last crumb usually has no href
}

/**
 * Breadcrumbs (TZ 5.3) with BreadcrumbList JSON-LD. Visible trail plus
 * structured data so search engines and AI see the hierarchy.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${site.url}${c.href}` } : {}),
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
              <Link href={c.href} className="transition-colors hover:text-[var(--color-accent)]">
                {c.label}
              </Link>
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
