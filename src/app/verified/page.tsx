import type { Metadata } from "next";
import { getVerifiedProfiles } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";

export const metadata: Metadata = {
  title: "Verified profiles",
  description:
    "Creators and businesses reviewed based on submitted materials. Verified human-made process on No AI Marketplace.",
  alternates: { canonical: "/verified" },
};

export default function VerifiedPage() {
  const list = getVerifiedProfiles();

  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Verified profiles" }]} />

      <h1>Verified profiles</h1>
      <p className="lead mt-3 max-w-3xl">
        These creators and businesses have been reviewed based on submitted
        materials. Verification is done by hand and reflects the human-made
        process shown to us. It is not a legal guarantee — full rules are on the
        verification page.
      </p>

      {/* Careful wording (TZ 4.3) */}
      <div
        className="mt-6 rounded-xl border p-4 text-[0.9rem]"
        style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)", color: "var(--color-muted)" }}
      >
        Verified based on submitted materials · Human-made process reviewed ·
        Creator identity and process reviewed.
      </div>

      <div className="mt-8">
        <p className="mb-5 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {list.length} verified {list.length === 1 ? "profile" : "profiles"}
        </p>
        <ProfileGrid
          profiles={list}
          emptyTitle="No verified profiles yet"
          emptyMessage="Verified creators will appear here as materials are reviewed."
        />
      </div>
    </div>
  );
}
