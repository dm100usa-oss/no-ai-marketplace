"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { PlusIcon, MinusIcon } from "./icons";

export interface FAQItem {
  q: string;
  /** Plain text on most pages. Pages that link out of an answer pass the
   *  already-rendered line instead, which is why this is not a string. */
  a: ReactNode;
}

/**
 * Accessible FAQ accordion (TZ 5.3 uses FAQPage schema where FAQ is
 * really present). The JSON-LD is emitted separately by the caller so
 * this component stays a small client widget.
 */
export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <ul className="flex flex-col gap-2">
        {items.map((it, i) => (
          <FAQRow key={i} item={it} />
        ))}
      </ul>
    </div>
  );
}

/**
 * The answer is always present in the server HTML and is only collapsed
 * with CSS (grid rows 0fr to 1fr, same trick as FindAccordion), so search
 * crawlers and AI answer engines read the full question and answer pair
 * without having to run the click. Nothing is removed from the DOM and
 * nothing is hidden with display:none.
 */
function FAQRow({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li
      className="rounded-xl border bg-white"
      style={{ borderColor: "var(--color-line)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span
          className="text-[1rem] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {item.q}
        </span>
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
          style={{ background: "var(--color-brand-soft)", color: "var(--color-accent)" }}
          aria-hidden
        >
          {open ? <MinusIcon size={18} /> : <PlusIcon size={18} />}
        </span>
      </button>
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0">
            <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
