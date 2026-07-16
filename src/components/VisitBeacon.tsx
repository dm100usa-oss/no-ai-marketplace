"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks every page view.
 *
 * Sits in the layout, so it runs on every page, and usePathname makes it
 * run again on each move around the site — without it Next keeps the
 * component mounted through client-side navigation and only the first
 * page of a visit would ever register.
 *
 * Every open counts, reloads included. That is the decision: the figure is
 * page views for the week and is labelled as such. A visitor who refreshes
 * and sees it move learns the counter is alive rather than a picture of a
 * number.
 *
 * Failures are swallowed. A view that did not register is not something to
 * bother the visitor about.
 */

export function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
