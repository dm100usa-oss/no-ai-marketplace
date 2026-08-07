"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * The new-works strip, laid out in columns.
 *
 * Every work keeps its own shape: a wide piece makes a short card, a book
 * cover a tall one. Nothing is cropped and nothing floats in an empty
 * field, which is the whole point — the strip exists to show work, and a
 * work with its edges cut is not the work.
 *
 * The browser's own column layout was tried first and gives the wrong
 * order: it counts the cards, divides by the number of columns and fills
 * each one straight through, so with six cards the first two both land in
 * the first column. What anybody looking at it expects is the opposite —
 * one card per column across, then the next card into whichever column is
 * currently shortest. Browsers have only just started doing that on their
 * own, and not everywhere yet, so it is worked out here.
 *
 * Nothing about this needs anything stored, prepared or pressed. Heights
 * come from the pictures themselves once they load; until then the cards
 * go round the columns one by one, which is already close to the final
 * arrangement. If a picture never loads, its card keeps its place and the
 * strip stays intact.
 */

export interface MasonryItem {
  key: string;
  /** The picture whose proportions decide the card's height. Absent on
   *  the invitation cards, which are a fixed shape. */
  src?: string;
  /** How many lines of text sit under the picture, so a card with a long
   *  caption is not treated as the same height as a bare one. */
  lines?: number;
  node: ReactNode;
}

/** Card height relative to its width, as a rough number. The invitation
 *  cards are 4:3, so they start at 0.75. */
const DEFAULT_RATIO = 0.75;
/** Roughly what one line of caption adds, relative to card width. Only
 *  needs to be near enough to keep two long columns from drifting. */
const LINE = 0.07;

function columnsFor(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

export function WorksMasonry({ items }: { items: MasonryItem[] }) {
  // Three on the server and on the first paint, so the markup a visitor
  // receives already looks right before any measuring happens.
  const [columns, setColumns] = useState(3);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    const read = () => setColumns(columnsFor(window.innerWidth));
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    let alive = true;
    for (const item of items) {
      if (!item.src) continue;
      const img = new Image();
      img.onload = () => {
        if (!alive || !img.naturalWidth) return;
        setRatios((prev) =>
          prev[item.key]
            ? prev
            : { ...prev, [item.key]: img.naturalHeight / img.naturalWidth },
        );
      };
      img.src = item.src;
    }
    return () => {
      alive = false;
    };
  }, [items]);

  // Into the shortest column, one card at a time. With no heights known
  // yet every card counts the same, which comes out as one per column
  // across — the order anybody would draw on paper.
  const buckets: MasonryItem[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);

  for (const item of items) {
    let shortest = 0;
    for (let i = 1; i < columns; i++) {
      if (heights[i] < heights[shortest] - 0.0001) shortest = i;
    }
    buckets[shortest].push(item);
    heights[shortest] +=
      (ratios[item.key] ?? DEFAULT_RATIO) + (item.lines ?? 1) * LINE;
  }

  return (
    <div className="flex items-start gap-4">
      {buckets.map((bucket, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-4">
          {bucket.map((item) => (
            <div key={item.key}>{item.node}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
