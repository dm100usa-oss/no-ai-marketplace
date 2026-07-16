import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

/**
 * The one place that talks to the database.
 *
 * Everything the site stores lives here: the visit counter behind the band
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
 * A stable but unreadable id for one visitor on one day.
 *
 * The IP is never stored. It is hashed together with the user agent and
 * the date, so the same person on the same day maps to the same short
 * string, a different day maps to a different one, and the original
 * address cannot be recovered from what is kept. The day is part of the
 * input on purpose: it means yesterday's ids cannot be matched to today's.
 */
function visitorId(ip: string, ua: string, day: string): string {
  return createHash("sha256").update(`${ip}|${ua}|${day}`).digest("hex").slice(0, 24);
}

/**
 * Record one visit. Returns quietly whatever happens.
 *
 * Counting is per person per day, not per page view: a reload, a second
 * tab, or a walk around the site all land on the same id inside the same
 * day's set, and a set counts each member once. So the number cannot be
 * inflated by pressing F5.
 *
 * Each day's set is kept for 8 days and then expires by itself. The home
 * page only ever sums the last 7, so there is nothing to clean up by hand
 * and no history piling up.
 */
export async function recordVisit(ip: string, ua: string): Promise<void> {
  if (!redis) return;
  const day = dayKey();
  const key = `visits:${day}`;
  try {
    await redis.sadd(key, visitorId(ip, ua, day));
    await redis.expire(key, 60 * 60 * 24 * 8);
  } catch {
    // A missed visit is not worth an error page.
  }
}

/**
 * Visits over the last 7 days, today included.
 *
 * Returns null when there is nothing to show — no database, an error, or
 * simply nobody yet. Null means the band does not render at all, which is
 * the honest answer for a site that has not launched.
 */
export async function getWeeklyVisits(): Promise<number | null> {
  if (!redis) return null;
  try {
    const keys = Array.from({ length: 7 }, (_, i) => `visits:${dayKey(i)}`);
    const counts = await Promise.all(keys.map((k) => redis.scard(k)));
    const total = counts.reduce((sum: number, n) => sum + (Number(n) || 0), 0);
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
