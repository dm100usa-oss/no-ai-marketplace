import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getActiveDirections,
  getDirection,
  getCategoriesByDirection,
  getProfilesByDirection,
  getProfilesByCategory,
} from "@/lib/data";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { ArrowRight } from "@/components/icons";

/** Static params — one page per active direction (TZ: static priority). */
export function generateStaticParams() {
  return getActiveDirections().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dir = getDirection(slug);
  if (!dir) return {};
  return {
    title: dir.seoTitle ?? dir.name,
    description: dir.seoDescription ?? dir.shortDescription,
    alternates: { canonical: `/directions/${dir.slug}` },
    openGraph: {
      title: dir.seoTitle ?? dir.name,
      description: dir.seoDescription ?? dir.shortDescription,
      url: `${site.url}/directions/${dir.slug}`,
    },
  };
}

export default async function DirectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dir = getDirection(slug);
  if (!dir || !dir.active) notFound();

  const cats = getCategoriesByDirection(dir.slug);
  const featured = getProfilesByDirection(dir.slug).filter(
    (p) => p.status === "featured" || p.featured
  );

  return (
    <div className="container-page section">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Directions", href: "/directions" },
          { label: dir.name },
        ]}
      />

      <h1>{dir.name}</h1>
      {dir.seoText && <p className="lead mt-3 max-w-3xl">{dir.seoText}</p>}

      {/* Categories in this direction */}
      <div className="mt-10">
        <SectionHeading title="Categories" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => {
            const n = getProfilesByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="card card-hover flex items-center justify-between p-4"
              >
                <span>
                  <span className="block font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {c.name}
                  </span>
                  {c.shortDescription && (
                    <span className="mt-0.5 block text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                      {c.shortDescription}
                    </span>
                  )}
                </span>
                <span className="shrink-0 pl-3" style={{ color: "var(--color-muted-soft)" }}>
                  <span className="mr-2 text-[0.85rem]">{n}</span>
                  <ArrowRight size={18} className="inline" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured in this direction */}
      {featured.length > 0 && (
        <div className="mt-14">
          <SectionHeading title={`Featured in ${dir.name}`}>
            Leaders picked by hand.
          </SectionHeading>
          <ProfileGrid profiles={featured} />
        </div>
      )}
    </div>
  );
}
