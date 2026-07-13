import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules of using No AI Marketplace for buyers and listed creators.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <StubPage
      title="Terms of Use"
      intro="These terms cover how visitors and listed creators use the site: acceptable use, the fact that all transactions happen on the creator's own platform, our right to remove listings that break the Human-Made standards, and standard disclaimers."
      note="The final legal text is added by the owner. Structure and links are in place; content to follow."
    />
  );
}
