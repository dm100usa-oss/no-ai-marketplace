import { plans, PLAN_ORDER, freeTier, planCheckoutHref, site } from "@/lib/config";
import type { PlanId } from "@/lib/config";
import { freeUntilLabel } from "@/lib/free-date";
import { CheckoutButton } from "./CheckoutButton";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

/**
 * Plans, one per participant type.
 *
 * NO MONTHLY/YEARLY SWITCH
 *
 * There was one, and it earned nothing. While the free places last every
 * plan costs zero, so both sides of the switch showed the same $0 and the
 * visitor pressed twice to learn nothing. Both prices now stand in the
 * card at once — "then $5.99 a month or $49 a year" — which is one line
 * instead of a control, is read by search and answer engines without a
 * click, and removes a decision from a page that already asks for one.
 *
 * The card shows $0 large with "free right now" under it, then the price
 * that starts later, struck through: what it costs today and what it will
 * cost, in that order.
 */

/** Same tones the catalog cards and the join picker use per type. */
/** `dot` is the homepage bullet built in the card's own ink: highlight at
 *  30/30, the ink itself at 70%, a darker edge at the rim. Written out per
 *  tone rather than computed, so the three beads can be adjusted by eye. */
const TONES: Record<PlanId, { bg: string; ink: string; dot: string }> = {
  creator: {
    bg: "#fbeedb",
    ink: "#a9691a",
    dot: "radial-gradient(circle at 30% 30%, #c49963, #a9691a 70%, #875415)",
  },
  team: {
    bg: "#c9e9dc",
    ink: "#0f7a58",
    dot: "radial-gradient(circle at 30% 30%, #5ca58d, #0f7a58 70%, #0c6246)",
  },
  company: {
    bg: "#cfe0f8",
    ink: "#2f5cb0",
    dot: "radial-gradient(circle at 30% 30%, #7290c9, #2f5cb0 70%, #264a8d)",
  },
};

export function PlansTable({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const freeDate = freeUntilLabel(lang);

  return (
    <div>
      {/* Free places */}
      <div
        className="rounded-2xl border p-5 md:p-6"
        style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
      >
        <p
          className="text-[1.1rem] font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {dict.pricing.freeBannerTitle.replace("{n}", String(site.freeSlots))}
        </p>
        <p className="mt-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
          {dict.pricing.freeBannerText
            .replace("{n}", String(site.freeSlots))
            .replace("{date}", freeDate)}
        </p>
      </div>

      {/* One heading over the row instead of the word "plan" repeated on
          every card. It names what the three cards are and tells the
          visitor what to do with them, in one place rather than three. */}
      <h2 className="mt-10 text-center">{dict.pricing.chooseTitle}</h2>

      {/* Plans */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = plans[id];
          const tone = TONES[id];

          return (
            <div
              key={id}
              className="flex flex-col rounded-2xl border p-6"
              style={{ borderColor: "var(--color-line)", background: "#fff" }}
            >
              <span
                className="self-start rounded-md px-2.5 py-1 text-[0.78rem] font-bold uppercase tracking-wide"
                style={{ background: tone.bg, color: tone.ink, fontFamily: "var(--font-display)" }}
              >
                {dict.pricing.planNames[id]}
              </span>

              {/* Who it is for, plus the selling line, held in one block of
                  a fixed minimum height. Cards with a selling line and
                  cards without one would otherwise start their prices at
                  different heights, and a row of three where the middle
                  price sits higher than its neighbours reads as broken
                  rather than as a hierarchy. */}
              <div className="mt-3 md:min-h-[3rem]">
                <p className="text-[0.9rem] leading-snug" style={{ color: "var(--color-muted)" }}>
                  {dict.pricing.planFor[id]}
                </p>

              {/* The selling line: who this plan brings you, not what sits
                  inside it. Set for a plan and it reads as the card's own
                  promise, in ink rather than grey; left empty and the card
                  looks exactly as it did before. */}
                {dict.pricing.planPitch[id] ? (
                  <p
                    className="mt-1.5 text-[1rem] font-semibold leading-snug"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                  >
                    {dict.pricing.planPitch[id]}
                  </p>
                ) : null}
              </div>

              <div className="mt-4">
                {/* Price and "Сейчас бесплатно" on one line, in the same
                    green. The words are what the figure means, so they read
                    as one statement rather than as a number with a caption
                    under it. Baseline alignment keeps them sitting level
                    despite the difference in size. */}
                <p
                  className="flex items-baseline gap-2 leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "#0f7a58" }}
                >
                  <span className="text-[1rem] font-bold">{freeTier.priceLabel}</span>
                  <span className="text-[0.85rem] font-semibold">
                    {dict.pricing.freeNowLabel}
                  </span>
                </p>
                {/* What it costs once the free places are gone: the month on
                    one line, the year under it. The prices are no longer
                    struck through. "Далее" already says they start later, and
                    a struck figure next to $0 reads as a discount already
                    taken rather than as a price still to come. */}
                <p
                  className="mt-2 text-[0.85rem] leading-snug"
                  style={{ color: "var(--color-muted-soft)" }}
                >
                  {dict.pricing.laterPrefix} {plan.monthly.priceLabel} {dict.pricing.perMonth}
                  <br />
                  {dict.pricing.orWord} {plan.yearly.priceLabel} {dict.pricing.perYear}
                </p>
              </div>

              {/* The list gets a heading of its own, in the card's own colour,
                  so the reader knows the lines under it answer one question
                  rather than continuing the price. */}
              <p
                className="mt-5 text-[0.95rem] font-bold"
                style={{ fontFamily: "var(--font-display)", color: tone.ink }}
              >
                {dict.pricing.includedTitle}
              </p>

              <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
                {dict.pricing.planFeatures[id].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[0.9rem] leading-snug">
                    {/* The same glossy bead the homepage lists use, so the
                        two pages read as one site. Here it takes the card's
                        own colour instead of the site blue. */}
                    <span
                      aria-hidden="true"
                      className="mt-[0.4rem] shrink-0 rounded-full"
                      style={{
                        width: "0.55rem",
                        height: "0.55rem",
                        background: tone.dot,
                        boxShadow:
                          "0 1px 2px rgba(30,50,90,0.4), inset 0 1px 1px rgba(255,255,255,0.45)",
                      }}
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <CheckoutButton
                  lang={lang}
                  href={planCheckoutHref(id, "yearly")}
                  label={dict.pricing.claimFree}
                  plan={id}
                  period="yearly"
                  className="tile-btn"
                  style={{ background: tone.bg, color: tone.ink }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
