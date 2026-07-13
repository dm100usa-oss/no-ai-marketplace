import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/config";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "About the project",
  description:
    "No AI Marketplace is an international directory of people, studios and companies who create work, products and services without AI. It is a showcase, not a shop.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <div className="mx-auto max-w-3xl">
        <h1>About No AI Marketplace</h1>
        <p className="lead mt-4">
          No AI Marketplace is an international directory of people, studios and
          companies whose work is made by humans, not by AI. It is a showcase
          and a source of traffic — not a shop with a cart, not a place where
          money changes hands.
        </p>

        <h2 className="mt-10">What the site does</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          A buyer searches or browses the catalogue, finds a creator or
          company, opens their profile, and clicks through to the
          creator&apos;s own site, shop or portfolio. Payment, delivery,
          communication and revisions all happen there, directly between buyer
          and creator. We do not sit in the middle.
        </p>

        <h2 className="mt-10">Why it exists</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          As AI generates more of the content, products and services online,
          the demand for verified human-made work grows. Buyers, brands and
          agencies want to find creators whose work is genuinely made by hand
          or by human judgement. Creators, in turn, want to be recognised for
          that and be easy to find. No AI Marketplace closes both sides of that
          need.
        </p>

        <h2 className="mt-10">How profiles get into the catalogue</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          The first {site.freeSlots} profiles are free. After that, listings
          are paid. Each profile is reviewed before it goes live. Verified
          creators additionally submit materials (process photos or video,
          drafts, published work) that we look at by hand — the profile then
          shows what was reviewed.
        </p>

        <h2 className="mt-10">What we do not claim</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          We do not claim a legal guarantee that no AI was ever used at any
          step of any listed work. Verification is an honest, human review of
          the materials the creator provided, and we describe on each profile
          exactly what that review covered. Read more in{" "}
          <Link href="/human-made-standards" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Human-Made standards
          </Link>{" "}
          and{" "}
          <Link href="/verified" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Verification
          </Link>
          .
        </p>

        <div className="mt-12 flex flex-wrap gap-2">
          <Link href="/directory" className="btn btn-quiet">
            Browse the catalog
          </Link>
          <Link href="/join" className="btn btn-ink">
            Add your profile
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
