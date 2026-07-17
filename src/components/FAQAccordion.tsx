import { LocaleLink } from "@/components/LocaleLink";
import type { Locale } from "@/i18n/config";

export interface FAQAccordionItem {
  q: string;
  a: string;
  links?: { label: string; href: string }[];
}

/**
 * FAQ accordion built on native <details>. Unlike the client-side FAQ
 * widget, the answer is always present in the HTML and only collapsed
 * visually, so search engines and AI engines read every answer without
 * running any JavaScript. That is the whole point of moving the
 * profession FAQ onto the category page: one page that answers the
 * question and lists the people who can do the work.
 */
export function FAQAccordion({
  items,
  lang,
}: {
  items: FAQAccordionItem[];
  lang: Locale;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((it, i) => (
        <li
          key={i}
          className="rounded-xl border bg-white"
          style={{ borderColor: "var(--color-line)" }}
        >
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
              <h3
                className="!m-0 text-[1rem] font-semibold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-ink)",
                }}
              >
                {it.q}
              </h3>
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform group-open:rotate-45"
                style={{
                  background: "var(--color-brand-soft)",
                  color: "var(--color-accent)",
                }}
                aria-hidden
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 pt-0">
              <p
                className="text-[0.95rem]"
                style={{ color: "var(--color-muted)" }}
              >
                {it.a}
              </p>
              {it.links && it.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {it.links.map((l) => (
                    <LocaleLink
                      key={l.href}
                      lang={lang}
                      href={l.href}
                      className="btn btn-quiet"
                    >
                      {l.label}
                    </LocaleLink>
                  ))}
                </div>
              )}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
