import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Human-Made standards",
  description:
    "What counts as human-made on No AI Marketplace, what does not, and where hybrid work fits.",
  alternates: { canonical: "/human-made-standards" },
};

export default function StandardsPage() {
  return (
    <div className="container-page section">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Human-Made standards" },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <h1>Human-Made standards</h1>
        <p className="lead mt-4">
          A short, honest description of what we mean by human-made — so
          creators know what belongs here and buyers know what to expect.
        </p>

        <h2 className="mt-10">The one-line rule</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          The substance of the work — the drawing, the writing, the
          photograph, the design decision, the code, the object made by
          hand — is done by a human. If AI touched it, the human contribution
          is still the substance, and the creator says so clearly.
        </p>

        <h2 className="mt-10">What clearly belongs here</h2>
        <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
          <BulletItem>
            Hand-drawn or hand-painted illustration and art, including work
            done in a graphics tablet by a person.
          </BulletItem>
          <BulletItem>
            Photography and video where the person behind the camera made the
            frames.
          </BulletItem>
          <BulletItem>
            Writing, editing and copy where a human wrote and shaped the text.
          </BulletItem>
          <BulletItem>
            Design and branding work where the concept, layout and typography
            are the designer&apos;s.
          </BulletItem>
          <BulletItem>
            Handmade objects, craft and small-batch production.
          </BulletItem>
          <BulletItem>
            Professional services that trade on human judgement — consulting,
            teaching, coaching, architecture, engineering, legal, medical
            adjacent work.
          </BulletItem>
        </ul>

        <h2 className="mt-10">Where hybrid work fits</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          AI touches many workflows now — background clean-up, transcription,
          research assistance, spell check, colour balancing. That is fine, as
          long as the human contribution is the substance of the finished
          work and the creator is open about how AI was used. Each profile
          has an{" "}
          <strong style={{ color: "var(--color-ink)" }}>On the use of AI</strong>{" "}
          statement for this — clarity is the standard, not silence.
        </p>

        <h2 className="mt-10">What does not belong</h2>
        <ul className="mt-3 space-y-2" style={{ color: "var(--color-muted)" }}>
          <BulletItem>
            Listings whose main output is AI-generated imagery, text, music or
            code with only a light human touch on top.
          </BulletItem>
          <BulletItem>
            Storefronts that resell AI-generated goods as human-made.
          </BulletItem>
          <BulletItem>
            Portfolios that pass off AI-generated pieces as hand work.
          </BulletItem>
          <BulletItem>
            Deceptive claims of authorship or process.
          </BulletItem>
        </ul>

        <div
          className="mt-10 flex gap-4 rounded-2xl border p-6"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: "#dff1e9", color: "#157a58" }}
          >
            <CheckShield size={20} />
          </span>
          <div>
            <h3 className="text-[1.05rem]">Verification is optional and honest</h3>
            <p className="mt-1 text-[0.95rem]" style={{ color: "var(--color-muted)" }}>
              Creators may submit materials for a verified badge. We review by
              hand and describe on the profile what we looked at. We do not
              claim a legal guarantee of no-AI-anywhere. See{" "}
              <Link href="/verified" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                Verification
              </Link>
              .
            </p>
          </div>
        </div>

        <h2 className="mt-10">If we get it wrong</h2>
        <p className="mt-3" style={{ color: "var(--color-muted)" }}>
          Every profile page has a Report a problem link. If a listing looks
          like it breaks these standards, tell us — we review reports by hand.
          See also{" "}
          <Link href="/listing-policy" className="font-semibold" style={{ color: "var(--color-accent)" }}>
            Listing Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-[0.98rem]">
      <span aria-hidden style={{ color: "var(--color-accent)" }}>•</span>
      <span>{children}</span>
    </li>
  );
}
