"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Wraps a button icon and pulses it every five seconds.
 *
 * The animation itself is CSS (see .btn-pulse / icon-pulse in globals.css).
 * This component decides when it runs: the class goes on only while the
 * icon is actually on screen. A button below the fold has no business
 * animating — nobody sees it and the phone pays for it anyway.
 *
 * Unlike the visit beacon this keeps watching after the first sighting:
 * scroll away and the pulse stops, scroll back and it starts again.
 *
 * Sitting out the animation entirely is handled in CSS via
 * prefers-reduced-motion, not here — that way the icon still renders
 * identically for someone who has asked for less movement.
 *
 * offbeat shifts the cycle so two icons on one screen do not pulse in
 * step. Set it on the second of a pair.
 */
export function PulseIcon({
  children,
  offbeat = false,
}: {
  children: ReactNode;
  offbeat?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    const io = new IntersectionObserver(
      (entries) => setLive(entries[0].isIntersecting),
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`btn-pulse${live ? " btn-pulse-live" : ""}${offbeat ? " btn-pulse-offbeat" : ""}`}
      aria-hidden
    >
      {children}
    </span>
  );
}
