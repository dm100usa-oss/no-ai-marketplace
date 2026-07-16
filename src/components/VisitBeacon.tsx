"use client";

import { useEffect } from "react";

/**
 * Marks one visit, once.
 *
 * Sits in the layout, so it is on every page. The sessionStorage flag
 * keeps it to a single call per tab: walking around the site is one
 * visit, not one per page opened.
 *
 * The server counts per person per day anyway, so this flag is not what
 * makes the number honest — it just saves a pointless request on every
 * click. Failures are swallowed: a visit that did not register is not
 * something to bother the visitor about.
 */

const FLAG = "visit-counted";

export function VisitBeacon() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(FLAG)) return;
      sessionStorage.setItem(FLAG, "1");
    } catch {
      // Private mode with storage disabled: still count the visit, the
      // server-side day set will deduplicate it.
    }

    fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  return null;
}
