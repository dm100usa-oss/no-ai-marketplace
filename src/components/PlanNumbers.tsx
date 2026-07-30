"use client";

import { useEffect, useRef, useState } from "react";

/** One plate per plan, in that plan's own colour. Standing next to the
 *  heading they answer the first question a visitor has about the row
 *  below: how many choices am I being given. */
const PLATES = [
  { n: "1", bg: "#ffeabd", edge: "#f2d18d" },
  { n: "2", bg: "#c9e9dc", edge: "#a3d8c3" },
  { n: "3", bg: "#cfe0f8", edge: "#a8c6ee" },
];

/**
 * Three numbered plates beside "Выберите свой тариф", dealt out one after
 * another like cards.
 *
 * They start only when the heading is actually on screen. Fired on page
 * load instead, the whole thing would be over before anyone scrolled down
 * to it, and the visitor would meet three plates that had already arrived.
 *
 * The animation itself is CSS (see .plan-number in globals.css); this
 * component only decides when it runs, and only ever once. Someone who has
 * asked the system for less movement gets the plates without the dealing,
 * which is handled in CSS rather than here, so the markup is identical
 * either way.
 */
export function PlanNumbers() {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} aria-hidden className="inline-flex shrink-0 items-center gap-1.5">
      {PLATES.map((p, i) => (
        <span
          key={p.n}
          className={`plan-number${live ? " plan-number-live" : ""}`}
          style={{
            background: p.bg,
            borderColor: p.edge,
            animationDelay: `${i * 0.16}s`,
          }}
        >
          {p.n}
        </span>
      ))}
    </span>
  );
}
