import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UpdatedStamp } from "@/components/UpdatedStamp";
import { ArrowRight } from "@/components/icons";
import { documentSchema } from "@/lib/schema";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * [[token]] in a dictionary line becomes an internal link.
 *
 * Written as a token rather than as a route so a moved page is one edit
 * here instead of a search through prose, and so the dictionary stays
 * plain text a non-programmer can read and change.
 */
const TOKEN = /\[\[(\w+)\]\]/g;

function linkTargets(dict: Dictionary): Record<string, { href: string; label: string }> {
  return {
    standards: { href: "/human-made-standards", label: dict.footer.humanMadeStandards },
    workStages: { href: "/work-stages", label: dict.footer.workStages },
    method: { href: "/method", label: dict.footer.method },
    verified: { href: "/verified", label: dict.footer.verifiedProfiles },
    directory: { href: "/directory", label: dict.footer.directory },
  };
}

function withLinks(text: string, lang: Locale, dict: Dictionary): ReactNode[] {
  const targets = linkTargets(dict);
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const target = targets[m[1]];
    if (target) {
      out.push(
        <LocaleLink
          key={`${m[1]}-${m.index}`}
          lang={lang}
          href={target.href}
          className="font-semibold"
          style={{ color: "var(--color-accent)" }}
        >
          {target.label}
        </LocaleLink>,
      );
    } else {
      out.push(m[0]);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

interface Section {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface ContentPageData {
  title: string;
  intro: string;
  sections: Section[];
  ctaTitle: string;
  ctaText: string;
  ctaFind: string;
  ctaJoin: string;
}

/**
 * Shared layout for the authority/content pages (Our method, Why us).
 * Keeps both pages visually identical and lets the dictionary drive all
 * text, so each reads as one strong page and every section builds topical
 * authority before the closing call to both audiences.
 */
export function ContentPage({
  lang,
  dict,
  data,
  route,
  metaDescription,
}: {
  lang: Locale;
  dict: Dictionary;
  data: ContentPageData;
  /** Canonical path. Given one, the page also declares itself as a dated
   *  document and shows the date. Omitted, nothing changes. */
  route?: string;
  metaDescription?: string;
}) {
  const jsonLd = route
    ? documentSchema({
        route,
        title: data.title,
        description: metaDescription ?? data.intro,
        locale: lang,
      })
    : null;

  return (
    <div className="container-page section">
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Breadcrumbs
        lang={lang}
        items={[{ label: dict.common.home, href: "/" }, { label: data.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{data.title}</h1>
        {route && <UpdatedStamp route={route} lang={lang} dict={dict} className="mt-3" />}
        <p className="lead mt-4">{data.intro}</p>

        <div className="mt-10 space-y-10">
          {data.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="section-title !text-[1.35rem]">{s.heading}</h2>
              {s.paragraphs.map((para, i) => (
                <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
                  {withLinks(para, lang, dict)}
                </p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[0.98rem]">
                      <span aria-hidden className="bullet-ball" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{data.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {data.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={lang} href="/directory" className="btn btn-ink">
              {data.ctaFind}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={lang} href="/join" className="btn btn-quiet">
              {data.ctaJoin}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
