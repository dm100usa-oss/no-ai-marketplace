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

      <div className="mt-8">
        <p className="mb-5 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {list.length} {list.length === 1 ? "profile" : "profiles"}
        </p>
        <ProfileGrid
          profiles={list}
          emptyTitle={`No ${cat.name.toLowerCase()} yet`}
          emptyMessage="This category is ready and waiting for its first profiles. Add yours."
        />
      </div>
    </div>
  );
}
