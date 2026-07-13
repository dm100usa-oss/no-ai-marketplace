import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Verification Policy",
  description: "How verification works on No AI Marketplace, what we review, and the limits of what a badge means.",
  alternates: { canonical: "/verification-policy" },
};

export default function Page() {
  return (
    <StubPage
      title="Verification Policy"
      intro="This page states the ground rules for verification: what materials we accept, how the human review works, what a Verified badge means, what it does not mean (no legal guarantee), how findings are described on each profile, and how a badge can be revoked. The public-facing summary is on the Verified page; this document is the fuller policy."
      note="The final policy text is added by the owner. Structure and links are in place; content to follow."
    />
  );
}
