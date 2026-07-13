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
        process shown to us. It is not a legal guarantee.
      </p>

      {/* Careful wording (TZ 4.3) */}
      <div
        className="mt-6 rounded-xl border p-4 text-[0.9rem]"
        style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)", color: "var(--color-muted)" }}
      >
        Verified based on submitted materials · Human-made process reviewed ·
        Creator identity and process reviewed.
      </div>

      {/* How verification works */}
      <div className="mt-10">
        <h2 className="!text-[1.35rem]">How verification works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "1. Submit materials",
              d: "Creators send process photos or video, sketches, drafts, published work, or anything that shows how the work is made.",
            },
            {
              t: "2. Reviewed by hand",
              d: "We look at the materials, check that they line up with the profile, and decide whether the review supports a verified badge.",
            },
            {
              t: "3. What was checked appears on the profile",
              d: "The profile shows a short description of what we actually reviewed — no vague claims, no legal guarantees.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--color-line)" }}
            >
              <h3 className="text-[1rem]">{item.t}</h3>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
                {item.d}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          Two badges are used: Verified Human Creator (for individuals) and
          Verified Human-Made Business (for studios and companies).
        </p>
      </div>

      <div className="mt-10">
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
