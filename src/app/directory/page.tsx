import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DirectoryClient } from "@/components/DirectoryClient";
import {
  getAllCategories,
  getActiveDirections,
  getAllProfiles,
  getCountries,
} from "@/lib/data";
import { buildSearchDocs, filtersFromParams } from "@/lib/search";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Directory",
  description:
    "Search and browse every active human-made creator, studio and company on No AI Marketplace. Filter by direction, category, country and verification.",
  alternates: { canonical: "/directory" },
};

/**
 * Directory — the single place to find any profile (TZ 3.1: search runs
 * alongside the tree). The page is a server component that ships the
 * profile list, categories, directions and a prebuilt search index to
 * the client, then hands off interactivity to DirectoryClient.
 */
export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  // Normalise (Next may hand back arrays for repeated keys).
  const flat: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) {
    flat[k] = Array.isArray(v) ? v[0] : v;
  }
  const initial = filtersFromParams(flat);

  const profiles = getAllProfiles();
  const categories = getAllCategories();
  const directions = getActiveDirections();
  const countries = getCountries();
  const docs = buildSearchDocs(profiles, categories, directions);

  // CollectionPage JSON-LD so the directory is understood as an index.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Directory",
    description:
      "Every active human-made creator and company on No AI Marketplace.",
    url: `${site.url}/directory`,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };

  return (
    <div className="container-page section">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Directory" }]} />

      <h1>Directory</h1>
      <p className="lead mt-3 max-w-3xl">
        Every active profile in the catalogue — people, studios and companies who
        create work, products and services without AI. Search by name, category
        or country, and open a card to jump straight to the creator&apos;s own
        platform.
      </p>

      <DirectoryClient
        profiles={profiles}
        docs={docs}
        directions={directions}
        categories={categories}
        countries={countries}
        initial={initial}
      />
    </div>
  );
}
