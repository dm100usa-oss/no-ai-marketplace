"use client";

import { useEffect } from "react";
import Link from "next/link";
import { integrations, site } from "@/lib/config";

/**
 * Embeds the Tally submission form (TZ 2.3, stage 5).
 *
 * The form lives on tally.so and carries its own "limit responses"
 * setting (set to site.freeSlots = 100). Once the limit is reached Tally
 * closes the free form and shows the paid step, so the count, the
 * threshold and the switch to payment all happen without the owner.
 *
 * If no form id is configured yet, we render a short notice instead of
 * an empty box, so the page always makes sense.
 */
export function TallyForm() {
  const formId = integrations.tallyFormId;

  useEffect(() => {
    if (!formId) return;

    const SRC = "https://tally.so/widgets/embed.js";
    // Ask an already-loaded Tally script to (re)size the iframe.
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
  }, [formId]);

  if (!formId) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "var(--color-line)", background: "#fff" }}
      >
        <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
          The submission form is powered by Tally and includes a built-in
          limit of {site.freeSlots} free places. Once that limit is reached,
          the form automatically switches to the paid step and takes payment
          through Stripe.
        </p>
        <p className="mt-3 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          The form is being connected. In the meantime, please{" "}
          <Link
            href="/contact"
            className="font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            get in touch
          </Link>{" "}
          to be added.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--color-line)", background: "#fff" }}
    >
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height={500}
        title="Add your profile"
        style={{ border: 0, display: "block" }}
      />
    </div>
  );
}
