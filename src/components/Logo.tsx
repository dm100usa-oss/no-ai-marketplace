import Link from "next/link";

/** Wordmark logo. "No AI" carries the accent, "Marketplace" quieter. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="No AI Marketplace — home"
      className={`inline-flex items-baseline gap-1.5 ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-extrabold text-white"
          style={{ background: "var(--color-ink)" }}
        >
          No
        </span>
        <span className="text-[1.15rem] font-extrabold leading-none" style={{ color: "var(--color-ink)" }}>
          AI Marketplace
        </span>
      </span>
    </Link>
  );
}
