import { LocaleLink } from "./LocaleLink";
import type { DirectionColor } from "@/lib/types";
import { DirectionIcon } from "./DirectionIcon";
import type { Locale } from "@/i18n/config";

const bgVar: Record<DirectionColor | "all", string> = {
  art: "var(--color-dir-art-bg)",
  lit: "var(--color-dir-lit-bg)",
  writing: "var(--color-dir-writing-bg)",
  design: "var(--color-dir-design-bg)",
  photo: "var(--color-dir-photo-bg)",
  music: "var(--color-dir-music-bg)",
  code: "var(--color-dir-code-bg)",
  craft: "var(--color-dir-craft-bg)",
  services: "var(--color-dir-services-bg)",
  neutral: "var(--color-dir-neutral-bg)",
  all: "var(--color-dir-neutral-bg)",
};

const inkVar: Record<DirectionColor | "all", string> = {
  art: "var(--color-dir-art-ink)",
  lit: "var(--color-dir-lit-ink)",
  writing: "var(--color-dir-writing-ink)",
  design: "var(--color-dir-design-ink)",
  photo: "var(--color-dir-photo-ink)",
  music: "var(--color-dir-music-ink)",
  code: "var(--color-dir-code-ink)",
  craft: "var(--color-dir-craft-ink)",
  services: "var(--color-dir-services-ink)",
  neutral: "var(--color-dir-neutral-ink)",
  all: "var(--color-dir-neutral-ink)",
};

/**
 * Direction tile (TZ 5.5): raised object, duotone icon in the direction's
 * own colour embedded straight into the tile (no separate circle behind it).
 */
export function DirectionTile({
  lang,
  href,
  title,
  color,
  subtitle,
}: {
  lang: Locale;
  href: string;
  title: string;
  color: DirectionColor | "all";
  subtitle?: string;
}) {
  return (
    <LocaleLink lang={lang} href={href} className="tile" style={{ background: bgVar[color] }}>
      <span style={{ color: inkVar[color] }}>
        <DirectionIcon color={color} size={40} />
      </span>
      <span>
        <span className="tile-title block" style={{ color: "var(--color-ink)" }}>{title}</span>
        {subtitle && (
          <span className="mt-0.5 block text-[0.82rem]" style={{ color: "var(--color-muted-soft)" }}>
            {subtitle}
          </span>
        )}
      </span>
    </LocaleLink>
  );
}
