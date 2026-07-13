import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/**
 * Structured placeholder for pages whose full copy the owner supplies later
 * (legal, service pages). Provides a real page shell — breadcrumbs, H1,
 * intro, an "owner adds text here" note and a back-to-home link — so nav is
 * never broken and pages read as work-in-progress rather than 404-adjacent.
 */
export function StubPage({
  title,
  intro,
  note,
  breadcrumbTrail,
}: {
  title: string;
  intro: string;
  note?: string;
  /** Crumbs between Home and the final label. Empty by default. */
  breadcrumbTrail?: { label: string; href: string }[];
}) {
  const crumbs = [
    { label: "Home", href: "/" },
    ...(breadcrumbTrail ?? []),
    { label: title },
  ];

  return (
    <div className="container-page section">
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto max-w-3xl">
        <h1>{title}</h1>
        <p className="lead mt-4">{intro}</p>

        {note && (
          <div
            className="mt-6 rounded-xl border p-4 text-[0.9rem]"
            style={{
              borderColor: "var(--color-line)",
              background: "var(--color-brand-soft)",
              color: "var(--color-muted)",
            }}
          >
            {note}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/" className="btn btn-quiet">
            ← Back to home
          </Link>
          <Link href="/contact" className="btn btn-quiet">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
