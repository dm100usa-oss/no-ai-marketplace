"use client";

import { useEffect, useRef } from "react";

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
 * The counters write their text straight into the DOM node instead of
 * going through state: a state update per animation frame rebuilds the
 * component sixty times a second, which is what makes a count stutter.
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
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null || target === null || done.current) return;

    const format = (n: number) =>
      decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString(locale);

    // Hold the animation until the band is on screen: on a phone the strip
    // is well below the fold and a counter that finished during the scroll
    // is a counter nobody saw.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
          el.textContent = format(target);
          return;
        }

        // The text is written straight into the node rather than held in
        // state. Sixty state updates a second would rebuild the component
        // on every frame, and that is what makes the count stutter — the
        // work is in React, not in the arithmetic. Writing to the node
        // touches one property and leaves the rest of the page alone.
        let start: number | null = null;
        const step = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / DURATION, 1);
          el.textContent = format(target * easeOut(p));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals, locale]);

  // Server and first paint show the final figure: the animation overwrites
  // it a moment later. This way the number is correct for anyone with the
  // animation off, and correct in the HTML for anything reading the page.
  const initial =
    target === null
      ? ""
      : decimals > 0
        ? target.toFixed(decimals)
        : Math.round(target).toLocaleString(locale);

  return { ref, initial };
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
    <div style={{ background: "#c4d3f4", padding: "0.8rem 0 0.4rem" }}>
      <div
        style={{
          background: "rgba(219,233,255,0.61)",
          backdropFilter: "blur(2px)",
        }}
        className="px-5 py-2.5"
      >
        <div className="container-page flex items-center justify-between gap-4">
          {visits !== null && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span
                ref={v.ref}
                className="text-[1.45rem] font-bold leading-none sm:text-[1.7rem]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {v.initial}
              </span>
              <span
                className="whitespace-nowrap text-[0.78rem] leading-none sm:text-[1.15rem]"
                style={{ color: "var(--color-ink)" }}
              >
                {visitsLabel}
              </span>
            </div>
          )}

          {rating !== null && (
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* One flat colour, no gradient and no stroke. At this size a
                  three-stop gradient with a darker outline muddies into a
                  smudge; a single clean fill reads as a star. */}
              <svg
                width={52}
                height={52}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[1.8rem] w-[1.8rem] shrink-0 sm:h-[2.75rem] sm:w-[2.75rem]"
              >
                <path
                  d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
                  fill="#e8a33d"
                />
              </svg>
              <span
                ref={r.ref}
                className="text-[1.45rem] font-normal leading-none sm:text-[1.7rem]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-ink)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.initial}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
