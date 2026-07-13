import { LocaleLink } from "@/components/LocaleLink";
import type { Locale } from "@/i18n/config";

export type StatusKind = "success" | "info" | "warn" | "error";

/**
 * Result / status page used for Thank You, Payment Success, Payment
 * Cancelled, Profile Submitted, Profile Suspended and Profile Not Available.
 * Standalone layout — no breadcrumbs — because these pages are dead ends of
 * a flow and the user's next action is a fresh jump elsewhere.
 */
export function StatusPage({
  lang,
  kind,
  title,
  description,
  primary,
  secondary,
}: {
  lang: Locale;
  kind: StatusKind;
  title: string;
  description: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  const tone = TONES[kind];

  return (
    <div className="container-page section">
      <div className="mx-auto max-w-lg text-center">
        <div
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl"
          style={{ background: tone.bg, color: tone.fg }}
          aria-hidden
        >
          <Glyph kind={kind} />
        </div>
        <h1 className="mt-6">{title}</h1>
        <p className="lead mt-3">{description}</p>

        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          {primary && (
            <LocaleLink lang={lang} href={primary.href} className="btn btn-ink">
              {primary.label}
            </LocaleLink>
          )}
          {secondary && (
            <LocaleLink lang={lang} href={secondary.href} className="btn btn-quiet">
              {secondary.label}
            </LocaleLink>
          )}
        </div>
      </div>
    </div>
  );
}

const TONES: Record<StatusKind, { bg: string; fg: string }> = {
  success: { bg: "#dff1e9", fg: "#157a58" },
  info: { bg: "#e3ecfb", fg: "#3e6fcc" },
  warn: { bg: "#fbeedb", fg: "#a9691a" },
  error: { bg: "#fbe4e9", fg: "#a83752" },
};

function Glyph({ kind }: { kind: StatusKind }) {
  if (kind === "success") {
    return (
      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "warn") {
    return (
      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l10 18H2L12 3Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M12 10v4M12 17.5v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "error") {
    return (
      <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
      <path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
