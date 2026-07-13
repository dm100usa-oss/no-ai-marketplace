import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Profile not available",
  description: "This profile is not available in the catalogue.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/profile-not-available" },
};

export default function Page() {
  return (
    <StatusPage
      kind="info"
      title="Profile not available"
      description="This profile is no longer in the catalogue — the creator may have taken it down, or the plan lapsed. The rest of the directory is still here."
      primary={{ href: "/directory", label: "Browse the catalog" }}
      secondary={{ href: "/", label: "Back to home" }}
    />
  );
}
