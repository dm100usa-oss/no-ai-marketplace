import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Payment cancelled",
  description: "The payment was not completed.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/payment-cancelled" },
};

export default function Page() {
  return (
    <StatusPage
      kind="info"
      title="Payment cancelled"
      description="You cancelled the payment before it completed — no charge was made. You can start again from the Add profile page whenever you're ready."
      primary={{ href: "/join", label: "Back to Add profile" }}
      secondary={{ href: "/pricing", label: "See pricing" }}
    />
  );
}
