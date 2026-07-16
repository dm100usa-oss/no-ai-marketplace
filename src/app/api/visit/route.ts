import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/redis";

/**
 * One page view, recorded.
 *
 * Called by <VisitBeacon> on every page. Nothing about the caller is read
 * or stored: no address, no browser, no headers. The view is a +1 on
 * today's counter and that is all.
 *
 * Always answers 200. A view that failed to register is not the visitor's
 * problem and must never surface as an error in their console.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await recordVisit();
  return NextResponse.json({ ok: true });
}
