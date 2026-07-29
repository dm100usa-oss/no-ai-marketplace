import { plans, PLAN_ORDER, freeTier, planCheckoutHref, site } from "@/lib/config";
import type { PlanId } from "@/lib/config";
import { freeUntilLabel } from "@/lib/free-date";
import { CheckoutButton } from "./CheckoutButton";
import { CheckShield } from "./icons";
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
const TONES: Record<PlanId, { bg: string; ink: string }> = {
  creator: { bg: "#f7e2c0", ink: "#a3690f" },
  team: { bg: "#c9e9dc", ink: "#0f7a58" },
  company: { bg: "#cfe0f8", ink: "#2f5cb0" },
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
      <h2 className="mt-10">{dict.pricing.chooseTitle}</h2>

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
              <div className="mt-3 md:min-h-[5.5rem]">
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
                <p
                  className="text-[2rem] font-bold leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {freeTier.priceLabel}
                </p>
                <p className="mt-1 text-[0.85rem] font-semibold" style={{ color: tone.ink }}>
                  {dict.pricing.freeNowLabel}
                </p>
                {/* Both prices at once. "потом" is what keeps a struck-out
                    figure from reading as "was 49, now 0 forever": it is
                    the price that starts later, not a discount already
                    taken. */}
                <p className="mt-2 text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                  {dict.pricing.laterPrefix}{" "}
                  <span style={{ textDecoration: "line-through" }}>
                    {plan.monthly.priceLabel}
                  </span>{" "}
                  {dict.pricing.perMonth} {dict.pricing.orWord}{" "}
                  <span style={{ textDecoration: "line-through" }}>
                    {plan.yearly.priceLabel}
                  </span>{" "}
                  {dict.pricing.perYear}{" "}
                  <span className="font-semibold" style={{ color: tone.ink }}>
                    {dict.pricing.saveLabel.replace("{n}", plan.savingLabel)}
                  </span>
                </p>
              </div>

              <ul className="mt-5 space-y-2" style={{ color: "var(--color-muted)" }}>
                {dict.pricing.planFeatures[id].map((line) => (
                  <li key={line} className="flex gap-2 text-[0.9rem] leading-snug">
                    <CheckShield size={15} className="mt-0.5 shrink-0" />
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
                  className="btn btn-quiet btn-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
