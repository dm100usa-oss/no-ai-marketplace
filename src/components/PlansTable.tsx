import { plans, PLAN_ORDER, freeTier, planCheckoutHref, site } from "@/lib/config";
import type { PlanId } from "@/lib/config";
import { freeUntilLabel, paidFromYear } from "@/lib/free-date";
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

/** Same tones the catalog cards and the join picker use per type.
 *
 *  `bg` is the plate behind the plan name and the button. `ink` is the
 *  button's own lettering. `dot` is the bead in the list.
 *
 *  The beads are deliberately NOT built from `ink`. Ink has to be dark
 *  enough to read as text on a pale plate, and a bead in that colour sits
 *  almost invisible against white. These are built from the brightest
 *  member of each colour family instead — the same hues the direction
 *  tiles use — so the bead is a spot of colour rather than a dark speck. */
const TONES: Record<PlanId, { bg: string; edge: string; ink: string; dot: string }> = {
  creator: {
    bg: "#ffeabd",
    edge: "#f2d18d",
    /* Not a dark gold. Gold dark enough to read as small text is brown, and
       brown is the one thing this card must not have, so the lettering falls
       back to the site's own ink and the gold lives in the plate and the
       beads, where it can stay fully saturated. */
    ink: "var(--color-ink)",
    dot: "radial-gradient(circle at 30% 30%, #ffcb5c, #ffab00 70%, #e09600)",
  },
  team: {
    bg: "#c9e9dc",
    edge: "#a3d8c3",
    ink: "#0f7a58",
    dot: "radial-gradient(circle at 30% 30%, #66bda1, #1e9e75 70%, #187e5e)",
  },
  company: {
    bg: "#cfe0f8",
    edge: "#a8c6ee",
    ink: "#2f5cb0",
    dot: "radial-gradient(circle at 30% 30%, #7c9ddc, #3e6fcc 70%, #3259a3)",
  },
};

export function PlansTable({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const freeDate = freeUntilLabel(lang);
  const paidYear = String(paidFromYear());

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
              className="flex flex-col rounded-2xl border p-3"
              style={{ borderColor: "var(--color-line)", background: "#fff" }}
            >
              {/* The plate runs the full width of the card and the name sits
                  in the middle of it: a short tag pinned to the left corner
                  read as a label stuck on the card, while a full band reads
                  as the card's own heading. The lettering is the softer
                  secondary ink rather than full black, because on a pale
                  tinted band full black is heavier than the words deserve. */}
              <span
                className="flex items-center justify-center rounded-md px-2.5 text-center text-[0.78rem] font-bold uppercase tracking-wide"
                style={{
                  background: tone.bg,
                  border: `1px solid ${tone.edge}`,
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-display)",
                  minHeight: "var(--h-action-lg)",
                }}
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
                  <span className="text-[1.4rem] font-bold">{freeTier.priceLabel}</span>
                  <span className="text-[0.85rem] font-semibold">
                    {dict.pricing.freeNowLabel}
                  </span>
                </p>
                {/* What it costs once the free period ends, three lines: when
                    it starts, the month, the year. The year is counted from
                    the free-period date in config, so it cannot drift out of
                    step with the banner above. The prices are not struck
                    through: a struck figure next to $0 reads as a discount
                    already taken rather than as a price still to come. */}
                <p
                  className="mt-2 text-[0.85rem] leading-snug"
                  style={{ color: "var(--color-muted-soft)" }}
                >
                  <span className="block">
                    {dict.pricing.laterPrefix.replace("{year}", paidYear)}
                  </span>
                  <span className="block">
                    {plan.monthly.priceLabel} {dict.pricing.perMonth}
                  </span>
                  <span className="block">
                    {dict.pricing.orWord} {plan.yearly.priceLabel} {dict.pricing.perYear}
                  </span>
                </p>
              </div>

              {/* The list gets a heading of its own, in the same ink as every
                  other heading on the site, so the reader knows the lines
                  under it answer one question rather than continuing the
                  price. Colour on the card is carried by the plate above and
                  the beads below; a coloured heading on top of both was one
                  voice too many. */}
              <p
                className="mt-5 text-[0.95rem] font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
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
                        width: "0.62rem",
                        height: "0.62rem",
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
                  style={{ background: tone.bg, borderColor: tone.edge, color: tone.ink }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
