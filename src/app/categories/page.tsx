import type { Metadata } from "next";
import Link from "next/link";
import {
  getActiveDirections,
  getCategoriesByDirection,
  getProfilesByCategory,
} from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "All categories",
  description:
    "Every category on No AI Marketplace, grouped by direction. Find human-made creators by exactly what they do.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const dirs = getActiveDirections();

  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All categories" }]} />

      <h1>All categories</h1>
      <p className="lead mt-3 max-w-2xl">
        Every category across all directions, each with its own page. Find human
        creators by exactly what they make.
      </p>

      <div className="mt-10 space-y-12">
        {dirs.map((dir) => {
          const cats = getCategoriesByDirection(dir.slug);
          if (cats.length === 0) return null;
          return (
            <section key={dir.slug}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[1.3rem]">{dir.name}</h2>
                <Link
                  href={`/directions/${dir.slug}`}
                  className="text-[0.9rem] font-semibold"
                  style={{ color: "var(--color-accent)" }}
                >
                  View direction →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cats.map((c) => {
                  const n = getProfilesByCategory(c.slug).length;
                  return (
                    <Link key={c.slug} href={`/categories/${c.slug}`} className="card card-hover p-4">
                      <span className="block font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                        {c.name}
                      </span>
                      <span className="mt-1 block text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                        {n} {n === 1 ? "profile" : "profiles"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
