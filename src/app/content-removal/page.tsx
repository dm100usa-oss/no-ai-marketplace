import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Content Removal",
  description: "How to request removal of content from a profile on No AI Marketplace.",
  alternates: { canonical: "/content-removal" },
};

export default function Page() {
  return (
    <StubPage
      title="Content Removal"
      intro="This page explains how to request removal or correction of content — a wrong description, an image used without permission, incorrect claims about a person or business, or content that breaks the Human-Made standards. Every profile page also has a Report a problem button that lands directly in our inbox."
      note="The final removal-request procedure is added by the owner. Structure and links are in place; content to follow."
    />
  );
}
