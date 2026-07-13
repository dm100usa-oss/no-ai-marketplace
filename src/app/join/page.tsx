import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site, pricing } from "@/lib/config";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { CheckShield, ArrowRight, SparkIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Add your profile",
  description: `Add a profile to No AI Marketplace. The first ${site.freeSlots} are free, then $${pricing.monthly.price}/month or $${pricing.yearly.price}/year.`,
  alternates: { canonical: "/join" },
};

const faqItems: FAQItem[] = [
  {
    q: "How much does a profile cost?",
    a: `The first ${site.freeSlots} profiles on the site are free. After that, listings are ${pricing.monthly.priceLabel}/month or ${pricing.yearly.priceLabel}/year (about 32% off vs monthly).`,
  },
  {
    q: "What do I need to add a profile?",
    a: "A short description of your work, main and additional categories, country, tags, and links to your own site, portfolio or shop. Verified creators additionally submit process materials.",
  },
  {
    q: "How long until my profile goes live?",
    a: "Profiles are reviewed by hand and typically appear in the catalogue within a few working days. Verification, if requested, may take a little longer.",
  },
  {
    q: "Can I edit my profile later?",
    a: "Yes. Email us with the changes and we update the listing. A self-service dashboard is on the roadmap.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Paid listings can be cancelled at any time; the profile stays live until the end of the current period, then is removed from the catalogue.",
  },
  {
    q: "Do you take a cut of my sales?",
    a: "No. We are a directory, not a marketplace. All transactions happen on your own site, shop or portfolio — we never sit between you and your buyer.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
};

export default function JoinPage() {
  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Add your profile" }]} />

      <div className="mx-auto max-w-3xl">
        <div
          className="rounded-2xl border p-6 md:p-10"
          style={{ borderColor: "var(--color-brand)", background: "var(--color-brand-soft)" }}
        >
          <span
            className="grid h-11 w-11 place-items-center rounded-xl bg-white"
            style={{ color: "var(--color-accent)" }}
          >
            <SparkIcon />
          </span>
          <h1 className="mt-4">Add your profile</h1>
          <p className="lead mt-3">
            Be found by buyers looking for work made by people. Add your
            profile in a few minutes — the first {site.freeSlots} profiles are
            free.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="#form" className="btn btn-ink">
              Start now
              <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="btn btn-quiet">
              See pricing
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <h2 className="mt-12">Why be on No AI Marketplace</h2>
        <ul className="mt-4 space-y-3">
          {[
            "All buyer traffic goes to your own site, shop or portfolio — not to a middleman.",
            "Your profile is a clean, indexable page built for SEO and generative AI answers.",
            "A verified badge shows exactly what we reviewed, which builds trust with buyers.",
            "One-time set-up, then the profile keeps working while you focus on the work.",
          ].map((line) => (
            <li key={line} className="flex gap-3" style={{ color: "var(--color-muted)" }}>
              <CheckShield size={18} className="mt-0.5 shrink-0" />
              <span className="text-[0.98rem]">{line}</span>
            </li>
          ))}
        </ul>

        {/* Plans compact */}
        <h2 className="mt-12">Plans</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PlanCard
            title={pricing.free.name}
            price={pricing.free.priceLabel}
            period={pricing.free.period}
            highlight={false}
          />
          <PlanCard
            title={pricing.monthly.name}
            price={pricing.monthly.priceLabel}
            period={pricing.monthly.period}
            highlight={false}
          />
          <PlanCard
            title={pricing.yearly.name}
            price={pricing.yearly.priceLabel}
            period={pricing.yearly.period}
            note="Save about 32%"
            highlight
          />
        </div>
        <p className="mt-3 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          Full comparison on the{" "}
          <Link href="/pricing" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Pricing
          </Link>{" "}
          page.
        </p>

        {/* Steps */}
        <h2 className="mt-12">How it works</h2>
        <ol className="mt-4 space-y-4">
          {[
            {
              t: "Fill in the form",
              d: "Name, one main category, description, country, tags and the links to your own platforms. Verified creators also attach process materials.",
            },
            {
              t: "Pick a plan",
              d: `The first ${site.freeSlots} profiles are free. After that you choose Monthly (${pricing.monthly.priceLabel}) or Yearly (${pricing.yearly.priceLabel}) and pay through Stripe.`,
            },
            {
              t: "We review by hand",
              d: "We check the profile fits the Human-Made standards and, if you asked for verification, we look at the materials.",
            },
            {
              t: "Your profile goes live",
              d: "The profile appears in the catalogue and starts sending traffic to your own platforms.",
            },
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold text-white"
                style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1rem]">{s.t}</h3>
                <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Form placeholder for stage 5 wiring */}
        <div id="form" className="mt-12 scroll-mt-32">
          <h2>The form</h2>
          <div
            className="mt-4 rounded-2xl border p-6"
            style={{ borderColor: "var(--color-line)", background: "#fff" }}
          >
            <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              The submission form is powered by Tally and includes a built-in
              limit of {site.freeSlots} free places. Once that limit is reached,
              the form automatically switches to the paid step and takes
              payment through Stripe.
            </p>
            <p className="mt-3 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
              The form itself is connected on stage 5 of the build. Until then
              this page describes what to expect. If you would like to be added
              in the meantime, please{" "}
              <Link href="/contact" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                get in touch
              </Link>
              .
            </p>
          </div>
        </div>

        <h2 className="mt-12">Rules and standards</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          Please read{" "}
          <Link href="/human-made-standards" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Human-Made standards
          </Link>{" "}
          before you submit — the standards describe what belongs in the
          catalogue and what does not, and how hybrid work fits. Payments and
          listing rules are covered in the{" "}
          <Link href="/listing-policy" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Listing Policy
          </Link>
          .
        </p>

        {/* FAQ */}
        <h2 className="mt-12">Frequently asked questions</h2>
        <div className="mt-4">
          <FAQ items={faqItems} />
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
  highlight,
}: {
  title: string;
  price: string;
  period: string;
  note?: string;
  highlight: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: highlight ? "var(--color-accent)" : "var(--color-line)",
        background: highlight ? "var(--color-brand-soft)" : "#fff",
      }}
    >
      <p
        className="text-[0.8rem] font-semibold uppercase tracking-wide"
        style={{ color: highlight ? "var(--color-accent)" : "var(--color-muted-soft)" }}
      >
        {title}
      </p>
      <p
        className="mt-1 text-[1.35rem] font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        {price}
      </p>
      <p className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
        {period}
      </p>
      {note && (
        <p className="mt-2 text-[0.82rem] font-semibold" style={{ color: "var(--color-accent)" }}>
          {note}
        </p>
      )}
    </div>
  );
}
