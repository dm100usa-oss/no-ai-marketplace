import { LocaleLink } from "./LocaleLink";
import type { Locale } from "@/i18n/config";

/** Wordmark logo. "No AI" carries the accent, "Directory" quieter. */
export function Logo({
  lang,
  ariaLabel,
  className = "",
}: {
  lang: Locale;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <LocaleLink
      lang={lang}
      href="/"
      aria-label={ariaLabel}
      className={`inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span className="inline-flex shrink-0 items-center gap-1.5">
        <span
          aria-hidden
          className="inline-flex h-6 items-center justify-center rounded-md px-1.5 text-[13px] font-extrabold text-white"
          style={{ background: "var(--color-ink)" }}
        >
          No AI
        </span>
        <span className="text-[1.15rem] font-extrabold leading-none" style={{ color: "var(--color-ink)" }}>
          Directory
        </span>
      </span>
    </LocaleLink>
  );
}
