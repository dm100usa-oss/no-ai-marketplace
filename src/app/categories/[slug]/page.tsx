import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getCategory,
  getProfilesByCategory,
  directionOfCategory,
} from "@/lib/data";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProfileGrid } from "@/components/ProfileGrid";

/** One static page per category (TZ 3.3: each category an indexable page). */
export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: cat.seoTitle ?? cat.name,
    description: cat.seoDescription ?? cat.shortDescription,
    alternates: { canonical: `/categories/${cat.slug}` },
    openGraph: {
      title: cat.seoTitle ?? cat.name,
      description: cat.seoDescription ?? cat.shortDescription,
      url: `${site.url}/categories/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const dir = directionOfCategory(cat.slug);
  const list = getProfilesByCategory(cat.slug);
  const featured = list.filter((p) => p.status === "featured" || p.featured);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = list.filter((p) => !featuredSlugs.has(p.slug));

  // CollectionPage + ItemList (TZ 5.3)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.seoDescription ?? cat.shortDescription,
    url: `${site.url}/categories/${cat.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/creators/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          ...(dir ? [{ label: dir.name, href: `/directions/${dir.slug}` }] : []),
          { label: cat.name },
        ]}
      />

      <h1>{cat.name}</h1>
      {cat.seoText && <p className="lead mt-3 max-w-3xl">{cat.seoText}</p>}

      {/* Featured leaders inside this category (TZ 3.4). */}
      {featured.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="!text-[1.35rem]">Featured in {cat.name.toLowerCase()}</h2>
            <span className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
              Leaders picked by hand
            </span>
          </div>
          <ProfileGrid profiles={featured} />
        </div>
      )}

      <div className="mt-10">
        <h2 className="!text-[1.35rem]">All profiles in this category</h2>
        <p className="mb-5 mt-2 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {rest.length} {rest.length === 1 ? "profile" : "profiles"}
        </p>
        <ProfileGrid
          profiles={rest}
          emptyTitle={`No ${cat.name.toLowerCase()} yet`}
          emptyMessage="This category is ready and waiting for its first profiles. Add yours."
        />
      </div>
    </div>
  );
}
