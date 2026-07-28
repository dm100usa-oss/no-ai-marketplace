import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";
import { ArrowRight } from "@/components/icons";
import { getAllProfilesL } from "@/lib/localized-data";
import { site } from "@/lib/config";
import { localizedPath } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary, ParticipantPage } from "@/i18n/types";
import type { ProfileType } from "@/lib/types";

/**
 * The shared body of the three participant pages.
 *
 * Creators, teams and companies were, until now, one catalog with a
 * filter on top. A filter is a fine tool for someone already browsing and
 * a poor answer to a question: "find a team for a project" and "find a
 * studio for a large job" are different questions with different reasons
 * behind them, and neither is answered by a listing that happens to have
 * a checkbox. Each kind now has its own address, its own title and its
 * own text explaining when this is the right choice and what to check —
 * which is the part a person actually needs and the part an answer engine
 * can quote.
 *
 * The three pages are the same shape on purpose. The difference between
 * them lives in the words, not in the furniture, so a reader comparing
 * them compares the arguments rather than the layout.
 */
export function ParticipantPageView({
  lang,
  dict,
  page,
  type,
  route,
  browseHref,
}: {
  lang: Locale;
  dict: Dictionary;
  page: ParticipantPage;
  type: ProfileType;
  route: string;
  /** Where the "browse" button goes: the catalog, pre-filtered. */
  browseHref: string;
}) {
  const profiles = getAllProfilesL(lang).filter((p) => p.profileType === type);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    inLanguage: lang,
    name: page.title,
    description: page.metaDescription,
    url: `${site.url}${localizedPath(lang, route)}`,
    isPartOf: { "@type": "WebSite", name: dict.site.name, url: site.url },
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        lang={lang}
        items={[{ label: dict.common.home, href: "/" }, { label: page.title }]}
      />

      <h1>{page.title}</h1>
      <p className="lead mt-3 max-w-3xl">{page.intro}</p>

      <div className="mt-8 max-w-3xl space-y-4">
        {page.body.map((para) => (
          <p key={para} className="text-[1.05rem] leading-relaxed" style={{ color: "var(--color-ink)" }}>
            {para}
          </p>
        ))}
      </div>

      {/* When to choose this kind. Four short lines, because the decision
          is usually made on one of them and a reader scanning for their
          own case should find it without reading the paragraphs above. */}
      <div className="mt-10 max-w-3xl">
        <h2 className="!text-[1.35rem]">{page.whenTitle}</h2>
        <ul className="mt-4 flex flex-col gap-4 text-[1.05rem]">
          {page.when.map((line) => (
            <li key={line} className="flex items-start gap-3" style={{ color: "var(--color-ink)" }}>
              <span
                aria-hidden="true"
                className="mt-[0.45rem] shrink-0 rounded-full"
                style={{
                  width: "0.7rem",
                  height: "0.7rem",
                  background: "radial-gradient(circle at 30% 30%, #6f92cf, #325ba3 70%, #274a86)",
                  boxShadow: "0 1px 2px rgba(30,50,90,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
                }}
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <ProfileGrid
          lang={lang}
          dict={dict}
          profiles={profiles}
          emptyTitle={page.emptyTitle}
          emptyMessage={page.emptyMessage}
        />
      </div>

      <div
        className="mt-12 max-w-3xl rounded-2xl border p-6 md:p-8"
        style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
      >
        <h2 className="!text-[1.25rem]">{page.ctaTitle}</h2>
        <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
          {page.ctaText}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <LocaleLink lang={lang} href={browseHref} className="btn btn-ink">
            {page.ctaBrowse}
            <ArrowRight size={16} />
          </LocaleLink>
          <LocaleLink lang={lang} href="/join" className="btn btn-quiet">
            {page.ctaJoin}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
