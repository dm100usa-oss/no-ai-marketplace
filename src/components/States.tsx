import { LocaleLink } from "./LocaleLink";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";

/** Empty state — an invitation to act, not a dead end. All strings passed in. */
export function EmptyState({
  lang,
  title,
  message,
  actionHref,
  actionLabel,
}: {
  lang: Locale;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div
        className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl"
        style={{ background: "var(--color-brand-soft)", color: "var(--color-accent)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-[1.1rem]">{title}</h3>
      <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>{message}</p>
      {actionHref && actionLabel && (
        <LocaleLink lang={lang} href={actionHref} className="btn btn-accent mt-5">{actionLabel}</LocaleLink>
      )}
    </div>
  );
}

/** Error state — explains what happened and how to fix it. Strings passed in. */
export function ErrorState({
  lang,
  title,
  message,
  retryHref,
  retryLabel,
}: {
  lang: Locale;
  title: string;
  message: string;
  retryHref?: string;
  retryLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h3 className="text-[1.1rem]">{title}</h3>
      <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
        {message}
      </p>
      {retryHref && retryLabel && (
        <LocaleLink lang={lang} href={retryHref} className="btn btn-quiet mt-5">{retryLabel}</LocaleLink>
      )}
    </div>
  );
}

/** Loading skeleton block. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "var(--color-brand-soft)" }}
    />
  );
}

/** Card-shaped loading placeholder. */
export function CardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="aspect-[4/3] !rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 !rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

/** Section heading with optional "view all" link. */
export function SectionHeading({
  lang,
  title,
  action,
  children,
}: {
  lang: Locale;
  title: string;
  action?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2>{title}</h2>
        {children && <p className="lead mt-1.5">{children}</p>}
      </div>
      {action && (
        <LocaleLink lang={lang} href={action.href} className="shrink-0 text-[0.92rem] font-semibold" style={{ color: "var(--color-accent)" }}>
          {action.label} →
        </LocaleLink>
      )}
    </div>
  );
}
