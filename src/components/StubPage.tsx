import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * Structured placeholder for pages whose full copy the owner supplies later
 * (legal, service pages). Provides a real page shell — breadcrumbs, H1,
 * intro, an "owner adds text here" note and back links — so nav is never
 * broken and pages read as work-in-progress rather than 404-adjacent.
 */
export function StubPage({
  lang,
  dict,
  title,
  intro,
  note,
  breadcrumbTrail,
}: {
  lang: Locale;
  dict: Dictionary;
  title: string;
  intro: string;
  note?: string;
  breadcrumbTrail?: { label: string; href: string }[];
}) {
  const crumbs = [
    { label: dict.common.home, href: "/" },
    ...(breadcrumbTrail ?? []),
    { label: title },
  ];

  return (
    <div className="container-page section">
      <Breadcrumbs lang={lang} items={crumbs} />

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
          <LocaleLink lang={lang} href="/" className="btn btn-quiet">
            ← {dict.common.backToHome}
          </LocaleLink>
          <LocaleLink lang={lang} href="/contact" className="btn btn-quiet">
            {dict.common.contactUs}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
