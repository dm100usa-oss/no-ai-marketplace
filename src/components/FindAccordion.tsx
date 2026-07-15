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
 * One tone per entry point, taken from the same pastel family as the
 * direction tiles: sand for a single creator, mint for a team, blue for
 * a company. Colour carries the difference between "team" and "company",
 * which read too much alike on text alone.
 */
const ACTION_TONES = [
  { bg: "#f7e2c0", ink: "#a3690f", sub: "#8a5a11", press: "#e2cead", icon: "creator" },
  { bg: "#c9e9dc", ink: "#0f7a58", sub: "#0c6549", press: "#b5d4c8", icon: "team" },
  { bg: "#cfe0f8", ink: "#2f5cb0", sub: "#274a86", press: "#bccde4", icon: "company" },
];

/**
 * "Find" button that reveals the three entry points (creator / team /
 * company) right below it. Its lift and gradient live in globals.css
 * (.find-btn), because a horizontal gradient plus a raised shadow is more
 * CSS than belongs in a style attribute. The panel is always present in the HTML and
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
        className="find-btn press-btn relative flex w-full items-center justify-center rounded-2xl px-6 py-4"
        style={{ color: "#ffffff" }}
      >
        <span
          className="text-[1.15rem] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </span>
        <span
          className="absolute right-6 flex items-center"
          style={{ color: "#ffffff" }}
          aria-hidden
        >
          <SearchIcon size={25} />
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
            {actions.map((action, i) => {
              const tone = ACTION_TONES[i] ?? ACTION_TONES[0];
              return (
                <LocaleLink
                  key={action.label}
                  lang={lang}
                  href={action.href}
                  tabIndex={open ? undefined : -1}
                  aria-hidden={open ? undefined : true}
                  className="press-btn flex flex-col items-center justify-center rounded-2xl px-4 py-5 text-center"
                  style={{
                    background: tone.bg,
                    ["--press-bg" as string]: tone.press,
                  }}
                >
                  <img
                    src={`/images/find/${tone.icon}-v2.webp`}
                    alt=""
                    aria-hidden="true"
                    width={130}
                    height={130}
                    loading="lazy"
                    decoding="async"
                    className="block shrink-0"
                  />
                  <span
                    className="mt-3 block text-[1.05rem] font-bold"
                    style={{ fontFamily: "var(--font-display)", color: tone.ink }}
                  >
                    {action.hint}
                  </span>
                  <span
                    className="mt-1 block text-[0.8rem] leading-snug"
                    style={{ color: tone.sub }}
                  >
                    {action.label}
                  </span>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
