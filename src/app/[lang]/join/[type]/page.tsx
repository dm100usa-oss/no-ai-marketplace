import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/LocaleLink";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
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
  creator: "#ffb300",
  team: "#12a06f",
  company: "#3e6fcc",
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
        {/* The page opens with the wish and nothing else.

            The thank-you heading, the "four steps from here" line and the four
            steps themselves all stood here and all said the same thing in
            different words to someone who had already pressed a button on
            their own plan and knew what they were doing. What is left is one
            sentence of welcome and then the form. What happens after the form
            is answered by the questions further down. */}
        {wish ? (
          <p className="lead leading-snug" style={{ textAlign: "justify" }}>
            {wish}
          </p>
        ) : null}

        {/* This type's form, and only this one. */}
        <div id="form" className="mt-8 scroll-mt-32">
          <h2>{copy.title}</h2>
          {/* The plan's colour reaches the form as a frame, not as a fill:
              two pixels round the outside, the same rim the plan card has.
              Nothing inside the form moves, and no width is lost. */}
          <div className="mt-4">
            <TallyForm lang={locale} dict={dict} type={type} edge={EDGES[type]} />
          </div>
          {/* The price note sits under the form, not over it. Above, it was a
              paragraph standing between the reader and the thing they came to
              fill in; here it answers the question that arises once they have
              seen what is being asked of them. */}
          <p
            className="mt-4 text-[0.95rem]"
            style={{ color: "var(--color-muted)", textAlign: "justify" }}
          >
            {dict.joinType.afterForm}
          </p>
        </div>

        {/* Rules and standards, word for word as on /join: the same promises
            have to hold whichever door someone came through. */}
        <h2 className="mt-12">{dict.join.rulesTitle}</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)", textAlign: "justify" }}>
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

        {/* Somebody on this page has chosen what they are joining as and
            has not yet been told what it costs or what will be checked.
            Both answers live one click away and neither was linked. */}
        <RelatedLinks
          lang={locale}
          dict={dict}
          links={["/pricing", "/method", "/work-stages", "/human-made-standards"]}
        />
      </div>
    </div>
  );
}
