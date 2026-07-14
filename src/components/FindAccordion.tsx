"use client";

import { useState } from "react";
import { LocaleLink } from "./LocaleLink";
import { SearchIcon } from "./icons";
import type { Locale } from "@/i18n/config";

export interface FindAction {
  hint: string;
  label: string;
  href: string;
}

/**
 * "Find" button that reveals the three entry points (creator / team /
 * company) right below it. The panel is always present in the HTML and
 * only collapsed with CSS, so search engines and AI answer engines read
 * the full semantic core without needing to run the click.
 */
export function FindAccordion({
  lang,
  label,
  actions,
}: {
  lang: Locale;
  label: string;
  actions: FindAction[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="find-panel"
        className="tile relative w-full flex-row items-center justify-center px-6 py-4"
        style={{
          background:
            "linear-gradient(180deg, #eaf2ff 0%, #dbe9ff 50%, #cddff8 100%)",
          color: "var(--color-ink)",
        }}
      >
        <span
          className="text-[1.15rem] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
        <span className="absolute right-6 flex items-center" style={{ color: "var(--color-accent)" }} aria-hidden>
          <SearchIcon size={22} />
        </span>
      </button>

      <div
        id="find-panel"
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 grid max-w-3xl gap-3 sm:grid-cols-3">
            {actions.map((action, i) => (
              <LocaleLink
                key={action.label}
                lang={lang}
                href={action.href}
                tabIndex={open ? undefined : -1}
                aria-hidden={open ? undefined : true}
                className="tile items-center px-4 py-4 text-center"
                style={{
                  background: i === 0 ? "var(--color-brand-soft)" : i === 1 ? "#eef4ff" : "#fff",
                }}
              >
                <span className="text-[0.85rem]" style={{ color: "var(--color-muted)" }}>
                  {action.hint}
                </span>
                <span
                  className="mt-1.5 text-[1.05rem] font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
                >
                  {action.label}
                </span>
              </LocaleLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
