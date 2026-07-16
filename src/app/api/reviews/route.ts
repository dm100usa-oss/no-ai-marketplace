import { NextRequest, NextResponse } from "next/server";
import { addReview } from "@/lib/redis";

/**
 * A visitor leaving a review.
 *
 * Everything arriving here is checked before it is stored: the name must
 * be real text and not 300 characters of it, the rating must be a whole
 * number from 1 to 5, the text must say something and stop somewhere.
 * Client-side validation is a courtesy to the visitor; this is the part
 * that actually holds, because anyone can post to this URL directly.
 *
 * A stored review is pending, never published. See lib/redis.ts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  const { name, rating, text, lang } = (body ?? {}) as Record<string, unknown>;

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanText = typeof text === "string" ? text.trim() : "";
  const cleanLang = lang === "ru" ? "ru" : "en";
  const numRating = typeof rating === "number" ? rating : Number(rating);

  if (cleanName.length < 2 || cleanName.length > 80) {
    return NextResponse.json({ ok: false, error: "name" }, { status: 400 });
  }
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    return NextResponse.json({ ok: false, error: "rating" }, { status: 400 });
  }
  if (cleanText.length < 10 || cleanText.length > 1500) {
    return NextResponse.json({ ok: false, error: "text" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const result = await addReview({
    name: cleanName,
    rating: numRating,
    text: cleanText,
    lang: cleanLang,
    ip,
  });

  if (!result.ok) {
    // 429 for the daily limit, 503 when the store itself is unavailable:
    // the visitor is told which of the two happened.
    const status = result.reason === "rate" ? 429 : 503;
    return NextResponse.json({ ok: false, error: result.reason }, { status });
  }

  return NextResponse.json({ ok: true });
}
