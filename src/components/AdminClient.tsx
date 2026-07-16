"use client";

import { useState } from "react";
import type { Review } from "@/lib/redis";

/**
 * The moderation screen.
 *
 * Interface text is hardcoded English on purpose: this page is for the
 * owner, not for visitors, and putting forty admin strings into both
 * dictionaries would mean maintaining translations nobody reads.
 *
 * The password is held in component state and sent as a header with each
 * call. It is not written to localStorage: closing the tab logs out, which
 * for a page opened a few times a month is the right trade.
 */

type Status = "approved" | "rejected" | "pending";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
            fill={i <= n ? "#e8a33d" : "transparent"}
            stroke={i <= n ? "#c9832a" : "var(--color-line)"}
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

const STATUS_COLOR: Record<Status, string> = {
  pending: "#8a6d1f",
  approved: "#2f6b45",
  rejected: "#8a3a32",
};

export function AdminClient() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load(pw: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { "x-admin-password": pw },
      });
      if (res.status === 401) {
        setError("Wrong password, or ADMIN_PASSWORD is not set in Vercel.");
        setBusy(false);
        return;
      }
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setAuthed(true);
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  async function decide(id: string, status: "approved" | "rejected") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        // Reload rather than patch in place: the list is short and this
        // guarantees the screen matches what is actually stored.
        await load(password);
        return;
      }
      setError("Could not save the decision.");
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  }

  if (!authed) {
    return (
      <div className="section">
        <div className="container-page max-w-sm">
          <h1
            className="text-[1.5rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            Moderation
          </h1>
          <div className="mt-5 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") load(password);
              }}
              placeholder="Password"
              className="w-full rounded-xl border px-4 py-3 text-[0.95rem]"
              style={{ borderColor: "var(--color-line)", background: "#fff" }}
            />
            <button
              type="button"
              onClick={() => load(password)}
              disabled={busy || password.length === 0}
              className="btn btn-accent btn-full disabled:opacity-60"
            >
              {busy ? "Checking..." : "Sign in"}
            </button>
            {error && (
              <p className="text-[0.9rem]" style={{ color: "#b4342a" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const pending = reviews.filter((r) => r.status === "pending");
  const decided = reviews.filter((r) => r.status !== "pending");

  const fmt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function Card({ review, actions }: { review: Review; actions: boolean }) {
    return (
      <li
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--color-line)", background: "#fff" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2.5">
            <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
              {review.name}
            </span>
            <Stars n={review.rating} />
            <span
              className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase"
              style={{
                background: "var(--color-brand-soft)",
                color: STATUS_COLOR[review.status],
              }}
            >
              {review.status}
            </span>
          </span>
          <span className="text-[0.75rem]" style={{ color: "var(--color-muted-soft)" }}>
            {review.lang.toUpperCase()} · {fmt.format(new Date(review.createdAt))}
          </span>
        </div>

        <p
          className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {review.text}
        </p>

        {actions && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => decide(review.id, "approved")}
              disabled={busy}
              className="btn btn-accent disabled:opacity-60"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => decide(review.id, "rejected")}
              disabled={busy}
              className="btn btn-quiet disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        )}
      </li>
    );
  }

  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <h1
            className="text-[1.5rem] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            Moderation
          </h1>
          <button
            type="button"
            onClick={() => load(password)}
            disabled={busy}
            className="btn btn-quiet disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {error && (
          <p className="mt-3 text-[0.9rem]" style={{ color: "#b4342a" }}>
            {error}
          </p>
        )}

        <h2 className="mt-7 font-semibold" style={{ color: "var(--color-ink)" }}>
          Waiting ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="mt-2 text-[0.9rem]" style={{ color: "var(--color-muted-soft)" }}>
            Nothing to review.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((r) => (
              <Card key={r.id} review={r} actions />
            ))}
          </ul>
        )}

        {decided.length > 0 && (
          <>
            <h2 className="mt-9 font-semibold" style={{ color: "var(--color-ink)" }}>
              Decided ({decided.length})
            </h2>
            <ul className="mt-3 space-y-3">
              {decided.map((r) => (
                <Card key={r.id} review={r} actions={false} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
