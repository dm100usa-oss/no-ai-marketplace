import { LocaleLink } from "./LocaleLink";
import { CheckShield } from "./icons";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

/**
 * The empty-category card. It is the real listing card with the spot
 * still free: same gradient, same author row, same verified badge, same
 * tags, same button slot. Someone deciding whether to join sees exactly
 * what their own card will look like, and the invitation sits where the
 * work would be.
 *
 * It only shows while a category has nobody in it. Once a real profile
 * lands there, the profile itself does this job and the card steps back.
 */

/** Same soft palette the real cards use, picked from the category slug so
 *  two categories never look identical. */
function gradient(seed: string): string {
  const hues = ["#e3ecfb", "#dff1e9", "#eae4fa", "#fbeedb", "#fbe4e9", "#fce7dc", "#ddf0f2"];
  let h = 0;
  for (const c of seed) h = (h + c.charCodeAt(0)) % hues.length;
  return `linear-gradient(135deg, ${hues[h]}, ${hues[(h + 3) % hues.length]})`;
}

/** Silhouette where a real profile carries a photo: it reads as "a face
 *  goes here" without asking anyone to parse initials that belong to
 *  nobody. */
function PersonSilhouette({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.6" fill={color} />
      <path
        d="M4.8 20c0-3.6 3.2-6 7.2-6s7.2 2.4 7.2 6"
        fill={color}
      />
    </svg>
  );
}

export function EmptySlotCard({
  lang,
  dict,
  categoryName,
  categorySlug,
}: {
  lang: Locale;
  dict: Dictionary;
  categoryName: string;
  categorySlug: string;
}) {
  const s = dict.states;

  return (
    <article className="card flex flex-col overflow-hidden">
      <div
        className="flex aspect-[4/3] flex-col items-center px-6 pt-8 text-center"
        style={{ background: gradient(categorySlug) }}
      >
        <p className="text-[1.05rem] leading-snug" style={{ color: "var(--color-muted-soft)" }}>
          {s.slotTitle.replace("{name}", categoryName.toLowerCase())}
        </p>
        <h3
          className="!mb-0 !mt-6 text-[1.05rem] font-semibold leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {s.slotMessage}
        </h3>
        <p
          className="mt-6 text-[1.2rem] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
        >
          {s.slotBeFirst}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-stretch justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2.5">
            {/* One tint for every category: a colour that shifts per direction
                fights the gradient behind it as often as it agrees with it. */}
            <span
              aria-hidden
              className="grid h-[2.7rem] w-[2.7rem] shrink-0 place-items-center rounded-full"
              style={{ background: "#fbeedb" }}
            >
              <PersonSilhouette color="#a9691a" />
            </span>
            <span className="min-w-0">
              <span
                className="block truncate font-semibold leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.slotName}
              </span>
              <span
                className="block truncate text-[0.85rem]"
                style={{ color: "var(--color-muted-soft)" }}
              >
                {s.slotRole}
              </span>
            </span>
          </span>
          {/* The badge spans the full height of the author row here: from the
              top of the name to the bottom of the profession line. On real
              cards it stays its normal size. */}
          <span
            className="badge badge-verified !flex shrink-0 !items-center self-stretch !py-0"
            title={dict.badges.verifiedTitle}
          >
            <CheckShield size={18} />
            {dict.badges.verifiedCreator}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="pill">{s.slotTagCountry}</span>
          <span className="pill">{s.slotTagDirection}</span>
          <span className="pill">{s.slotTagWork}</span>
        </div>

        <div className="mt-auto pt-1">
          <LocaleLink
            lang={lang}
            href="/join"
            className="btn btn-accent btn-full !py-3.5 text-[1rem]"
          >
            {s.slotAction}
          </LocaleLink>
          <p
            className="mt-2 text-center text-[0.78rem]"
            style={{ color: "var(--color-muted-soft)" }}
          >
            {s.slotNote}
          </p>
        </div>
      </div>
    </article>
  );
}
