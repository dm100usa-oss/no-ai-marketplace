"use client";

import { useState } from "react";
import { TallyForm } from "./TallyForm";
import { CheckShield, ArrowRight } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { ProfileType } from "@/lib/types";

/**
 * "Who are you" step in front of the submission form. The type decides
 * what the form asks and how the profile reads in the catalog, so we ask
 * it plainly rather than burying it as a dropdown inside the form.
 *
 * All three options are always in the HTML — the choice only switches
 * which one is highlighted and opens the form below, so search engines
 * and AI answer engines read the full set without running the click.
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
  const [picked, setPicked] = useState<ProfileType | null>(null);

  return (
    <div>
      <h2>{dict.join.pickTitle}</h2>
      <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
        {dict.join.pickIntro}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {ORDER.map((type) => {
          const opt = dict.join.pickOptions[type];
          const tone = TONES[type];
          const active = picked === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setPicked(type)}
              aria-pressed={active}
              className="press-btn flex flex-col items-center rounded-2xl border p-5 text-center"
              style={{
                borderColor: active ? tone.solid : "var(--color-line)",
                borderWidth: active ? 2 : 1,
                background: active ? tone.bg : "#fff",
                ["--press-bg" as string]: tone.bg,
              }}
            >
              <img
                src={`/images/find/${ICON_FILE[type]}-v2.webp`}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="-my-3 block shrink-0"
              />
              <span
                className="mt-4 text-[1.1rem] font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {opt.title}
              </span>
              <span className="mt-1.5 text-[0.9rem] leading-snug" style={{ color: "var(--color-muted)" }}>
                {opt.text}
              </span>
              <span className="mt-3 flex flex-col gap-1.5 text-left">
                {opt.points.map((line) => (
                  <span
                    key={line}
                    className="flex gap-2 text-[0.85rem] leading-snug"
                    style={{ color: "var(--color-muted)" }}
                  >
                    <CheckShield size={15} className="mt-0.5 shrink-0" />
                    {line}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div id="form" className="mt-10 scroll-mt-32">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2>{dict.join.formTitle}</h2>
            <span className="text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
              {dict.join.pickChosen}{" "}
              <span className="font-semibold" style={{ color: TONES[picked].ink }}>
                {dict.join.pickOptions[picked].title}
              </span>
            </span>
          </div>
          <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
            {dict.join.formIntro}
          </p>
          <div className="mt-4">
            <TallyForm lang={lang} dict={dict} type={picked} />
          </div>
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="mt-4 text-[0.9rem] font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            {dict.join.pickChange}
          </button>
        </div>
      )}

      {!picked && (
        <p className="mt-5 flex items-center gap-2 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
          {dict.join.pickCta}
          <ArrowRight size={16} />
        </p>
      )}
    </div>
  );
}
