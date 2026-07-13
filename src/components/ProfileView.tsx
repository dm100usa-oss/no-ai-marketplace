import Link from "next/link";
import type { Profile } from "@/lib/types";
import { site } from "@/lib/config";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerifiedBadge, FeaturedBadge } from "@/components/Badges";
import { ExternalLink } from "@/components/icons";
import {
  categoryName,
  getCategory,
  directionOfCategory,
  resolveVisit,
} from "@/lib/data";

/**
 * Shared profile view for creators and companies. Stage 2 fills the core
 * (identity, category, country, description, tags, external links, AI
 * statement, verification). The full page (portfolio, gallery, video,
 * services grid, complaint form, related profiles) is finished on stage 4;
 * fields are already in the model, so no rebuild is needed.
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
        {/* Main column */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-[1.3rem] font-bold text-white"
              style={{ background: "var(--color-ink)", fontFamily: "var(--font-display)" }}
            >
              {initials}
            </span>
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

          {/* Work image placeholder (owner supplies real images later) */}
          <div
            className="mt-6 grid aspect-[16/9] w-full place-items-center rounded-2xl"
            style={{ background: "var(--color-brand-soft)", color: "var(--color-muted-soft)" }}
          >
            <span className="text-[0.85rem]">Human-made work</span>
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
          {(p.services?.length || p.products?.length) && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {p.services?.length ? (
                <div>
                  <h3 className="mb-2">Services</h3>
                  <ul className="space-y-1.5">
                    {p.services.map((s) => (
                      <li key={s} className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
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
                      <li key={s} className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          {/* AI statement */}
          {p.aiUsageStatement && (
            <div
              className="mt-8 rounded-xl border p-4"
              style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
            >
              <h3 className="mb-1 text-[1rem]">On the use of AI</h3>
              <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {p.aiUsageStatement}
              </p>
            </div>
          )}

          {/* Verification detail */}
          {p.verificationStatus !== "none" && p.verificationDescription && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--color-line)" }}>
              <div className="mb-1 flex items-center gap-2">
                <VerifiedBadge status={p.verificationStatus} />
              </div>
              <p className="text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                {p.verificationDescription}
              </p>
              <Link href="/verified" className="mt-2 inline-block text-[0.9rem] font-semibold" style={{ color: "var(--color-accent)" }}>
                How verification works →
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar: visit + links + tags */}
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

            {externalLinks.length > 1 && (
              <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <p className="text-[0.8rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  Links
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
            )}

            {p.languages?.length ? (
              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <p className="text-[0.8rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
                  Languages
                </p>
                <p className="mt-1 text-[0.92rem]" style={{ color: "var(--color-muted)" }}>
                  {p.languages.join(", ")}
                </p>
              </div>
            ) : null}

            {p.tags?.length ? (
              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
                <div className="flex flex-wrap gap-1.5">
                  <span className="pill">{p.country}</span>
                  {p.tags.map((t) => (
                    <span key={t} className="pill">{t}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <p className="mt-3 px-1 text-[0.8rem]" style={{ color: "var(--color-muted-soft)" }}>
            Purchases and enquiries happen on the creator&apos;s own platform, not here.
          </p>
        </aside>
      </div>
    </div>
  );
}

function collectLinks(p: Profile): { label: string; href: string }[] {
  const s = p.socialLinks;
  const out: { label: string; href: string }[] = [];
  if (s.website) out.push({ label: "Website", href: s.website });
  if (s.portfolio) out.push({ label: "Portfolio", href: s.portfolio });
  if (s.etsy) out.push({ label: "Etsy", href: s.etsy });
  if (s.amazon) out.push({ label: "Amazon", href: s.amazon });
  if (s.behance) out.push({ label: "Behance", href: s.behance });
  if (s.dribbble) out.push({ label: "Dribbble", href: s.dribbble });
  if (s.linkedin) out.push({ label: "LinkedIn", href: s.linkedin });
  if (s.instagram) out.push({ label: "Instagram", href: s.instagram });
  if (s.youtube) out.push({ label: "YouTube", href: s.youtube });
  (s.other ?? []).forEach((o) => out.push({ label: o.label, href: o.url }));
  return out;
}
