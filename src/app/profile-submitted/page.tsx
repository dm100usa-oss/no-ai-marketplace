import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Profile submitted",
  description: "Your profile submission has been received.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/profile-submitted" },
};

export default function Page() {
  return (
    <StatusPage
      kind="success"
      title="Profile submitted"
      description="We got your submission and are reviewing it by hand. Most profiles go live within a few working days. If you asked for verification, we may take a little longer to look at the materials."
      primary={{ href: "/", label: "Back to home" }}
      secondary={{ href: "/directory", label: "Browse the catalog" }}
    />
  );
}
