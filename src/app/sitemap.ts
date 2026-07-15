import type { MetadataRoute } from "next";
import { profileBasePath } from "@/lib/profile-path";
import { site } from "@/lib/config";
import { getAllDirections, getAllCategories, getAllProfiles } from "@/lib/data";
import { FAQ_PROFESSION_SLUGS } from "@/i18n/data/faqProfessions";
import { LOCALES, localizedPath } from "@/i18n/config";

/**
 * Auto-generated sitemap. Every indexable page is emitted once per
 * language (English at the clean root, Russian under /ru), and each entry
 * carries hreflang alternates so search and AI engines see the language
 * pairing. Adding a profile, category or language regenerates the sitemap
 * on the next build with no manual edit.
 *
 * Payment / status pages are left out (they are noindex) and so is the raw
 * /directory search view beyond its landing page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  // Canonical (unprefixed) paths with a priority and change frequency.
  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/directory", priority: 0.9 },
    { path: "/categories", priority: 0.8 },
    { path: "/directions", priority: 0.8 },
    { path: "/verified", priority: 0.7 },
    { path: "/join", priority: 0.7 },
    { path: "/pricing", priority: 0.7 },
    { path: "/method", priority: 0.6 },
    { path: "/why-us", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
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

  const directionPaths = getAllDirections()
    .filter((d) => d.active)
    .map((d) => ({ path: `/directions/${d.slug}`, priority: 0.7 }));

  const categoryPaths = getAllCategories().map((c) => ({
    path: `/categories/${c.slug}`,
    priority: 0.7,
  }));

  // One FAQ page per profession. These are the pages built to be found:
  // narrow questions that AI engines answer by citing whoever wrote the
  // answer. They rank above the /faq hub on purpose, so they carry a
  // higher priority than the hub's 0.6.
  const faqProfessionPaths = FAQ_PROFESSION_SLUGS.map((slug) => ({
    path: `/faq/${slug}`,
    priority: 0.7,
  }));

  // Demo profiles are placeholders, not real people — they carry noindex
  // and stay out of the sitemap so they never compete with real entries.
  const profileEntries = getAllProfiles()
    .filter((p) => !p.demo)
    .map((p) => {
      const seg = profileBasePath(p.profileType).slice(1);
      return {
        path: `/${seg}/${p.slug}`,
        priority: 0.6,
        lastModified: p.dateUpdated ? new Date(p.dateUpdated) : new Date(p.dateCreated),
        changeFrequency: "monthly" as const,
      };
    });

  // Build hreflang alternates for a canonical path.
  const alternatesFor = (path: string) => {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) {
      languages[l] = `${base}${localizedPath(l, path)}`;
    }
    return { languages };
  };

  // Emit one entry per language for a canonical path.
  const expand = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    lastModified: Date,
  ): MetadataRoute.Sitemap =>
    LOCALES.map((l) => ({
      url: `${base}${localizedPath(l, path)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: alternatesFor(path),
    }));

  const entries: MetadataRoute.Sitemap = [
    ...staticPaths.flatMap((s) => expand(s.path, s.priority, "weekly", now)),
    ...directionPaths.flatMap((s) => expand(s.path, s.priority, "weekly", now)),
    ...categoryPaths.flatMap((s) => expand(s.path, s.priority, "weekly", now)),
    ...faqProfessionPaths.flatMap((s) => expand(s.path, s.priority, "weekly", now)),
    ...profileEntries.flatMap((s) => expand(s.path, s.priority, s.changeFrequency, s.lastModified)),
  ];

  return entries;
}
