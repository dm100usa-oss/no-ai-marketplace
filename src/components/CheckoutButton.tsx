"use client";

import Link from "next/link";
import { isExternalCheckout } from "@/lib/config";
import type { PlanId, BillingPeriod } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { localizeHref } from "./LocaleLink";
import type { Locale } from "@/i18n/config";

/**
 * Plan call-to-action button. Sends a checkout_click event, then either
 * opens the external Stripe link in a new tab with safe attributes or
 * navigates to the (localized) join form client-side.
 */
export function CheckoutButton({
  lang,
  href,
  label,
  plan,
  period,
  className,
  style,
}: {
  lang: Locale;
  href: string;
  label: string;
  plan: PlanId;
  period: BillingPeriod;
  className: string;
  /** Set by the caller so the button can carry its plan's own colour. */
  style?: React.CSSProperties;
}) {
  const external = isExternalCheckout(href);

  const onClick = () => {
    trackEvent("checkout_click", {
      plan,
      period,
      target: external ? "stripe" : "form",
    });
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
        style={style}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={localizeHref(lang, href)} onClick={onClick} className={className} style={style}>
      {label}
    </Link>
  );
}
