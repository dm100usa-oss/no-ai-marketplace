import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Listing Policy",
  description: "What we accept on No AI Marketplace, how listings are reviewed, and when they can be removed.",
  alternates: { canonical: "/listing-policy" },
};

export default function Page() {
  return (
    <StubPage
      title="Listing Policy"
      intro="This page describes what belongs in the catalogue, how new listings are reviewed, how paid plans work, and the conditions under which a listing can be edited, suspended or removed. It complements the Human-Made standards, which describe what human-made means in practice."
      note="The final policy text is added by the owner. Structure and links are in place; content to follow."
    />
  );
}
