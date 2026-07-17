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

/** Avatar tint from the same family, a shade the initials read against. */
function avatarTint(seed: string): { bg: string; fg: string } {
  const pairs = [
    { bg: "#e3ecfb", fg: "#3e6fcc" },
    { bg: "#dff1e9", fg: "#157a58" },
    { bg: "#eae4fa", fg: "#7a6bd6" },
    { bg: "#fbeedb", fg: "#a9691a" },
    { bg: "#fbe4e9", fg: "#c44a6e" },
    { bg: "#fce7dc", fg: "#d85a30" },
    { bg: "#ddf0f2", fg: "#1e8c96" },
  ];
  let h = 0;
  for (const c of seed) h = (h + c.charCodeAt(0)) % pairs.length;
  return pairs[h];
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
  const tint = avatarTint(categorySlug);

  return (
    <article className="card flex flex-col overflow-hidden">
      <div
        className="flex aspect-[4/3] flex-col items-center justify-center gap-2.5 px-6 text-center"
        style={{ background: gradient(categorySlug) }}
      >
        <h3
          className="!m-0 text-[1.05rem] leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {s.slotTitle.replace("{name}", categoryName.toLowerCase())}
        </h3>
        <p className="text-[0.85rem] leading-snug" style={{ color: "var(--color-muted)" }}>
          {s.slotMessage}
        </p>
        <p
          className="text-[0.9rem] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
        >
          {s.slotBeFirst}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.8rem] font-bold"
              style={{
                background: tint.bg,
                color: tint.fg,
                fontFamily: "var(--font-display)",
              }}
            >
              {s.slotInitials}
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
          <span className="badge badge-verified shrink-0" title={dict.badges.verifiedTitle}>
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
