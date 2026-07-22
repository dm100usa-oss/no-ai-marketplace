import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

/**
 * The one place that talks to the database.
 *
 * Everything the site stores lives here: the view counter behind the band
 * on the home page, and the reviews behind the rating next to it. Nothing
 * else in the project imports @upstash/redis directly, so if the store is
 * ever swapped the change is this file and no other.
 *
 * Two rules run through the whole file:
 *
 * 1. The site never falls over because the database is having a bad day.
 *    Every read returns an empty answer on failure and every write returns
 *    false. A visitor sees a page with no band rather than an error page.
 *
 * 2. Nothing invented is ever shown. No data means no band, not a zero and
 *    not a placeholder.
 */

/** Null when the environment variables are not set (local dev, previews). */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export function hasRedis(): boolean {
  return redis !== null;
}

/* ------------------------------------------------------------------ */
/* Visits                                                              */
/* ------------------------------------------------------------------ */

/** YYYY-MM-DD in UTC — one bucket per day, same for every visitor. */
function dayKey(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Record one page view.
 *
 * Every open counts: a reload, a second tab, a walk around the site. The
 * band says "views this week" and this is what it counts, so the word and
 * the number agree.
 *
 * Nothing about the visitor is stored — not the address, not the browser,
 * nothing. A view is a +1 on a per-day counter and no more than that.
 *
 * Each day's counter is kept for 8 days and expires by itself. The home
 * page sums the last 7, so there is nothing to clean up by hand and no
 * history piling up.
 */
export async function recordVisit(): Promise<void> {
  if (!redis) return;
  const key = `views:${dayKey()}`;
  try {
    await redis.incr(key);
    await redis.expire(key, 60 * 60 * 24 * 8);
  } catch {
    // A missed view is not worth an error page.
  }
}

/**
 * Page views over the last 7 days, today included.
 *
 * Returns null when there is nothing to show — no database, an error, or
 * simply nobody yet. Null means the band does not render at all, which is
 * the honest answer for a site nobody has opened.
 */
export async function getWeeklyVisits(): Promise<number | null> {
  if (!redis) return null;
  try {
    const keys = Array.from({ length: 7 }, (_, i) => `views:${dayKey(i)}`);
    const counts = await redis.mget<(number | null)[]>(...keys);
    const total = (counts ?? []).reduce((sum: number, n) => sum + (Number(n) || 0), 0);
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  lang: string;
  createdAt: number;
  status: "pending" | "approved" | "rejected";
}

const REVIEWS_KEY = "reviews";

/**
 * Store a review, always as pending.
 *
 * Nothing reaches the public page without a human saying yes in /admin.
 * That is the whole point: a rating is only worth something if the reviews
 * behind it were read by someone.
 *
 * One review per address per day. This is a speed bump, not a wall — it
 * stops the obvious case of someone sitting there posting five glowing
 * reviews in a row, and the moderation queue catches the rest.
 */
export async function addReview(input: {
  name: string;
  rating: number;
  text: string;
  lang: string;
  ip: string;
}): Promise<{ ok: boolean; reason?: "rate" | "store" }> {
  if (!redis) return { ok: false, reason: "store" };

  const guard = `review-guard:${createHash("sha256").update(input.ip).digest("hex").slice(0, 24)}`;

  try {
    // set(..., { nx: true }) returns null when the key is already there:
    // that is the second review from this address today.
    const fresh = await redis.set(guard, 1, { nx: true, ex: 60 * 60 * 24 });
    if (fresh === null) return { ok: false, reason: "rate" };

    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: input.name,
      rating: input.rating,
      text: input.text,
      lang: input.lang,
      createdAt: Date.now(),
      status: "pending",
    };

    await redis.lpush(REVIEWS_KEY, JSON.stringify(review));
    return { ok: true };
  } catch {
    return { ok: false, reason: "store" };
  }
}

/** Everything in the queue, newest first. Used by the admin page only. */
export async function getAllReviews(): Promise<Review[]> {
  if (!redis) return [];
  try {
    const raw = await redis.lrange(REVIEWS_KEY, 0, -1);
    return raw
      .map((r) => {
        // Upstash may hand back an already-parsed object or a string,
        // depending on what was written. Accept both.
        if (typeof r === "string") {
          try {
            return JSON.parse(r) as Review;
          } catch {
            return null;
          }
        }
        return r as unknown as Review;
      })
      .filter((r): r is Review => r !== null);
  } catch {
    return [];
  }
}

/** Approved reviews only — what the public /reviews page shows. */
export async function getApprovedReviews(): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter((r) => r.status === "approved");
}

/**
 * The average of approved reviews, or null when there are none.
 *
 * Null all the way to the home page: no approved reviews means no star and
 * no number, rather than a 0.0 or a made-up 4.9.
 */
export async function getAverageRating(): Promise<{ average: number | null; count: number }> {
  const approved = await getApprovedReviews();
  if (approved.length === 0) return { average: null, count: 0 };
  const sum = approved.reduce((s, r) => s + r.rating, 0);
  return {
    average: Math.round((sum / approved.length) * 10) / 10,
    count: approved.length,
  };
}

/**
 * Approve or reject one review.
 *
 * The list is rewritten with the one entry changed. Reviews are few and
 * moderation is occasional, so a rewrite is simpler and easier to trust
 * than an index, and the cost is invisible at this size.
 */
export async function setReviewStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  if (!redis) return false;
  try {
    const all = await getAllReviews();
    const target = all.find((r) => r.id === id);
    if (!target) return false;

    target.status = status;

    const pipe = redis.pipeline();
    pipe.del(REVIEWS_KEY);
    // lpush puts the last item on top, so push in reverse to keep the
    // original newest-first order intact.
    for (const r of [...all].reverse()) pipe.lpush(REVIEWS_KEY, JSON.stringify(r));
    await pipe.exec();

    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Profile submissions                                                 */
/* ------------------------------------------------------------------ */

/**
 * A join request waiting for a yes or a no in /admin.
 *
 * The shape mirrors what the join form asks for, kept deliberately loose:
 * the form lives on Tally and may gain a field before this file does, so
 * anything unrecognised rides along in `extra` rather than being dropped.
 *
 * Images are URLs, not files. Whatever the form hands over is stored as a
 * link and shown as a link. Nothing is uploaded anywhere by this project.
 */
export interface Submission {
  id: string;
  createdAt: number;
  status: "pending" | "published" | "rejected";

  /** Identity */
  name: string;
  email?: string;
  country?: string;
  city?: string;

  /** What they do */
  profileType?: "creator" | "team" | "company";
  mainCategory?: string;
  additionalCategories?: string[];
  shortDescription?: string;
  fullDescription?: string;

  /** Where to find them */
  website?: string;
  otherLinks?: string;

  /** Pictures, as links */
  avatar?: string;
  mainImage?: string;
  gallery?: string[];

  /** Consents */
  showOnHomepage?: boolean;

  /** Anything the form sends that this file does not know about yet. */
  extra?: Record<string, unknown>;
}

const SUBMISSIONS_KEY = "submissions";

/**
 * Store one join request, always as pending.
 *
 * Same rule as reviews: nothing reaches the catalog without a human
 * saying yes. The queue is the only way in.
 */
export async function addSubmission(
  input: Omit<Submission, "id" | "createdAt" | "status">,
): Promise<{ ok: boolean }> {
  if (!redis) return { ok: false };
  try {
    const submission: Submission = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      status: "pending",
    };
    await redis.lpush(SUBMISSIONS_KEY, JSON.stringify(submission));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Everything in the queue, newest first. Admin page only. */
export async function getAllSubmissions(): Promise<Submission[]> {
  if (!redis) return [];
  try {
    const raw = await redis.lrange(SUBMISSIONS_KEY, 0, -1);
    return raw
      .map((r) => {
        if (typeof r === "string") {
          try {
            return JSON.parse(r) as Submission;
          } catch {
            return null;
          }
        }
        return r as unknown as Submission;
      })
      .filter((s): s is Submission => s !== null);
  } catch {
    return [];
  }
}

/** Published submissions — the ones the catalog shows alongside the file. */
export async function getPublishedSubmissions(): Promise<Submission[]> {
  const all = await getAllSubmissions();
  return all.filter((s) => s.status === "published");
}

/**
 * Publish or reject one submission.
 *
 * Same rewrite-the-list approach as reviews: submissions are few, the
 * decision is occasional, and a rewrite is easier to trust than an index.
 */
export async function setSubmissionStatus(
  id: string,
  status: "published" | "rejected",
): Promise<boolean> {
  if (!redis) return false;
  try {
    const all = await getAllSubmissions();
    const target = all.find((s) => s.id === id);
    if (!target) return false;

    target.status = status;

    const pipe = redis.pipeline();
    pipe.del(SUBMISSIONS_KEY);
    for (const s of [...all].reverse()) pipe.lpush(SUBMISSIONS_KEY, JSON.stringify(s));
    await pipe.exec();

    return true;
  } catch {
    return false;
  }
}
