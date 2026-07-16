import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getAllReviews, setReviewStatus } from "@/lib/redis";

/**
 * Moderation, behind a password.
 *
 * GET returns the queue, POST approves or rejects one review. Both check
 * the password first, on the server, every single time — the /admin page
 * is a plain page and hiding a button there protects nothing.
 *
 * When ADMIN_PASSWORD is not set, both refuse everyone. An unset password
 * means locked, not open.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Compare in constant time, so the answer takes the same moment whether
 * the first character was wrong or only the last. A plain === leaks the
 * length of the shared prefix through timing.
 */
function passwordOk(request: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const given = request.headers.get("x-admin-password") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!passwordOk(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const reviews = await getAllReviews();
  return NextResponse.json({ ok: true, reviews });
}

export async function POST(request: NextRequest) {
  if (!passwordOk(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { id, status } = (body ?? {}) as Record<string, unknown>;

  if (typeof id !== "string" || (status !== "approved" && status !== "rejected")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const done = await setReviewStatus(id, status);
  return NextResponse.json({ ok: done }, { status: done ? 200 : 500 });
}
