import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your payment for a listing on No AI Marketplace was successful.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/payment-success" },
};

export default function Page() {
  return (
    <StatusPage
      kind="success"
      title="Payment successful"
      description="Thank you — your payment went through. We'll review your profile by hand and publish it shortly. A receipt from Stripe is on its way to your email."
      primary={{ href: "/", label: "Back to home" }}
      secondary={{ href: "/directory", label: "Browse the catalog" }}
    />
  );
}
