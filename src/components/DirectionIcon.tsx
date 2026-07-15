import type { DirectionColor } from "@/lib/types";

/**
 * Direction icon: a pencil drawing, not a vector glyph.
 *
 * The site's whole claim is that a person made the work, so the marks that
 * carry that claim are drawn rather than constructed. Hatching is what
 * makes them read as hand-made, and hatching does not survive being traced
 * into paths — it is hundreds of short strokes, and as vector it turns to
 * mud at tile size. So these ship as images.
 *
 * Each drawing is already inked in its own direction colour (the same
 * --color-dir-*-ink the tile text uses), which is why nothing here reads
 * `currentColor`: the colour lives in the file, not in the CSS.
 */

/** Files under /images/directions, one per direction colour key. */
const FILE: Record<DirectionColor | "all", string> = {
  art: "art",
  lit: "lit",
  writing: "writing",
  design: "design",
  photo: "photo",
  music: "music",
  code: "code",
  craft: "craft",
  services: "services",
  neutral: "neutral",
  all: "neutral",
};

export function DirectionIcon({
  color,
  size = 40,
  className = "",
}: {
  color: DirectionColor | "all";
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`/images/directions/${FILE[color]}.webp`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ display: "block" }}
    />
  );
}
