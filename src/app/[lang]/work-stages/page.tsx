import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { ArrowRight } from "@/components/icons";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

/**
 * Work stages — the proof page.
 *
 * It has its own layout rather than the shared ContentPage because it does
 * two things that page cannot: it links out of the running text, and it
 * carries a question block at the end. Both are deliberate. The links keep
 * a reader who arrives here from a search on the site instead of sending
 * them back out, and the questions are what an answer engine quotes.
 *
 * Two pieces of structured data are emitted: FAQPage for the questions and
 * HowTo for the instruction itself, built from the same dictionary text so
 * the markup can never drift from what is on the screen.
 */

const ROUTE = "/work-stages";

/** Where a [[token]] in the dictionary text points, and what it reads as.
 *  Kept here so a moved route is one edit, not a search through prose. */
function linkFor(dict: Dictionary): Record<string, { href: string; label: string }> {
  return {
    method: { href: "/method", label: dict.footer.method },
    verified: { href: "/verified", label: dict.footer.verifiedProfiles },
    join: { href: "/join", label: dict.footer.addYourProfile },
    contact: { href: "/contact", label: dict.footer.contact },
    directory: { href: "/directory", label: dict.footer.directory },
  };
}

const TOKEN = /\[\[(\w+)\]\]/g;

/** Dictionary line to React, with [[tokens]] turned into links. */
function withLinks(text: string, lang: Locale, dict: Dictionary): ReactNode[] {
  const links = linkFor(dict);
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const link = links[m[1]];
    if (link) {
      out.push(
        <LocaleLink
          key={`${m[1]}-${m.index}`}
          lang={lang}
          href={link.href}
          className="font-semibold"
          style={{ color: "var(--color-accent)" }}
        >
          {link.label}
        </LocaleLink>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The same line as plain text, for the structured data. */
function plain(text: string, dict: Dictionary): string {
  const links = linkFor(dict);
  return text.replace(TOKEN, (_, key: string) => links[key]?.label ?? "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.workStages.metaTitle,
    description: dict.workStages.metaDescription,
    alternates: { canonical: localizedPath(locale, ROUTE), languages: altLanguages(ROUTE) },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const copy = dict.workStages;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: copy.faq.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plain(it.a, dict) },
    })),
  };

  // The instruction, marked up as one. Every section that tells the reader
  // to do something becomes a step; the ones that explain why do not.
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    inLanguage: locale,
    name: copy.title,
    description: copy.metaDescription,
    step: copy.sections.slice(1, 8).map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.heading,
      text: plain(s.paragraphs.join(" "), dict),
    })),
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <Breadcrumbs
        lang={locale}
        items={[{ label: dict.common.home, href: "/" }, { label: copy.title }]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>{copy.title}</h1>
        <p
          className="mt-2 text-[1.05rem] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
        >
          {copy.subtitle}
        </p>
        <p className="lead mt-4">{copy.intro}</p>

        <div className="mt-10 space-y-10">
          {copy.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="section-title !text-[1.35rem]">{s.heading}</h2>
              {s.paragraphs.map((para, i) => (
                <p key={i} className="mt-3" style={{ color: "var(--color-muted)" }}>
                  {withLinks(para, locale, dict)}
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

        <h2 className="mt-12">{copy.faqTitle}</h2>
        <div className="mt-4">
          <FAQ
            items={copy.faq.map((it) => ({
              q: it.q,
              a: <>{withLinks(it.a, locale, dict)}</>,
            }))}
          />
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">{copy.ctaTitle}</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            {copy.ctaText}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocaleLink lang={locale} href="/directory" className="btn btn-ink">
              {copy.ctaFind}
              <ArrowRight size={16} />
            </LocaleLink>
            <LocaleLink lang={locale} href="/join" className="btn btn-quiet">
              {copy.ctaJoin}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
