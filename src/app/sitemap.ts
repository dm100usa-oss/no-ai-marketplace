import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import {
  getAllDirections,
  getAllCategories,
  getAllProfiles,
} from "@/lib/data";

/**
 * Auto-generated sitemap (TZ 5.3 / stage 6). Everything indexable is
 * listed: static pages plus every direction, category and profile built
 * from data. Adding a profile or category regenerates the sitemap on the
 * next build — no manual edit.
 *
 * Payment / status pages are intentionally left out (they carry
 * robots: noindex) and so is the raw /directory search view.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/directory", priority: 0.9 },
    { path: "/categories", priority: 0.8 },
    { path: "/directions", priority: 0.8 },
    { path: "/verified", priority: 0.7 },
    { path: "/join", priority: 0.7 },
    { path: "/pricing", priority: 0.7 },
    { path: "/human-made-standards", priority: 0.6 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/listing-policy", priority: 0.3 },
    { path: "/verification-policy", priority: 0.3 },
    { path: "/refund-policy", priority: 0.3 },
    { path: "/content-removal", priority: 0.3 },
    { path: "/copyright-complaint", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: s.priority,
  }));

  const directionEntries: MetadataRoute.Sitemap = getAllDirections()
    .filter((d) => d.active)
    .map((d) => ({
      url: `${base}/directions/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const categoryEntries: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const profileEntries: MetadataRoute.Sitemap = getAllProfiles().map((p) => {
    const seg = p.profileType === "company" ? "companies" : "creators";
    return {
      url: `${base}/${seg}/${p.slug}`,
      lastModified: p.dateUpdated ? new Date(p.dateUpdated) : new Date(p.dateCreated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  return [
    ...staticEntries,
    ...directionEntries,
    ...categoryEntries,
    ...profileEntries,
  ];
}
