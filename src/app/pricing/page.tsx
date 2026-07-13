import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pricing, site } from "@/lib/config";
import { CheckShield, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pricing",
  description: `The first ${site.freeSlots} profiles are free. After that, ${pricing.monthly.priceLabel}/month or ${pricing.yearly.priceLabel}/year.`,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />

      <div className="mx-auto max-w-3xl">
        <h1>Pricing</h1>
        <p className="lead mt-4">
          The first {site.freeSlots} profiles are free — they help fill the
          catalogue and rank in search and AI answers. After that, listings
          are paid. Prices are set once in a single config file, so a change
          is reflected everywhere on the site.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <PlanCard
            title={pricing.free.name}
            price={pricing.free.priceLabel}
            period={pricing.free.period}
            features={[...pricing.free.features]}
            highlight={false}
          />
          <PlanCard
            title={pricing.monthly.name}
            price={pricing.monthly.priceLabel}
            period={pricing.monthly.period}
            features={[...pricing.monthly.features]}
            highlight={false}
          />
          <PlanCard
            title={pricing.yearly.name}
            price={pricing.yearly.priceLabel}
            period={pricing.yearly.period}
            note={pricing.yearly.note}
            features={[...pricing.yearly.features]}
            highlight
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="!text-[1.25rem]">Everything included in a paid profile</h2>
            <ul className="mt-4 space-y-2" style={{ color: "var(--color-muted)" }}>
              {[
                "Full profile with description, services, products and gallery",
                "Multiple categories and tags",
                "All external links (site, shop, portfolio, socials)",
                "AI-usage statement and, if verified, review details",
                "Auto-generated indexable page for search engines and AI",
                "Related profiles and cross-links from category pages",
              ].map((line) => (
                <li key={line} className="flex gap-2 text-[0.95rem]">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="!text-[1.25rem]">How payment works</h2>
            <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              After the first {site.freeSlots} places are taken, the join
              form automatically switches to a paid step. Payment is
              processed by Stripe — the site never sees or stores your card
              details. Monthly plans renew each month; yearly plans renew each
              year. You can cancel at any time.
            </p>
            <p className="mt-3 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              No commissions on your sales. No cut of transactions. The site
              is a listing directory, not a marketplace with in-site payments.
            </p>
          </div>
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 md:p-8"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <h2 className="!text-[1.25rem]">Ready to list?</h2>
          <p className="mt-2 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
            The first {site.freeSlots} are free — after that, {pricing.monthly.priceLabel}/month or {pricing.yearly.priceLabel}/year.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/join" className="btn btn-ink">
              Add your profile
              <ArrowRight size={16} />
            </Link>
            <Link href="/human-made-standards" className="btn btn-quiet">
              Read the standards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  note,
  features,
  highlight,
}: {
  title: string;
  price: string;
  period: string;
  note?: string;
  features: string[];
  highlight: boolean;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border p-6"
      style={{
        borderColor: highlight ? "var(--color-accent)" : "var(--color-line)",
        background: highlight ? "var(--color-brand-soft)" : "#fff",
      }}
    >
      <p
        className="text-[0.78rem] font-semibold uppercase tracking-wide"
        style={{ color: highlight ? "var(--color-accent)" : "var(--color-muted-soft)" }}
      >
        {title}
      </p>
      <p
        className="mt-2 text-[2rem] font-bold leading-none"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        {price}
      </p>
      <p className="mt-1 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
        {period}
      </p>
      {note && (
        <p className="mt-2 text-[0.85rem] font-semibold" style={{ color: "var(--color-accent)" }}>
          {note}
        </p>
      )}

      <ul className="mt-4 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
            <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/join"
        className={`btn mt-6 ${highlight ? "btn-ink" : "btn-quiet"}`}
      >
        {title === pricing.free.name ? "Claim a free spot" : "Get started"}
      </Link>
    </div>
  );
}
