import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { TallyForm } from "@/components/TallyForm";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, altLanguages, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { ProfileType } from "@/lib/types";

/**
 * One page per participant type, reached from the plan buttons on /pricing.
 *
 * Someone arriving here has already said who they are by pressing the button
 * on their own plan. Asking "who are you" again, which is what the general
 * /join page opens with, is asking twice. So this page thanks them, shows the
 * four steps, and puts their form in front of them. No other type appears on
 * it, and there is no link back to the prices they have just come from.
 *
 * /join itself is untouched: it is still the way in from the home page, where
 * the question has not been answered yet.
 */

const TYPES = ["creator", "team", "company"] as const;

/** The rim of each plan's plate, reused as the frame around the form. */
const EDGES: Record<ProfileType, string> = {
  creator: "#f2d18d",
  team: "#a3d8c3",
  company: "#a8c6ee",
};


function isType(value: string): value is ProfileType {
  return (TYPES as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => TYPES.map((type) => ({ lang, type })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}): Promise<Metadata> {
  const { lang, type } = await params;
  if (!isType(type)) return {};
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const copy = dict.joinType[type];
  const path = `/join/${type}`;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: localizedPath(locale, path), languages: altLanguages(path) },
  };
}

export default async function JoinTypePage({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang, type } = await params;
  if (!isType(type)) notFound();

  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const copy = dict.joinType[type];

  // The welcome line from /join, minus its first sentence: that one thanks
  // the reader, and the heading above has already done it.
  const wish = dict.join.intro.split(/(?<=\.)\s+/).slice(1).join(" ");

  const faqItems = dict.join.faq;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs
        lang={locale}
        items={[
          { label: dict.common.home, href: "/" },
          { label: dict.join.title, href: "/join" },
          { label: copy.title },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <p
          className="text-[1.5rem] font-bold md:text-[1.8rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {dict.joinType.thanksLead}{" "}
          {/* The platform name in the brand face, as in the logo, the footer
              and the pricing page. In the body face it reads as an ordinary
              phrase rather than as the name of the place. */}
          <span style={{ fontFamily: "var(--font-brand)" }}>No AI Directory</span>
        </p>
        {wish ? <p className="lead mt-3">{wish}</p> : null}
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>{copy.thanksText}</p>

        {/* The four steps, titles only, and no heading over them: the line
            above has just said there are four, so "Как это работает" would be
            announcing what the reader is already looking at.

            Small numbers, ordinary weight. At heading size and bold this read
            as four demands; the page is meant to encourage someone who has
            already decided, not to brief them. The third step keeps its full
            wording, otherwise "wait for the letter" leaves them wondering
            which letter. */}
        <div className="mt-8 flex flex-col gap-2.5">
          {dict.join.steps.map((s, i) => (
            <div key={s.t} className="flex items-center gap-3">
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.72rem] font-bold text-white"
                style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
              >
                {i + 1}
              </span>
              <p className="text-[1.15rem] leading-snug" style={{ color: "var(--color-ink)" }}>
                {s.t}
              </p>
            </div>
          ))}
        </div>

        {/* This type's form, and only this one. */}
        <div id="form" className="mt-10 scroll-mt-32">
          <h2>{copy.title}</h2>
          <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
            {dict.join.formIntro}
          </p>
          {/* The plan's colour reaches the form as a frame, not as a fill:
              two pixels round the outside, the same rim the plan card has.
              Nothing inside the form moves, and no width is lost. */}
          <div className="mt-5">
            <TallyForm lang={locale} dict={dict} type={type} edge={EDGES[type]} />
          </div>
        </div>

        {/* Rules and standards, word for word as on /join: the same promises
            have to hold whichever door someone came through. */}
        <h2 className="mt-12">{dict.join.rulesTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          {dict.join.rulesText1}
          <LocaleLink
            lang={locale}
            href="/method"
            className="font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            {dict.join.rulesLink1}
          </LocaleLink>
          {dict.join.rulesText2}
          <LocaleLink
            lang={locale}
            href="/listing-policy"
            className="font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            {dict.join.rulesLink2}
          </LocaleLink>
          {dict.join.rulesText3}
        </p>

        <h2 className="mt-12">{dict.join.faqTitle}</h2>
        <div className="mt-4">
          <FAQ items={faqItems} />
        </div>
      </div>
    </div>
  );
}
