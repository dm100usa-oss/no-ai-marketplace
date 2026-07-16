import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/redis";

/**
 * One visit, recorded.
 *
 * Called once per session by <VisitBeacon> in the layout. The IP is read
 * from the proxy headers Vercel sets and handed to recordVisit, which
 * hashes it and throws the original away — nothing identifying is stored.
 *
 * Always answers 200. A visit that failed to register is not the
 * visitor's problem and must never surface as an error in their console.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ua = request.headers.get("user-agent") || "unknown";

  await recordVisit(ip, ua);

  return NextResponse.json({ ok: true });
}
