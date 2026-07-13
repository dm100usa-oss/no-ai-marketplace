import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund rules for paid listings on No AI Marketplace.",
  alternates: { canonical: "/refund-policy" },
};

export default function Page() {
  return (
    <StubPage
      title="Refund Policy"
      intro="This page covers refunds for paid listings — when a refund is available, when it is not, how cancellations affect current billing periods, and the process for requesting a refund through Stripe. Purchases made on creators' own platforms are not covered by this site's refund policy — those transactions are between buyer and creator."
      note="The final refund terms are added by the owner. Structure and links are in place; content to follow."
    />
  );
}
