import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRight } from "@/components/icons";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

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
}: {
  lang: Locale;
  dict: Dictionary;
  data: ContentPageData;
}) {
  return (
    <div className="container-page section">
      <Breadcrumbs
        lang={lang}
        items={[{ label: dict.common.home, href: "/" }, { label: data.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{data.title}</h1>
        <p className="lead mt-4">{data.intro}</p>

        <div className="mt-10 space-y-10">
          {data.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="!text-[1.35rem]">{s.heading}</h2>
              {s.paragraphs.map((para, i) => (
                <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
                  {para}
                </p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-[0.98rem]">
                      <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
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
