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
            "linear-gradient(180deg, #4a74bd 0%, #3d66ab 45%, #2f5697 100%)",
          color: "#fff",
        }}
      >
        <span
          className="text-[1.15rem] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
        <span className="absolute right-6 flex items-center" aria-hidden>
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
          <div className="mt-3 flex flex-col gap-3">
            {actions.map((action) => (
              <LocaleLink
                key={action.label}
                lang={lang}
                href={action.href}
                tabIndex={open ? undefined : -1}
                aria-hidden={open ? undefined : true}
                className="tile w-full flex-row items-center justify-center px-6 py-4"
                style={{
                  background:
                    "linear-gradient(180deg, #4a74bd 0%, #3d66ab 45%, #2f5697 100%)",
                  color: "#fff",
                }}
              >
                <span
                  className="text-[1.15rem] font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {action.hint}
                </span>
              </LocaleLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
