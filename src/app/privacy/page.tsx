import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How No AI Marketplace handles data, cookies and third-party services.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <StubPage
      title="Privacy Policy"
      intro="This page explains how No AI Marketplace handles personal data, cookies and third-party services (Tally forms, Stripe payments, analytics, hosting on Vercel). We collect the minimum needed to run the directory and never sell your data."
      note="The final legal text is added by the owner. Structure and links are in place; content to follow."
    />
  );
}
