import Link from "next/link";
import { site } from "@/lib/config";
import { DirectionTile } from "@/components/DirectionTile";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SectionHeading } from "@/components/States";
import { FAQ, type FAQItem } from "@/components/FAQ";
import {
  SearchIcon,
  ArrowRight,
  CheckShield,
  UsersIcon,
  HandshakeIcon,
  SparkIcon,
} from "@/components/icons";
import {
  getActiveDirections,
  getAllCategories,
  getCategoriesByDirection,
  getFeaturedProfiles,
  getNewestProfiles,
  directionOfCategory,
} from "@/lib/data";

/**
 * Home page — TZ 5.5 layout (mobile-first, Fiverr-like structure,
 * ash-blue instead of green): semantic core in static HTML, then
 * directions, popular categories, how-it-works, featured, newest,
 * buyers/creators/verification blocks, FAQ, closing CTA.
 * All copy is meaningful English text so search engines and generative
 * AI understand what the site is about at first render.
 */
export default function HomePage() {
  const dirs = getActiveDirections();
  const featured = getFeaturedProfiles().slice(0, 6);
  const newest = getNewestProfiles(6);

  // Popular categories: first 8 categories that actually have profiles behind
  // them. Enough to fill a 2×4 grid on mobile, one row on desktop.
  const popularCategories = getAllCategories().slice(0, 8).map((c) => ({
    ...c,
    direction: directionOfCategory(c.slug),
  }));

  const faqItems: FAQItem[] = [
    {
      q: "What is No AI Marketplace?",
      a: "An international directory of people, studios and companies whose work is made by humans, not by AI. You browse here, then visit the creator's own site or shop to buy or hire — the site is a showcase, not a shopping cart.",
    },
    {
      q: "How do I find a creator?",
      a: "Two ways: search from the top of any page, or browse the Directory tree by direction and category. Both lead to the same creator cards.",
    },
    {
      q: "Do I buy things on this site?",
      a: "No. Every card links to the creator's own website, shop or portfolio — Etsy, Behance, Amazon, their personal site and so on. Payments, delivery and communication all happen there, directly with the creator.",
    },
    {
      q: "What does “verified” mean?",
      a: "Verified profiles have submitted materials — process photos or video, sketches, drafts, published work — that were reviewed by hand. We describe what was reviewed on each profile. It is a good-faith review, not a legal guarantee.",
    },
    {
      q: "How do I add my profile?",
      a: `The first ${site.freeSlots} profiles are free. After that, listings are ${"$5.99/month or $49/year"}. You fill out one form, choose a plan and submit materials for review. Full instructions on the Add Your Profile page.`,
    },
    {
      q: "Is AI-generated work allowed?",
      a: "The catalogue is focused on human-made work. Creators state their AI usage openly on their profile. Fully AI-generated listings are not accepted; hybrid work is accepted when the human contribution is the substance of the work and is stated clearly.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ---------- Hero: semantic core in static HTML (TZ Part I) ---------- */}
      <section
        className="section-brand relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      >
        <div className="container-page py-14 md:py-20">
          <div
            className="mx-auto max-w-2xl rounded-3xl px-4 py-6 text-center md:px-8 md:py-8"
            style={{
              // soft translucent panel behind the text so the three lines
              // stay perfectly readable over the photo on every screen size;
              // the picture's calm centre means the panel is barely visible.
              background: "rgba(219,233,255,0.60)",
              backdropFilter: "blur(2px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.webp"
              alt="No AI Marketplace logo"
              width={64}
              height={64}
              className="mx-auto mb-4 h-16 w-16 rounded-2xl"
            />
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
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-muted-soft)" }}
                >
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
              <Link href="/directory" className="btn btn-quiet btn-full">
                Browse catalog
              </Link>
              <Link href="/join" className="btn btn-ink btn-full">
                Add profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Explore directions ---------- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            title="Explore directions"
            action={{ href: "/directions", label: "All directions" }}
          >
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

      {/* ---------- Popular categories ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading
            title="Popular categories"
            action={{ href: "/categories", label: "See all" }}
          >
            Straight to the specialisation you need.
          </SectionHeading>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-xl border bg-white px-4 py-3 transition-colors hover:border-[var(--color-accent)]"
                style={{ borderColor: "var(--color-line)" }}
              >
                <div
                  className="text-[0.72rem] font-semibold uppercase tracking-wide"
                  style={{ color: c.direction ? `var(--color-dir-${c.direction.color}-ink)` : "var(--color-muted-soft)" }}
                >
                  {c.direction?.name ?? "Category"}
                </div>
                <div
                  className="mt-1 text-[0.98rem] font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {c.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How the platform works ---------- */}
      <section className="section">
        <div className="container-page">
          <SectionHeading title="How the platform works">
            A showcase for human creators, with the actual work happening on their own platforms.
          </SectionHeading>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <UsersIcon />,
                t: "Human creators",
                d: "Every profile belongs to a real person, studio or company whose work is made by people, not AI.",
              },
              {
                icon: <HandshakeIcon />,
                t: "Direct to their platform",
                d: "Cards link straight to the creator's own site, shop or portfolio. Buying and messaging happen there.",
              },
              {
                icon: <CheckShield size={22} />,
                t: "Honest verification",
                d: "Creators can submit process photos, drafts and published work. We review by hand and describe what was checked.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: "var(--color-brand-soft)", color: "var(--color-accent)" }}
                >
                  {item.icon}
                </span>
                <div>
                  <h3>{item.t}</h3>
                  <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Featured creators ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading
            title="Featured creators"
            action={{ href: "/directory?sort=featured", label: "See all" }}
          >
            Leaders picked by hand rise to the top of the catalogue.
          </SectionHeading>
          <ProfileGrid profiles={featured} />
        </div>
      </section>

      {/* ---------- For buyers & For creators ---------- */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Buyers */}
            <div
              className="flex flex-col rounded-2xl border p-6 md:p-8"
              style={{ borderColor: "var(--color-line)", background: "#fff" }}
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: "var(--color-brand-soft)", color: "var(--color-accent)" }}
              >
                <SearchIcon />
              </span>
              <h2 className="mt-4">For buyers and clients</h2>
              <p className="mt-3" style={{ color: "var(--color-muted)" }}>
                Looking for illustration, writing, design or photography made by
                a real person? Search or browse the catalogue, open the profile
                that fits, and go straight to the creator&apos;s own site to talk
                or buy.
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                <li className="flex gap-2">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  Every profile is a real human creator or human-made business.
                </li>
                <li className="flex gap-2">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  No middleman, no in-site checkout — you deal with the creator directly.
                </li>
                <li className="flex gap-2">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  Verified profiles show exactly what was reviewed.
                </li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/directory" className="btn btn-quiet">
                  Browse the catalog
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Creators */}
            <div
              className="flex flex-col rounded-2xl border p-6 md:p-8"
              style={{
                borderColor: "var(--color-brand)",
                background: "var(--color-brand-soft)",
              }}
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl bg-white"
                style={{ color: "var(--color-accent)" }}
              >
                <SparkIcon />
              </span>
              <h2 className="mt-4">For creators and companies</h2>
              <p className="mt-3" style={{ color: "var(--color-muted)" }}>
                If your work is made by humans, be found by buyers who value
                that. Add your profile with links to your own site, shop or
                portfolio — traffic goes to you, not to a middleman.
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
                <li className="flex gap-2">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  The first {site.freeSlots} profiles are free.
                </li>
                <li className="flex gap-2">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  All external links belong to you. Buyers land on your platform.
                </li>
                <li className="flex gap-2">
                  <CheckShield size={16} className="mt-0.5 shrink-0" />
                  Submit materials for a verified badge and gain trust faster.
                </li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/join" className="btn btn-ink">
                  Add your profile
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- New profiles ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading
            title="New profiles"
            action={{ href: "/directory", label: "Browse all" }}
          >
            Recently added human creators and companies.
          </SectionHeading>
          <ProfileGrid profiles={newest} />
        </div>
      </section>

      {/* ---------- Verification block ---------- */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="mx-auto grid h-12 w-12 place-items-center rounded-xl"
              style={{ background: "#dff1e9", color: "#157a58" }}
            >
              <CheckShield size={22} />
            </span>
            <h2 className="mt-4">Honest verification, reviewed by hand</h2>
            <p className="lead mt-4">
              Creators can submit process photos, video, sketches, drafts or
              published work. We review each submission by hand and describe on
              the profile what exactly was checked. Verification does not claim
              a legal guarantee — it is an honest, human review of the
              materials the creator provided.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href="/verified" className="btn btn-quiet">
                See verified profiles
              </Link>
              <Link href="/human-made-standards" className="btn btn-quiet">
                Human-Made standards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section-brand section">
        <div className="container-page">
          <SectionHeading title="Frequently asked questions" />
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="section-dark section">
        <div className="container-page text-center">
          <h2 className="text-white">Are you a human creator?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            The first {site.freeSlots} profiles are free. Get found by buyers
            looking for work made by people.
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
