"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/types";

/**
 * Leaving a review.
 *
 * The star row is real buttons rather than a select: picking a rating is
 * one tap, and each star is separately reachable from the keyboard and
 * separately announced to a screen reader.
 *
 * Nothing here is trusted. The same checks run again on the server in
 * /api/reviews, because anyone can post to that URL without ever loading
 * this page. What runs here only exists to save the visitor a round trip.
 *
 * The submitted review goes into moderation. The text below the form says
 * so plainly, before the visitor writes anything.
 */

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width={34} height={34} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.35l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z"
        fill={filled ? "#e8a33d" : "transparent"}
        stroke={filled ? "#c9832a" : "var(--color-line)"}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

type State = "idle" | "sending" | "sent" | "error";

export function ReviewForm({ dict, lang }: { dict: Dictionary; lang: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const r = dict.reviews;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) return setError(r.errName);
    if (rating < 1) return setError(r.errRating);
    if (text.trim().length < 10) return setError(r.errText);

    setState("sending");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), rating, text: text.trim(), lang }),
      });

      if (res.ok) {
        setState("sent");
        return;
      }

      const data = await res.json().catch(() => ({}));
      // The daily limit gets its own line: it is not a failure, it is a
      // rule, and the visitor should know which of the two they hit.
      setError(data?.error === "rate" ? r.errRate : r.errServer);
      setState("error");
    } catch {
      setError(r.errServer);
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div
        className="rounded-xl border p-5 text-[0.95rem]"
        style={{
          borderColor: "var(--color-line)",
          background: "var(--color-brand-soft)",
          color: "var(--color-muted)",
        }}
      >
        <p className="font-semibold" style={{ color: "var(--color-ink)" }}>
          {r.thanksTitle}
        </p>
        <p className="mt-1.5">{r.thanksText}</p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label
          htmlFor="review-name"
          className="mb-1.5 block text-[0.9rem] font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          {r.nameLabel}
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full rounded-xl border px-4 py-3 text-[0.95rem]"
          style={{ borderColor: "var(--color-line)", background: "#fff" }}
          placeholder={r.namePlaceholder}
        />
      </div>

      <div>
        <span
          className="mb-1.5 block text-[0.9rem] font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          {r.ratingLabel}
        </span>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n}`}
              aria-pressed={rating === n}
              className="transition-transform active:scale-90"
            >
              <Star filled={n <= shown} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-text"
          className="mb-1.5 block text-[0.9rem] font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          {r.textLabel}
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={1500}
          className="w-full rounded-xl border px-4 py-3 text-[0.95rem]"
          style={{ borderColor: "var(--color-line)", background: "#fff" }}
          placeholder={r.textPlaceholder}
        />
      </div>

      {error && (
        <p className="text-[0.9rem]" style={{ color: "#b4342a" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-accent btn-full disabled:opacity-60"
      >
        {state === "sending" ? r.sending : r.submit}
      </button>

      <p className="text-[0.85rem]" style={{ color: "var(--color-muted-soft)" }}>
        {r.moderationNote}
      </p>
    </form>
  );
}
