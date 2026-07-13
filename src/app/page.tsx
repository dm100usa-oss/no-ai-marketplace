import Link from "next/link";
import { site } from "@/lib/config";
import { DirectionTile } from "@/components/DirectionTile";
import { CreatorCard } from "@/components/CreatorCard";
import { SectionHeading } from "@/components/States";
import { SearchIcon, ArrowRight } from "@/components/icons";
import type { Profile } from "@/lib/types";

/**
 * Stage 1 home = a live shell, not the full home (that is stage 3).
 * Its job here: render the semantic core in static HTML (TZ Part I,
 * critical for SEO/GEO) and put the whole design system on screen so
 * the owner can approve colours and sizing visually.
 *
 * The demo directions and cards below are placeholders for stage 1
 * approval only; stage 2 replaces them with data-driven content.
 */

const demoDirections = [
  { slug: "art-and-illustration", title: "Art & Illustration", color: "art" as const, subtitle: "Illustrators, fine artists" },
  { slug: "writing-and-publishing", title: "Writing & Publishing", color: "writing" as const, subtitle: "Writers, editors" },
  { slug: "design-and-branding", title: "Design & Branding", color: "design" as const, subtitle: "Logo & graphic design" },
  { slug: "photography-and-video", title: "Photography & Video", color: "photo" as const, subtitle: "Photographers, video" },
];

const demoCard: Profile = {
  id: "demo-1",
  slug: "demo-creator",
  name: "Sample Creator",
  profileType: "creator",
  status: "featured",
  verificationStatus: "verified-creator",
  mainCategory: "illustrators",
  direction: "art-and-illustration",
  country: "United States",
  city: "Portland",
  shortDescription:
    "Hand-drawn children's book illustration in watercolour and ink. Every piece drawn by hand, no AI.",
  tags: ["Watercolour", "Children's books"],
  socialLinks: { portfolio: "#" },
  featured: true,
  dateCreated: "2025-01-01",
};

const demoCard2: Profile = {
  ...demoCard,
  id: "demo-2",
  slug: "demo-creator-2",
  name: "Human Design Studio",
  profileType: "company",
  status: "paid",
  verificationStatus: "verified-business",
  mainCategory: "graphic-designers",
  direction: "design-and-branding",
  country: "Portugal",
  shortDescription: "Brand identity and packaging designed entirely by people. Sketches available on request.",
  tags: ["Branding", "Packaging"],
  socialLinks: { website: "#" },
  featured: false,
};

export default function HomePage() {
  return (
    <>
      {/* ---- Hero: semantic core in static HTML (TZ Part I) ---- */}
      <section className="section-brand">
        <div className="container-page py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            {/* The three lines — central block of the first screen */}
            <h1 className="text-balance">
              {site.name}
            </h1>
            <p className="mt-3 text-[1.35rem] font-bold md:text-[1.6rem]" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
              {site.tagline}
            </p>
            <p className="mt-1 text-[1.05rem] italic" style={{ color: "var(--color-muted)" }}>
              {site.slogan}
            </p>

            {/* Search + primary actions, visible without scroll */}
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {demoDirections.map((d) => (
              <DirectionTile key={d.slug} href={`/directions/${d.slug}`} title={d.title} color={d.color} subtitle={d.subtitle} />
            ))}
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

      {/* ---- Featured creators (design-system demo cards) ---- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading title="Featured creators" action={{ href: "/directory", label: "See all" }}>
            Leaders are picked by hand and rise to the top.
          </SectionHeading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CreatorCard profile={demoCard} categoryName="Children's Book Illustrator" />
            <CreatorCard profile={demoCard2} categoryName="Graphic Designer" />
          </div>
          <p className="mt-6 text-center text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
            Preview content for design approval. Real profiles are added on stage 2.
          </p>
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
