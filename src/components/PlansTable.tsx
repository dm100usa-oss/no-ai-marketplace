"use client";

import { useState } from "react";
import { plans, PLAN_ORDER, freeTier, planCheckoutHref, site } from "@/lib/config";
import type { PlanId, BillingPeriod } from "@/lib/config";
import { CheckoutButton } from "./CheckoutButton";
import { CheckShield } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

/**
 * Plans, one per participant type, with a monthly/yearly switch.
 *
 * All three plans and both periods are always in the HTML — the switch
 * only swaps which price is shown, so search engines and AI answer
 * engines read the full price list without running the click.
 *
 * While free places are left, every plan shows its real price struck
 * through next to "free right now": the visitor sees both what it costs
 * later and that today it costs nothing.
 */

/** Same tones the catalog cards and the join picker use per type. */
const TONES: Record<PlanId, { bg: string; ink: string }> = {
  creator: { bg: "#f7e2c0", ink: "#a3690f" },
  team: { bg: "#c9e9dc", ink: "#0f7a58" },
  company: { bg: "#cfe0f8", ink: "#2f5cb0" },
};

export function PlansTable({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [period, setPeriod] = useState<BillingPeriod>("yearly");

  const freeDate = new Date(site.freeUntil).toLocaleDateString(
    lang === "ru" ? "ru-RU" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );

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

      {/* Monthly / yearly switch */}
      <div className="mt-8 flex justify-center">
        <div
          className="inline-flex rounded-xl border p-1"
          style={{ borderColor: "var(--color-line)", background: "#fff" }}
        >
          {(["monthly", "yearly"] as BillingPeriod[]).map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                aria-pressed={active}
                className="rounded-lg px-4 py-2 text-[0.9rem] font-semibold transition-colors"
                style={{
                  background: active ? "var(--color-ink)" : "transparent",
                  color: active ? "#fff" : "var(--color-muted)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {p === "monthly" ? dict.pricing.billedMonthly : dict.pricing.billedYearly}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = plans[id];
          const tone = TONES[id];
          const price = plan[period].priceLabel;
          const per = period === "monthly" ? dict.pricing.perMonth : dict.pricing.perYear;

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

              <p className="mt-3 text-[0.9rem] leading-snug" style={{ color: "var(--color-muted)" }}>
                {dict.pricing.planFor[id]}
              </p>

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
                <p className="mt-2 text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                  <span style={{ textDecoration: "line-through" }}>{price}</span> {per}
                  {period === "yearly" && (
                    <span className="ml-1.5 font-semibold" style={{ color: tone.ink }}>
                      {dict.pricing.saveLabel.replace("{n}", plan.savingLabel)}
                    </span>
                  )}
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
                  href={planCheckoutHref(id, period)}
                  label={dict.pricing.claimFree}
                  plan={id}
                  period={period}
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
