import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Copyright Complaint",
  description: "How to file a copyright complaint about content on No AI Marketplace.",
  alternates: { canonical: "/copyright-complaint" },
};

export default function Page() {
  return (
    <StubPage
      title="Copyright Complaint"
      intro="This page describes how to file a copyright complaint about material shown on a profile — what information we need (the work in question, proof of ownership, the URL, contact details, a statement made in good faith), how quickly we act on complete requests, how the counter-notice process works, and how to reach us."
      note="The final complaint procedure is added by the owner. Structure and links are in place; content to follow."
    />
  );
}
