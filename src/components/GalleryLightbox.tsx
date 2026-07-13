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
  variant = "grid",
  heroAlt,
}: {
  images: string[];
  name: string;
  variant?: "grid" | "hero";
  heroAlt?: string;
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
          aria-label={`Open ${heroAlt ?? `work by ${name}`} full screen`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={heroAlt ?? `Featured work by ${name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className="group aspect-square cursor-zoom-in overflow-hidden rounded-xl"
              style={{ background: "var(--color-brand-soft)" }}
              aria-label={`Open work ${i + 1} by ${name} full screen`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Work ${i + 1} by ${name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10,16,28,0.92)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Work by ${name}`}
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
          <img
            src={images[open]}
            alt={`Work ${open + 1} by ${name}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
          />

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
