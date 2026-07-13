import Link from "next/link";
import { site } from "@/lib/config";
import { DirectionTile } from "@/components/DirectionTile";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { SearchIcon, ArrowRight } from "@/components/icons";
import {
  getActiveDirections,
  getCategoriesByDirection,
  getFeaturedProfiles,
  getNewestProfiles,
} from "@/lib/data";

/**
 * Home. Semantic core in static HTML (TZ Part I) plus data-driven blocks:
 * directions, featured and newest profiles. The full home build (FAQ,
 * buyer/creator blocks, richer sections) lands on stage 3.
 */
export default function HomePage() {
  const dirs = getActiveDirections();
  const featured = getFeaturedProfiles().slice(0, 6);
  const newest = getNewestProfiles(6);

  return (
    <>
      {/* ---- Hero: semantic core in static HTML (TZ Part I) ---- */}
      <section className="section-brand">
        <div className="container-page py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance">{site.name}</h1>
            <p
              className="mt-3 text-[1.35rem] font-bold md:text-[1.6rem]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {site.tagline}
            </p>
            <p className="mt-1 text-[1.05rem] italic" style={{ color: "var(--color-muted)" }}>
              {site.slogan}
            </p>

            <form action="/directory" role="search" className="mx-auto mt-8 flex max-w-xl items-stretch gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-soft)" }}>
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  name="q"
                  placeholder="children's book illustrations, handmade scarves…"
                  aria-label="Search creators"
                  className="h-12 w-full rounded-xl border pl-11 pr-3 outline-none focus:border-[var(--color-accent)]"
                  style={{ borderColor: "var(--color-line)", background: "#fff" }}
                />
              </div>
              <button type="submit" className="btn btn-accent" aria-label="Search">
                <SearchIcon />
              </button>
            </form>

            <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2 sm:flex-row">
              <Link href="/directory" className="btn btn-quiet btn-full">Browse catalog</Link>
              <Link href="/join" className="btn btn-ink btn-full">Add profile</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Explore directions ---- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading title="Explore directions" action={{ href: "/directions", label: "All directions" }}>
            Find people, studios and companies who create without AI.
          </SectionHeading>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
      </section>

      {/* ---- How it works ---- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading title="How the platform works" />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { t: "Human creators", d: "Every profile is a real person, studio or company whose work is made by people, not AI." },
              { t: "Direct to their platform", d: "You browse here, then go straight to the creator's own site, shop or portfolio. Purchases happen there." },
              { t: "Honest verification", d: "Creators can submit materials to earn a verified badge, reviewed by hand." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold text-white"
                  style={{ background: "var(--color-accent)", fontFamily: "var(--font-display)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3>{item.t}</h3>
                  <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured creators ---- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading title="Featured creators" action={{ href: "/directory", label: "See all" }}>
            Leaders are picked by hand and rise to the top.
          </SectionHeading>
          <ProfileGrid profiles={featured} />
        </div>
      </section>

      {/* ---- New profiles ---- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading title="New profiles" action={{ href: "/directory", label: "Browse all" }}>
            Recently added human creators and companies.
          </SectionHeading>
          <ProfileGrid profiles={newest} />
        </div>
      </section>

      {/* ---- Creator CTA ---- */}
      <section className="section-dark section">
        <div className="container-page text-center">
          <h2 className="text-white">Are you a human creator?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            The first {site.freeSlots} profiles are free. Get found by buyers looking for work made by people.
          </p>
          <Link href="/join" className="btn btn-accent btn-lg mt-6">
            Add your profile
            <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
