import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for reaching out to No AI Marketplace.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function Page() {
  return (
    <StatusPage
      kind="success"
      title="Thank you"
      description="We got your message and will read it by hand. You will hear back within a few working days."
      primary={{ href: "/", label: "Back to home" }}
      secondary={{ href: "/directory", label: "Browse the catalog" }}
    />
  );
}
