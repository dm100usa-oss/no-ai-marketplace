"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Band under the work strip: visits for the week on the left, rating on
 * the right, both counting up once the band is actually on screen.
 *
 * Nothing is invented here. Both figures come in as props from the page,
 * which reads them from `stats` in lib/config.ts. While a figure is null
 * its half of the band is not rendered at all, so the site never shows a
 * number nobody earned. On the day real analytics and real reviews exist,
 * fill them in there and the band lights up on its own.
 *
 * The outer strip is the colour sampled out of the right-hand side of
 * hero.webp, so the band and the banner above it are the same blue. The
 * inner plate is the banner's own translucent panel, running the full
 * width and sitting shorter than the strip, which leaves a line of the
 * darker blue above and below and keeps the plate readable as a layer.
 */

const DURATION = 1600;

/** Ease-out cubic: fast at the start, gliding into the final number. */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number | null, decimals: number, locale: string) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null || target === null || done.current) return;

    // Hold the animation until the band is on screen: on a phone the strip
    // is well below the fold and a counter that finished during the scroll
    // is a counter nobody saw.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reduced) {
          setValue(target);
          return;
        }

        let start: number | null = null;
        const step = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / DURATION, 1);
          setValue(target * easeOut(p));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const text =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString(locale);

  return { ref, text };
}

export function StatsBand({
  locale,
  visits,
  visitsLabel,
  rating,
}: {
  locale: string;
  visits: number | null;
  visitsLabel: string;
  rating: number | null;
}) {
  const v = useCountUp(visits, 0, locale === "ru" ? "ru-RU" : "en-US");
  const r = useCountUp(rating, 1, locale === "ru" ? "ru-RU" : "en-US");

  // Nothing real to show yet: no band at all, rather than an empty strip.
  if (visits === null && rating === null) return null;

  return (
    <div style={{ background: "#c4d3f4", padding: "1.1rem 0" }}>
      <div
        style={{
          background: "rgba(219,233,255,0.61)",
          backdropFilter: "blur(2px)",
        }}
        className="px-5 py-3.5"
      >
        <div className="container-page flex items-center justify-between gap-4">
          {visits !== null && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span
                ref={v.ref}
                className="text-[1.7rem] font-bold leading-none sm:text-[2rem]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent)",
                }}
              >
                {v.text}
              </span>
              <span
                className="whitespace-nowrap text-[0.85rem] leading-none sm:text-[1.35rem]"
                style={{ color: "var(--color-ink)" }}
              >
                {visitsLabel}
              </span>
            </div>
          )}

          {rating !== null && (
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Lit from the top left and falling away to a deeper gold at
                  the bottom, so the star has body without a drawn outline.
                  The stroke is the same gradient a shade down: it firms up
                  the points without ringing them in pencil. */}
              <svg
                width={52}
                height={52}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[2.1rem] w-[2.1rem] shrink-0 sm:h-[3.25rem] sm:w-[3.25rem]"
              >
                <defs>
                  <linearGradient id="starFill" x1="0" y1="0" x2="0.35" y2="1">
                    <stop offset="0" stopColor="#f6c66a" />
                    <stop offset="0.55" stopColor="#e8a33d" />
                    <stop offset="1" stopColor="#c9832a" />
                  </linearGradient>
                  <linearGradient id="starEdge" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0" stopColor="#e8b463" />
                    <stop offset="1" stopColor="#b9762a" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
                  fill="url(#starFill)"
                  stroke="url(#starEdge)"
                  strokeWidth={0.5}
                  strokeLinejoin="round"
                />
              </svg>
              <span
                ref={r.ref}
                className="text-[1.7rem] font-normal leading-none sm:text-[2rem]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-ink)",
                }}
              >
                {r.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
