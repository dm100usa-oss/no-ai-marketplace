"use client";

import { useState } from "react";
import { TallyForm } from "./TallyForm";
import { CheckShield, ChevronDown } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { ProfileType } from "@/lib/types";

/**
 * "Choose how you work" step in front of the submission form, built as an
 * accordion. Each participant type is a row; opening one reveals its form
 * right underneath and closes the others, so only one form shows at a
 * time and the page stays short.
 *
 * All three rows are always in the HTML — opening one only switches which
 * form is mounted below its own row, so search engines and AI answer
 * engines still read the full set of options without running the click.
 */

const ORDER: ProfileType[] = ["creator", "team", "company"];

/** Same tones the catalog cards use for each participant type. */
const TONES: Record<ProfileType, { bg: string; ink: string; solid: string }> = {
  creator: { bg: "#f7e2c0", ink: "#a3690f", solid: "#a3690f" },
  team: { bg: "#c9e9dc", ink: "#0f7a58", solid: "#0f7a58" },
  company: { bg: "#cfe0f8", ink: "#2f5cb0", solid: "#2f5cb0" },
};

/** Same drawings the "Find" block on the home page uses, one per type. */
const ICON_FILE: Record<ProfileType, string> = {
  creator: "creator",
  team: "team",
  company: "company",
};

export function JoinPicker({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState<ProfileType | null>(null);

  return (
    <div>
      <h2>{dict.join.pickTitle}</h2>
      {dict.join.pickIntro ? (
        <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
          {dict.join.pickIntro}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3">
        {ORDER.map((type) => {
          const opt = dict.join.pickOptions[type];
          const tone = TONES[type];
          const active = open === type;
          return (
            <div
              key={type}
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: tone.solid,
                borderWidth: active ? 2 : 1,
              }}
            >
              {/* Row header — click to open/close */}
              <button
                type="button"
                onClick={() => setOpen(active ? null : type)}
                aria-expanded={active}
                className="press-btn flex w-full items-center gap-4 p-4 text-left"
                style={{
                  background: tone.bg,
                  ["--press-bg" as string]: tone.bg,
                }}
              >
                <img
                  src={`/images/find/${ICON_FILE[type]}-v2.webp`}
                  alt=""
                  aria-hidden="true"
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="-my-1 block shrink-0"
                />
                <span className="flex-1">
                  <span
                    className="block text-[1.1rem] font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                  >
                    {opt.title}
                  </span>
                  <span className="mt-0.5 block text-[0.9rem] leading-snug" style={{ color: "var(--color-muted)" }}>
                    {opt.text}
                  </span>
                </span>
                <span
                  className="shrink-0 transition-transform"
                  style={{
                    color: active ? tone.ink : "var(--color-muted-soft)",
                    transform: active ? "rotate(180deg)" : "none",
                    lineHeight: 0,
                  }}
                >
                  <ChevronDown size={20} />
                </span>
              </button>

              {/* Body — points + the form, shown only when open */}
              {active && (
                <div className="border-t p-4" style={{ borderColor: "var(--color-line)" }}>
                  <div className="flex flex-col gap-1.5">
                    {opt.points.map((line) => (
                      <span
                        key={line}
                        className="flex gap-2 text-[0.9rem] leading-snug"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <CheckShield size={15} className="mt-0.5 shrink-0" />
                        {line}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                    {dict.join.formIntro}
                  </p>
                  <div className="mt-4">
                    <TallyForm lang={lang} dict={dict} type={type} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
