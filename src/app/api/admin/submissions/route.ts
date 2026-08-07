import { NextRequest, NextResponse } from "next/server";
import { refreshCatalog } from "@/lib/refresh-catalog";
import { getLiveProfiles } from "@/lib/live-profiles";
import { submissionToProfile, submissionDisplayCaptions } from "@/lib/submission-to-profile";
import { timingSafeEqual } from "crypto";
import {
  addSubmission,
  getAllSubmissions,
  setSubmissionStatus,
  setSubmissionTranslation,
  setSubmissionVerification,
  deleteSubmission,
  type Submission,
} from "@/lib/redis";
import { translateAuthorText } from "@/lib/translate";
import {
  sendWelcomeEmail,
  sendRejectionEmail,
  sendVerifiedEmail,
} from "@/lib/mail";

/**
 * Make the author's words in the other language and keep them.
 *
 * Called at approval, which is the natural moment, and again by hand from
 * the moderation screen. The second way exists because the first happens
 * exactly once and can quietly fail: the free translator has a daily
 * ceiling and an occasional bad minute, and a profile approved during one
 * of those stays in its original language for ever, with no way to try
 * again short of rejecting and re-approving it.
 *
 * Never allowed to throw. A translation that did not happen leaves the
 * profile exactly as it was, which is a smaller loss than an approval
 * that failed over it.
 */
async function translateSubmission(s: Submission): Promise<boolean> {
  const from = s.lang === "ru" ? "ru" : "en";
  const to = from === "ru" ? "en" : "ru";
  try {
    // The captions as the page will print them, not as the form sent
    // them: a work the author never uploaded takes its caption with it,
    // and translating the caption anyway put every English one under the
    // wrong picture.
    const shown = submissionDisplayCaptions(s);
    const done = await translateAuthorText(
      {
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        services: s.services,
        galleryCaptions: shown.galleryCaptions,
        stageCaptions: shown.stageCaptions,
      },
      from,
      to,
    );
    if (!done) return false;
    await setSubmissionTranslation(s.id, to, done);
    refreshCatalog();
    return true;
  } catch {
    return false;
  }
}

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

  // Every submission is run through the converter before it is shown, and
  // the result travels with it. The moderation screen can then say, before
  // anything is approved, that a category will not be recognised or that a
  // team has nobody to link to. Finding that out afterwards, from a
  // profile that quietly never appeared, is how a listing gets paid for
  // and stays invisible.
  const catalog = await getLiveProfiles();
  const readiness: Record<string, { problem?: string; missingMembers?: string[] }> = {};
  for (const s of submissions) {
    const { problem, missingMembers } = submissionToProfile(s, catalog);
    if (problem || missingMembers) readiness[s.id] = { problem, missingMembers };
  }

  return NextResponse.json({ ok: true, submissions, readiness });
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
    // Remove for good. No letter goes out: a deleted submission is one the
    // owner never wants to hear about again — a test entry or spam — and a
    // note about it would only confuse whoever sent it.
    if (data.action === "delete") {
      const gone = await deleteSubmission(data.id);
      return NextResponse.json({ ok: gone }, { status: gone ? 200 : 500 });
    }

    // Translate again, by hand, from the moderation screen. Answers with
    // whether it worked, so the screen can say so plainly instead of
    // leaving the owner to go and look at the page.
    if (data.action === "translate") {
      const all = await getAllSubmissions();
      const found = all.find((s) => s.id === data.id);
      if (!found) return NextResponse.json({ ok: false }, { status: 404 });
      const done = await translateSubmission(found);
      return NextResponse.json({ ok: done });
    }

    // Grant a verification badge, then tell the author it is on.
    if (data.verification === "verified-creator" || data.verification === "verified-business") {
      const updated = await setSubmissionVerification(data.id, data.verification);
      if (!updated) return NextResponse.json({ ok: false }, { status: 500 });
      await sendVerifiedEmail({
        to: updated.email,
        locale: updated.lang,
        kind: data.verification,
      });
      return NextResponse.json({ ok: true });
    }

    const status = data.status;
    if (status !== "published" && status !== "rejected") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const updated = await setSubmissionStatus(data.id, status);
    if (!updated) return NextResponse.json({ ok: false }, { status: 500 });

    // Approval is one of the two doors into the catalog, so the pages are
    // rebuilt here. The profile only appears once the address is confirmed
    // as well; refreshing now costs nothing and covers the case where it
    // already was.
    refreshCatalog();

    // The letter follows the decision. A mail that does not go out (no key
    // yet, or a hiccup at Resend) must not undo a decision already stored,
    // so its result is not folded into the response.
    if (status === "published") {
      // The author's words in the other language, made here and kept with
      // the submission. This is the one moment it can be done: the owner
      // has just read the application and decided it belongs in the
      // catalog, and nothing after this point knows the text is new.
      //
      // Deliberately not allowed to affect the answer. A translator that
      // is slow, busy or gone leaves the profile in its original language
      // on both sites — the same as before this existed — while an
      // approval that failed over it would leave an author waiting on a
      // decision that had already been made.
      // The catalog was refreshed a moment ago, before the text existed.
      // translateSubmission refreshes again, so the translated page is
      // the first one anybody sees.
      await translateSubmission(updated);

      await sendWelcomeEmail({
        to: updated.email,
        locale: updated.lang,
        token: updated.confirmToken ?? "",
      });
    } else {
      await sendRejectionEmail({ to: updated.email, locale: updated.lang });
    }

    return NextResponse.json({ ok: true });
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
    lang: data.lang === "ru" ? "ru" : "en",
    email: str(data.email),
    country: str(data.country),
    city: str(data.city),
    nameAlt: str(data.nameAlt),
    cityAlt: str(data.cityAlt),
    profileType,
    mainCategory: str(data.mainCategory),
    additionalCategories: list(data.additionalCategories),
    shortDescription: str(data.shortDescription),
    fullDescription: str(data.fullDescription),
    services: list(data.services),
    foundedYear: str(data.foundedYear),
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
