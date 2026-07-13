"use client";

import Link from "next/link";
import { isExternalCheckout } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

/**
 * Plan call-to-action button (stage 5 + 6). Sends a checkout_click event
 * (TZ 5.6), then either opens the external Stripe link in a new tab with
 * safe attributes or navigates to the join form client-side.
 */
export function CheckoutButton({
  href,
  label,
  plan,
  className,
}: {
  href: string;
  label: string;
  plan: "free" | "monthly" | "yearly";
  className: string;
}) {
  const external = isExternalCheckout(href);

  const onClick = () => {
    if (plan !== "free") {
      trackEvent("checkout_click", { plan, target: external ? "stripe" : "form" });
    }
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {label}
    </Link>
  );
}
