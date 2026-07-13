import type { Metadata } from "next";
import { getAllProfiles, getNewestProfiles } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";

export const metadata: Metadata = {
  title: "Directory",
  description:
    "All active human-made creators and companies on No AI Marketplace. Browse people and studios who create without AI.",
  alternates: { canonical: "/directory" },
};

export default function DirectoryPage() {
  const all = getNewestProfiles(); // newest first
  const total = getAllProfiles().length;

  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Directory" }]} />

      <h1>Directory</h1>
      <p className="lead mt-3 max-w-3xl">
        Every active profile in the catalog — people, studios and companies who
        create work, products and services without AI. Each card links straight
        to the creator&apos;s own platform.
      </p>

      <div className="mt-8">
        <p className="mb-5 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {total} {total === 1 ? "profile" : "profiles"}
        </p>
        <ProfileGrid profiles={all} />
      </div>

      <p className="mt-8 text-center text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
        Search and filters are added on stage 3.
      </p>
    </div>
  );
}
