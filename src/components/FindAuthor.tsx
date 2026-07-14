"use client";

import { useState } from "react";
import { LocaleLink } from "./LocaleLink";
import { SearchIcon, ArrowRight } from "./icons";
import type { Locale } from "@/i18n/config";

export type FindAuthorCategory = {
  slug: string;
  name: string;
};

/**
 * Hero primary action for buyers who don't know any creators yet.
 * One big button opens a list of popular categories; picking one
 * takes the visitor straight to that category's catalog page.
 */
export function FindAuthor({
  lang,
  label,
  hint,
  categories,
}: {
  lang: Locale;
  label: string;
  hint: string;
  categories: FindAuthorCategory[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn btn-ink btn-full btn-lg"
      >
        <SearchIcon />
        {label}
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-white/85 p-3" style={{ boxShadow: "var(--shadow-raise)" }}>
          <p className="mb-2 px-1 text-[0.9rem] font-medium" style={{ color: "var(--color-muted)" }}>
            {hint}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((c) => (
              <LocaleLink
                key={c.slug}
                lang={lang}
                href={`/categories/${c.slug}`}
                className="btn btn-quiet w-full justify-between text-[0.95rem]"
              >
                {c.name}
                <ArrowRight size={15} />
              </LocaleLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
