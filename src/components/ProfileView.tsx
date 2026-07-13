import Link from "next/link";
import type { Profile } from "@/lib/types";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerifiedBadge, FeaturedBadge } from "@/components/Badges";
import { CreatorCard } from "@/components/CreatorCard";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { ReportForm } from "@/components/ReportForm";
import { ExternalLink, ArrowRight, CheckShield } from "@/components/icons";
import {
  categoryName,
  getAllProfiles,
  getCategory,
  directionOfCategory,
  resolveVisit,
} from "@/lib/data";

/**
 * Full profile view (TZ Etap 4). Covers every field on the profile:
 * identity, category, country, description, services and products,
 * portfolio and gallery, video, languages, working process, AI statement,
 * verification detail, all external links, Visit buttons, related profiles
 * in the same category, and a report form. Same component powers both
 * creator and company pages — profileType only changes JSON-LD.
 */
export function ProfileView({ profile: p }: { profile: Profile }) {
  const dir = directionOfCategory(p.mainCategory);
  const cat = getCategory(p.mainCategory);
  const visit = resolveVisit(p);
  const basePath = p.profileType === "company" ? "/companies" : "/creators";

  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Person / Organization + ProfilePage (TZ 5.3)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": p.profileType === "company" ? "Organization" : "Person",
      name: p.name,
      description: p.shortDescription,
      address: { "@type": "PostalAddress", addressCountry: p.country, addressLocality: p.city },
      url: `${site.url}${basePath}/${p.slug}`,
    },
  };

  const externalLinks = collectLinks(p);
  const relatedProfiles = getRelatedProfiles(p, 3);
  const workingProcess = deriveWorkingProcess(p);

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
          ...(dir ? [{ label: dir.name, href: `/directions/${dir.slug}` }] : []),
          ...(cat ? [{ label: cat.name, href: `/categories/${cat.slug}` }] : []),
          { label: p.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* ------------------------- Main column ------------------------- */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-4">
            {p.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatar}
                alt={`Portrait of ${p.name}`}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-[1.3rem] font-bold text-white"
                style={{ background: "var(--color-ink)", fontFamily: "var(--font-display)" }}
              >
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[1.75rem] leading-tight">{p.name}</h1>
                <FeaturedBadge status={p.status} />
                <VerifiedBadge status={p.verificationStatus} />
              </div>
              <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {cat ? cat.name : categoryName(p.mainCategory)}
                {" · "}
                {p.city ? `${p.city}, ` : ""}
                {p.country}
              </p>
            </div>
          </div>

          {/* Main work image / hero */}
          <div
            className="mt-6 grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-2xl"
            style={{ background: "var(--color-brand-soft)", color: "var(--color-muted-soft)" }}
          >
            {p.mainImage ? (
              <GalleryLightbox
                images={
                  p.gallery?.length
                    ? Array.from(new Set([p.mainImage, ...p.gallery]))
                    : [p.mainImage]
                }
                name={p.name}
                variant="hero"
                heroAlt={`Featured work by ${p.name}`}
              />
            ) : (
              <span className="text-[0.85rem]">Human-made work</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-[1.05rem]" style={{ color: "var(--color-ink)" }}>
              {p.shortDescription}
            </p>
            {p.fullDescription && (
              <p className="mt-3 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
                {p.fullDescription}
              </p>
            )}
          </div>

          {/* Services / products */}
          {(p.services?.length || p.products?.length) ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {p.services?.length ? (
                <div>
                  <h3 className="mb-2">Services</h3>
                  <ul className="space-y-1.5">
                    {p.services.map((s) => (
                      <li key={s} className="flex gap-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                        <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {p.products?.length ? (
                <div>
                  <h3 className="mb-2">Products</h3>
                  <ul className="space-y-1.5">
                    {p.products.map((s) => (
                      <li key={s} className="flex gap-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                        <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Portfolio / gallery */}
          {p.gallery?.length ? (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">Portfolio</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                A selection of recent work. Tap any piece to view it full screen.
              </p>
              <GalleryLightbox images={p.gallery} name={p.name} />
            </div>
          ) : null}

          {/* Video links */}
          {p.videoLinks?.length ? (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">Video</h2>
              <ul className="mt-3 space-y-2">
                {p.videoLinks.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-2 text-[0.95rem] font-semibold"
                      style={{ color: "var(--color-accent)" }}
                    >
                      Watch on external platform
                      <ExternalLink size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Working process */}
          {workingProcess.length > 0 && (
            <div className="mt-10">
              <h2 className="!text-[1.35rem]">Working process</h2>
              <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted-soft)" }}>
                How {p.profileType === "company" ? "the studio" : "the creator"} typically works with clients.
              </p>
              <ol className="mt-4 space-y-3">
                {workingProcess.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.85rem] font-bold text-white"
                      style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
                    >
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[0.98rem]" style={{ color: "var(--color-muted)" }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* AI statement */}
          {p.aiUsageStatement && (
            <div
              className="mt-10 rounded-xl border p-4"
              style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
            >
              <h3 className="mb-1 text-[1rem]">On the use of AI</h3>
              <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {p.aiUsageStatement}
              </p>
            </div>
          )}

          {/* Verification detail */}
          {p.verificationStatus !== "none" && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
              <div className="mb-2 flex items-center gap-2">
                <VerifiedBadge status={p.verificationStatus} />
                <span className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
                  Reviewed by hand
                </span>
              </div>
              {p.verificationDescription && (
                <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                  {p.verificationDescription}
                </p>
              )}
              <Link
                href="/verified"
                className="mt-2 inline-flex items-center gap-1 text-[0.9rem] font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                How verification works <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Related profiles in the same category */}
          {relatedProfiles.length > 0 && (
            <div className="mt-12">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="!text-[1.35rem]">
                  More in {cat ? cat.name.toLowerCase() : "this category"}
                </h2>
                {cat && (
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-[0.9rem] font-semibold"
                    style={{ color: "var(--color-accent)" }}
                  >
                    See all →
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProfiles.map((rp) => (
                  <CreatorCard
                    key={rp.slug}
                    profile={rp}
                    categoryName={categoryName(rp.mainCategory)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Report a problem */}
          <div className="mt-12">
            <ReportForm profileName={p.name} profileSlug={`${basePath}/${p.slug}`} />
          </div>
        </div>

        {/* ------------------------- Sidebar ------------------------- */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="card p-5">
            <a
              href={visit.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn btn-accent btn-full"
            >
              {visit.label}
              <ExternalLink size={16} />
            </a>

            {externalLinks.length > 1 ? (
              <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <p className="mb-1 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  Where to find {p.profileType === "company" ? "them" : p.name.split(" ")[0]}
                </p>
                {externalLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-between text-[0.92rem]"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {l.label}
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            ) : null}

            {p.languages?.length ? (
              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <p className="mb-1 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  Languages
                </p>
                <p className="text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
                  {p.languages.join(", ")}
                </p>
              </div>
            ) : null}

            <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
              <div className="flex flex-wrap gap-1.5">
                <span className="pill">{p.country}</span>
                {(p.tags ?? []).map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            </div>

            <p
              className="mt-4 flex gap-2 border-t pt-4 text-[0.82rem]"
              style={{ color: "var(--color-muted-soft)", borderColor: "var(--color-line)" }}
            >
              <CheckShield size={14} className="mt-0.5 shrink-0" />
              Purchases and enquiries happen on the creator&apos;s own platform, not here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------- helpers ------------------------- */

function collectLinks(p: Profile): { label: string; href: string }[] {
  const s = p.socialLinks;
  const out: { label: string; href: string }[] = [];
  if (s.website) out.push({ label: "Website", href: s.website });
  if (s.portfolio) out.push({ label: "Portfolio", href: s.portfolio });
  if (s.etsy) out.push({ label: "Etsy shop", href: s.etsy });
  if (s.amazon) out.push({ label: "Amazon", href: s.amazon });
  if (s.behance) out.push({ label: "Behance", href: s.behance });
  if (s.dribbble) out.push({ label: "Dribbble", href: s.dribbble });
  if (s.linkedin) out.push({ label: "LinkedIn", href: s.linkedin });
  if (s.instagram) out.push({ label: "Instagram", href: s.instagram });
  if (s.youtube) out.push({ label: "YouTube", href: s.youtube });
  (s.other ?? []).forEach((o) => out.push({ label: o.label, href: o.url }));
  return out;
}

/** Same-category profiles excluding the current one, capped to `limit`. */
function getRelatedProfiles(p: Profile, limit: number): Profile[] {
  return getAllProfiles()
    .filter(
      (x) =>
        x.slug !== p.slug &&
        (x.mainCategory === p.mainCategory ||
          (x.additionalCategories ?? []).includes(p.mainCategory)),
    )
    .slice(0, limit);
}

/** A short working-process outline derived from the profile. Falls back to a
 *  sensible generic sequence when the profile hasn't declared its own. */
function deriveWorkingProcess(p: Profile): string[] {
  const kind = p.profileType === "company" ? "the studio" : "the creator";
  return [
    `You reach out on ${kind}'s own site or shop, using the links on this page.`,
    `You describe the project — goals, materials, timing — and get a scope and quote.`,
    `Work is done by hand, ${p.profileType === "company" ? "by the team" : "personally"}; process updates and drafts are shared as agreed.`,
    `Payment, delivery and revisions happen directly with ${kind}, not on No AI Marketplace.`,
  ];
}
