import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale, localizedPath, altLanguages } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { ReviewForm } from "@/components/ReviewForm";
import { getApprovedReviews, getAverageRating } from "@/lib/redis";

/**
 * Reviews: what people said, and the form to say something.
 *
 * Read fresh on every request — a review approved a minute ago should be
 * on the page a minute later, not after the next deploy.
 *
 * With no approved reviews there is no rating block and no empty list:
 * just the form. A site with nothing to show says nothing.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.reviews.title,
    description: dict.reviews.subtitle,
    alternates: {
      canonical: localizedPath(lang, "/reviews"),
      languages: altLanguages("/reviews"),
    },
  };
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
            fill={i <= n ? "#e8a33d" : "transparent"}
            stroke={i <= n ? "#c9832a" : "var(--color-line)"}
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const r = dict.reviews;

  const [reviews, { average, count }] = await Promise.all([
    getApprovedReviews(),
    getAverageRating(),
  ]);

  const dateFmt = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <h1
          className="text-[1.7rem] font-bold sm:text-[2.1rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {r.title}
        </h1>
        <p className="mt-2 text-[1rem]" style={{ color: "var(--color-muted)" }}>
          {r.subtitle}
        </p>

        {average !== null && (
          <div
            className="mt-6 flex items-center gap-3 rounded-2xl px-5 py-4"
            style={{ background: "var(--color-brand-soft)" }}
          >
            <span
              className="text-[2rem] font-bold leading-none"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {average.toFixed(1)}
            </span>
            <span className="flex flex-col gap-1">
              <Stars n={Math.round(average)} />
              <span className="text-[0.85rem]" style={{ color: "var(--color-muted)" }}>
                {r.basedOn.replace("{n}", String(count))}
              </span>
            </span>
          </div>
        )}

        {reviews.length > 0 && (
          <ul className="mt-8 space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--color-line)", background: "#fff" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
                    {review.name}
                  </span>
                  <Stars n={review.rating} />
                </div>
                <p
                  className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed"
                  style={{ color: "var(--color-muted)" }}
                >
                  {review.text}
                </p>
                <p className="mt-3 text-[0.8rem]" style={{ color: "var(--color-muted-soft)" }}>
                  {dateFmt.format(new Date(review.createdAt))}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <h2
            className="mb-4 text-[1.3rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {r.formTitle}
          </h2>
          <ReviewForm dict={dict} lang={locale} />
        </div>
      </div>
    </div>
  );
}
