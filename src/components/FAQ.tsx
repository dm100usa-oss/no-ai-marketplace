"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "./icons";

export interface FAQItem {
  q: string;
  a: string;
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

function FAQRow({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className="rounded-xl border bg-white"
      style={{ borderColor: "var(--color-line)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
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
      {open && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
            {item.a}
          </p>
        </div>
      )}
    </li>
  );
}
