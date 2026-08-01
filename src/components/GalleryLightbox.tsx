"use client";

import { useState, useEffect, useCallback } from "react";
import { CloseIcon } from "./icons";

/**
 * Portfolio gallery with a full-screen lightbox (stage 4 polish).
 * Clicking any work opens it full-screen over a dark overlay; arrows /
 * keyboard move between works, Esc or the close button dismiss it.
 *
 * Kept as a small client component so the rest of the profile page stays
 * server-rendered.
 */
export function GalleryLightbox({
  images,
  name,
  captions,
  variant = "grid",
  heroAlt,
  workLabel = "Work",
}: {
  images: string[];
  name: string;
  /** Optional line the author wrote under each work, same order as images.
   *  Missing or empty entries are simply not rendered, so a gallery with no
   *  captions at all looks exactly as it did before. */
  captions?: string[];
  /** "grid" is the portfolio: two across, large. "stages" is the proof
   *  strip: four across, smaller, numbered, because what matters there is
   *  the order rather than the size of any single picture. "hero" is the
   *  single opening image. */
  variant?: "grid" | "hero" | "stages";
  heroAlt?: string;
  /** The word "Work" in the current language, for image alt text like
   *  "Work 1 by David Kort". Falls back to English when not supplied. */
  workLabel?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    // lock background scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  return (
    <>
      {variant === "hero" ? (
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="group h-full w-full cursor-zoom-in"
          aria-label={heroAlt ?? `${workLabel} — ${name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* The hero variant is the LCP element on a profile page: it sits at
              the top and is the largest thing on screen. High priority, never
              lazy. */}
          <img
            src={images[0]}
            alt={heroAlt ?? `${workLabel} — ${name}`}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>
      ) : variant === "stages" ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((src, i) => {
            const caption = captions?.[i]?.trim();
            return (
              <figure key={i} className="m-0">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl"
                  style={{ background: "var(--color-brand-soft)" }}
                  aria-label={`${workLabel} ${i + 1} — ${name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={caption ? `${caption} — ${name}` : `${workLabel} ${i + 1} — ${name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* The number is the point of this strip: it says these
                      pictures are one piece in order, not four pieces. */}
                  <span
                    className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full text-[0.78rem] font-bold text-white"
                    style={{ background: "rgba(10,16,28,0.66)" }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                </button>
                {caption ? (
                  <figcaption
                    className="mt-2 whitespace-pre-line text-[0.85rem] leading-snug"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {images.map((src, i) => {
            const caption = captions?.[i]?.trim();
            return (
              <figure key={i} className="m-0">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl"
                  style={{ background: "var(--color-brand-soft)" }}
                  aria-label={`${workLabel} ${i + 1} — ${name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={caption ? `${caption} — ${name}` : `${workLabel} ${i + 1} — ${name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
                {caption ? (
                  <figcaption
                    className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      )}

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10,16,28,0.92)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${workLabel} — ${name}`}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.14)" }}
          >
            <CloseIcon size={22} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous work"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-[1.5rem] text-white md:left-6"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <figure className="m-0 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[open]}
              alt={
                captions?.[open]?.trim()
                  ? `${captions[open].trim()} — ${name}`
                  : `${workLabel} ${open + 1} — ${name}`
              }
              className="max-h-[78vh] max-w-[92vw] rounded-lg object-contain"
            />
            {captions?.[open]?.trim() ? (
              <figcaption className="mt-3 max-w-[92vw] whitespace-pre-line text-center text-[0.95rem] leading-relaxed text-white/85 sm:max-w-[60ch]">
                {captions[open].trim()}
              </figcaption>
            ) : null}
          </figure>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next work"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-[1.5rem] text-white md:right-6"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              ›
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <span
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[0.85rem] text-white"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              {open + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
