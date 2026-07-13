import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach No AI Marketplace — for owners of listed profiles, buyers, journalists and partners.",
  alternates: { canonical: "/contact" },
};

const CONTACT_EMAIL = "hello@no-ai-marketplace.example";

export default function ContactPage() {
  return (
    <div className="container-page section">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="mx-auto max-w-3xl">
        <h1>Contact</h1>
        <p className="lead mt-4">
          The best way to reach us is by email. We read every message and
          reply within a few working days.
        </p>

        <div
          className="mt-8 rounded-2xl border p-6"
          style={{ borderColor: "var(--color-line)", background: "var(--color-brand-soft)" }}
        >
          <p className="text-[0.82rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted-soft)" }}>
            Email
          </p>
          <p className="mt-1 text-[1.15rem] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>

        <h2 className="mt-10">What to write about</h2>
        <div className="mt-3 space-y-4" style={{ color: "var(--color-muted)" }}>
          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>Adding your profile</h3>
            <p className="mt-1 text-[0.98rem]">
              Please use the{" "}
              <Link href="/join" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                Add your profile
              </Link>{" "}
              page — the form there collects everything we need and is the
              fastest path in. Email is for follow-up questions.
            </p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>Corrections and updates</h3>
            <p className="mt-1 text-[0.98rem]">
              If details on your profile need to change, email us with the
              profile URL and what should be updated.
            </p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>Reporting a problem with a listing</h3>
            <p className="mt-1 text-[0.98rem]">
              Every profile page has a Report a problem link at the bottom.
              That is the fastest route — it lands directly in our inbox with
              the profile URL attached.
            </p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>Press and partnerships</h3>
            <p className="mt-1 text-[0.98rem]">
              Journalists, researchers and partners are welcome. Please
              include the outlet and a short brief; we&apos;ll get back with
              relevant details.
            </p>
          </div>

          <div>
            <h3 className="text-[1rem]" style={{ color: "var(--color-ink)" }}>Legal notices</h3>
            <p className="mt-1 text-[0.98rem]">
              Copyright complaints and takedown requests are handled through{" "}
              <Link href="/content-removal" className="font-semibold" style={{ color: "var(--color-accent)" }}>
                Content Removal
              </Link>{" "}
              — that page lists what we need to act on a request.
            </p>
          </div>
        </div>

        <p className="mt-10 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
          {site.name} does not run in-site transactions. Purchases and
          enquiries always happen on the creator&apos;s own platform, not here.
        </p>
      </div>
    </div>
  );
}
