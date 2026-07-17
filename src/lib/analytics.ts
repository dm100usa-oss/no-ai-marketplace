"use client";

import { track } from "@vercel/analytics";

/**
 * Thin wrapper over Vercel Analytics custom events (TZ 5.6). Events we
 * care about: clicks on external creator links, Join / Add-profile
 * clicks, and moves to checkout. Category and profile *views* are already
 * covered by Vercel's automatic page-view tracking, so we only add the
 * intent events here.
 *
 * Safe to call anywhere on the client; if analytics is not active the
 * call is a no-op.
 */
export type DirectoryEvent =
  | "outbound_click" // visitor left to a creator's own platform
  | "join_click" // pressed Add profile / Join
  | "checkout_click"; // moved toward Stripe payment

export function trackEvent(
  event: DirectoryEvent,
  data?: Record<string, string | number | boolean>
): void {
  try {
    track(event, data);
  } catch {
    // analytics not available — ignore
  }
}
