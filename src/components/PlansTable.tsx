import { plans, PLAN_ORDER, freeTier, planCheckoutHref, site } from "@/lib/config";
import type { PlanId } from "@/lib/config";
import { freeUntilLabel, paidFromYear } from "@/lib/free-date";
import { CheckoutButton } from "./CheckoutButton";
import { PlanNumbers } from "./PlanNumbers";
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

/**
 * One folded plate: a coloured band with a title and a plus that turns into
 * a cross when it opens.
 *
 * The title stays the same size and weight whether the plate is open or
 * shut, so the three of them read as a stack of equal statements rather
 * than as a list that grows a heading when you touch it.
 */
function PricingFold({
  title,
  bg,
  edge,
  plus,
  children,
}: {
  title: string;
  bg: string;
  edge: string;
  plus: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border" style={{ borderColor: edge, background: bg }}>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
          <span
            className="text-[1.15rem] font-bold leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {title}
          </span>
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform group-open:rotate-45"
            style={{ background: "rgba(255,255,255,0.75)", color: plus }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </summary>
        <p
          className="px-5 pb-5 text-[1.15rem] leading-snug md:px-6 md:pb-6"
          style={{ color: "var(--color-muted)" }}
        >
          {children}
        </p>
      </details>
    </div>
  );
}

export function PlansTable({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const freeDate = freeUntilLabel(lang);
  const paidYear = String(paidFromYear());

  return (
    <div>
      {/* The three plates at the top of the page, folded.

          On a phone the opening of this page used to be three paragraphs of
          prose before the visitor reached a single price. Folded, the whole
          offer fits on one screen: three titles and the plans right under
          them. Anyone who wants the detail opens it.

          Built on native <details>, the same as the FAQ on the category
          pages: the text is in the HTML whether the plate is open or shut,
          so search engines and AI engines read all of it without running
          any code. */}
      <div className="flex flex-col gap-3">
        <PricingFold
          title={dict.pricing.introTitle}
          bg="#eae4fa"
          edge="#d6cbf3"
          plus="#6b5cc4"
        >
          {dict.pricing.introBody}
        </PricingFold>

        <PricingFold
          title={dict.pricing.freeBannerTitle.replace("{n}", String(site.freeSlots))}
          bg="var(--color-brand-soft)"
          edge="var(--color-brand)"
          plus="var(--color-accent)"
        >
          {dict.pricing.freeBannerText
            .replace("{n}", String(site.freeSlots))
            .replace("{date}", freeDate)}
        </PricingFold>

        <PricingFold
          title={dict.pricing.headlineTitle}
          bg="#fbe4e9"
          edge="#f2c3ce"
          plus="#c44a6e"
        >
          {dict.pricing.headlineBodyLead}{" "}
          {/* The platform name is set in the brand face here exactly as it is
              in the logo and the footer. Left in the body face it read as an
              ordinary noun in the sentence rather than as the name of the
              place the sentence is about. */}
          <span className="font-semibold" style={{ fontFamily: "var(--font-brand)" }}>
            No AI Directory
          </span>{" "}
          {dict.pricing.headlineBodyTail}
        </PricingFold>
      </div>

      {/* One heading over the row instead of the word "plan" repeated on
          every card. It names what the three cards are and tells the
          visitor what to do with them, in one place rather than three. */}
      {/* The heading and the three plates sit on one line, centred together.
          The plates are dealt out as the heading comes into view and say in
          one glance what the row below holds: three choices, in the three
          colours the cards themselves use. */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <h2 className="!m-0">{dict.pricing.chooseTitle}</h2>
        <PlanNumbers />
      </div>

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
                className="relative flex items-center justify-center rounded-md px-2.5 text-center text-[1.35rem] font-bold tracking-wide"
                style={{
                  background: tone.bg,
                  border: `1px solid ${tone.edge}`,
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-display)",
                  minHeight: "var(--h-action-lg)",
                }}
              >
                {/* The drawing this participant type already has in the
                    "Найти" block on the home page. Set at the left edge and
                    out of the flow, so the name itself stays centred on the
                    plate rather than being nudged sideways by the picture. */}
                <img
                  src={`/images/find/${id}-v2.webp`}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="absolute left-3 block h-10 w-10 shrink-0"
                />
                {dict.pricing.planNames[id]}
              </span>

              {/* Who it is for, plus the selling line, held in one block of
                  a fixed minimum height. Cards with a selling line and
                  cards without one would otherwise start their prices at
                  different heights, and a row of three where the middle
                  price sits higher than its neighbours reads as broken
                  rather than as a hierarchy. */}
              <div className="mt-3 md:min-h-[3rem]">
                <p className="text-[1.15rem] leading-snug" style={{ color: "var(--color-muted)" }}>
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
                  <span className="text-[1.15rem] font-semibold">
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
                  className="mt-2 text-[1.15rem] leading-snug"
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

              {/* "Что входит" folds on a phone and stays open on a computer.

                  On a phone three open lists mean the visitor scrolls past
                  the first two plans to reach the third; folded, all three
                  names, prices and buttons fit one screen and the detail is
                  one tap away. On a computer the three cards stand side by
                  side and comparing them at a glance is the whole point of
                  the page, so nothing is hidden there.

                  Done with a checkbox rather than <details> so that the same
                  markup can be shut on a phone and open on a computer: a
                  <details> can only be forced open by script, which would
                  mean the list collapsing in front of the reader a moment
                  after the page appears. The list is in the HTML either way,
                  so search engines and AI engines read it whether it is
                  folded or not. */}
              <input
                type="checkbox"
                id={`included-${id}`}
                className="peer sr-only"
                aria-hidden
                tabIndex={-1}
              />
              <label
                htmlFor={`included-${id}`}
                className="mt-5 flex cursor-pointer items-center justify-between gap-3 text-[1.35rem] font-bold peer-checked:[&>span]:rotate-45 md:cursor-default"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {dict.pricing.includedTitle}
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform md:hidden"
                  style={{ background: tone.bg, border: `1px solid ${tone.edge}`, color: tone.ink }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </label>

              <ul
                className="mt-4 hidden flex-col gap-4 text-[1.15rem] peer-checked:flex md:flex"
                style={{ color: "var(--color-ink)" }}
              >
                {dict.pricing.planFeatures[id].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    {/* The same glossy bead the homepage lists use, so the
                        two pages read as one site. Here it takes the card's
                        own colour instead of the site blue. */}
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] shrink-0 rounded-full"
                      style={{
                        width: "0.7rem",
                        height: "0.7rem",
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
