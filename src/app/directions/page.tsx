import type { Metadata } from "next";
import { getActiveDirections, getCategoriesByDirection } from "@/lib/data";
import { DirectionTile } from "@/components/DirectionTile";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Directions",
  description:
    "Browse the major directions of No AI Marketplace: art, writing, design, photography — people and studios who create without AI.",
  alternates: { canonical: "/directions" },
};

export default function DirectionsPage() {
  const dirs = getActiveDirections();

  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Directions" }]} />

      <h1>Directions</h1>
      <p className="lead mt-3 max-w-2xl">
        The major directions of the catalog. Each one opens into its categories,
        where you find people and studios who create without AI.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dirs.map((d) => {
          const count = getCategoriesByDirection(d.slug).length;
          return (
            <DirectionTile
              key={d.slug}
              href={`/directions/${d.slug}`}
              title={d.name}
              color={d.color}
              subtitle={`${count} ${count === 1 ? "category" : "categories"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
