"use client";

import { useEffect } from "react";
import { LocaleLink } from "./LocaleLink";
import { integrations } from "@/lib/config";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { ProfileType } from "@/lib/types";

/**
 * Embeds the Tally submission form. The form lives on tally.so and carries
 * its own "limit responses" setting (100). Once the limit is reached Tally
 * closes the free form and shows the paid step, so the count, the threshold
 * and the switch to payment all happen without the owner.
 *
 * The participant type picked on /join is passed to Tally as a hidden
 * field, so one form can branch to the right questions and every
 * submission arrives already labelled creator / team / company.
 *
 * If no form id is configured yet, we render a short notice instead of an
 * empty box, so the page always makes sense.
 */
export function TallyForm({
  lang,
  dict,
  type,
}: {
  lang: Locale;
  dict: Dictionary;
  /** Participant type chosen before the form, passed through to Tally. */
  type?: ProfileType;
}) {
  const formId = integrations.tallyFormId;

  useEffect(() => {
    if (!formId) return;

    const SRC = "https://tally.so/widgets/embed.js";
    const run = () => {
      const w = window as unknown as { Tally?: { loadEmbeds: () => void } };
      if (w.Tally) w.Tally.loadEmbeds();
    };

    if (document.querySelector(`script[src="${SRC}"]`)) {
      run();
      return;
    }
    const s = document.createElement("script");
    s.src = SRC;
    s.onload = run;
    s.onerror = run;
    document.body.appendChild(s);
  }, [formId, type]);

  if (!formId) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "var(--color-line)", background: "#fff" }}
      >
        {type && (
          <p className="mb-3 text-[0.85rem] font-semibold" style={{ color: "var(--color-muted-soft)" }}>
            {dict.join.pickChosen} {dict.join.pickOptions[type].title}
          </p>
        )}
        <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
          {dict.tally.notice1}
        </p>
        <p className="mt-3 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {dict.tally.notice2a}
          <LocaleLink
            lang={lang}
            href="/contact"
            className="font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            {dict.tally.getInTouch}
          </LocaleLink>
          {dict.tally.notice2b}
        </p>
      </div>
    );
  }

  const params = new URLSearchParams({
    alignLeft: "1",
    hideTitle: "1",
    transparentBackground: "1",
    dynamicHeight: "1",
  });
  // Hidden fields Tally reads straight from the embed URL.
  if (type) params.set("type", type);
  params.set("lang", lang);

  return (
    <div
      key={type ?? "any"}
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--color-line)", background: "#fff" }}
    >
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?${params.toString()}`}
        loading="lazy"
        width="100%"
        height={500}
        title={dict.tally.iframeTitle}
        style={{ border: 0, display: "block" }}
      />
    </div>
  );
}
