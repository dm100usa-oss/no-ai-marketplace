import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Profile suspended",
  description: "This profile is currently suspended.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/profile-suspended" },
};

export default function Page() {
  return (
    <StatusPage
      kind="warn"
      title="Profile suspended"
      description="This profile is temporarily hidden from the catalogue while we review a report or a billing issue. If this is your profile, please get in touch — we handle every case by hand."
      primary={{ href: "/contact", label: "Contact us" }}
      secondary={{ href: "/directory", label: "Browse other profiles" }}
    />
  );
}
