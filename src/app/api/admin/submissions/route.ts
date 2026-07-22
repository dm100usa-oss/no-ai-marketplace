import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  addSubmission,
  getAllSubmissions,
  setSubmissionStatus,
  type Submission,
} from "@/lib/redis";

/**
 * The join queue, behind the same password as review moderation.
 *
 * GET returns every submission, POST either publishes/rejects one or adds
 * a new one pasted in by hand. The password is checked on the server on
 * every call: /admin is a plain page and hiding a button there protects
 * nothing.
 *
 * With ADMIN_PASSWORD unset everything refuses. Unset means locked.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Constant-time compare, so timing does not leak the shared prefix. */
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
  const submissions = await getAllSubmissions();
  return NextResponse.json({ ok: true, submissions });
}

/** Trim a value to a string, or undefined when there is nothing there. */
function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

/** Accept a real array of strings, or one string with commas or newlines. */
function list(v: unknown): string[] | undefined {
  if (Array.isArray(v)) {
    const out = v.map((x) => str(x)).filter((x): x is string => x !== undefined);
    return out.length > 0 ? out : undefined;
  }
  const s = str(v);
  if (!s) return undefined;
  const out = s
    .split(/[\n,]+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  return out.length > 0 ? out : undefined;
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

  const data = (body ?? {}) as Record<string, unknown>;

  // ---- Decision on an existing submission ----
  if (typeof data.id === "string") {
    const status = data.status;
    if (status !== "published" && status !== "rejected") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const done = await setSubmissionStatus(data.id, status);
    return NextResponse.json({ ok: done }, { status: done ? 200 : 500 });
  }

  // ---- A new submission, entered by hand from the Tally email ----
  const name = str(data.name);
  if (!name) {
    return NextResponse.json(
      { ok: false, error: "name is required" },
      { status: 400 },
    );
  }

  const profileType =
    data.profileType === "team" || data.profileType === "company"
      ? data.profileType
      : "creator";

  const input: Omit<Submission, "id" | "createdAt" | "status"> = {
    name,
    email: str(data.email),
    country: str(data.country),
    city: str(data.city),
    profileType,
    mainCategory: str(data.mainCategory),
    additionalCategories: list(data.additionalCategories),
    shortDescription: str(data.shortDescription),
    fullDescription: str(data.fullDescription),
    website: str(data.website),
    otherLinks: str(data.otherLinks),
    avatar: str(data.avatar),
    mainImage: str(data.mainImage),
    gallery: list(data.gallery),
    showOnHomepage: data.showOnHomepage === true,
  };

  const done = await addSubmission(input);
  return NextResponse.json({ ok: done.ok }, { status: done.ok ? 200 : 500 });
}
