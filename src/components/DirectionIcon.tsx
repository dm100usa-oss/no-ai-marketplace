import type { DirectionColor } from "@/lib/types";

/**
 * Duotone direction icons (TZ 5.5): filled in two tones of one colour
 * — a saturated main tone plus a lighter tone of the same family —
 * NOT thin uniform lines. Single shared viewBox (0 0 48 48), sharp edges,
 * embedded straight into the tile. Colour comes from the direction.
 *
 * `ink` = saturated tone (currentColor via the direction ink var),
 * `soft` = lighter tone of the same family (55% opacity of ink).
 */

type IconKind =
  | "art"
  | "lit"
  | "writing"
  | "design"
  | "photo"
  | "music"
  | "code"
  | "craft"
  | "services"
  | "all";

const map: Record<DirectionColor | "all", IconKind> = {
  art: "art",
  lit: "lit",
  writing: "writing",
  design: "design",
  photo: "photo",
  music: "music",
  code: "code",
  craft: "craft",
  services: "services",
  neutral: "all",
  all: "all",
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
  const kind = map[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      shapeRendering="geometricPrecision"
    >
      <Shape kind={kind} />
    </svg>
  );
}

/** soft tone = same ink at reduced alpha */
const SOFT = 0.5;

function Shape({ kind }: { kind: IconKind }) {
  switch (kind) {
    case "art": // palette
      return (
        <>
          <path
            d="M24 6C13.5 6 5 13.6 5 23c0 9 7 15 15.5 15 2.2 0 3.8-1.7 3.8-3.7 0-1-.4-1.8-1-2.5-.6-.7-1-1.4-1-2.3 0-2 1.7-3.5 3.7-3.5H30c6.1 0 11-4.7 11-11C41 12.9 33.4 6 24 6Z"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <circle cx="14.5" cy="21" r="2.6" fill="currentColor" />
          <circle cx="20" cy="14" r="2.6" fill="currentColor" />
          <circle cx="28.5" cy="14" r="2.6" fill="currentColor" />
          <circle cx="34" cy="21" r="2.6" fill="currentColor" />
        </>
      );
    case "lit": // open book
      return (
        <>
          <path
            d="M4 11c6-2.5 12-2.5 20 1v25c-8-3.5-14-3.5-20-1V11Z"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path
            d="M44 11c-6-2.5-12-2.5-20 1v25c8-3.5 14-3.5 20-1V11Z"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path
            d="M24 12v25"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </>
      );
    case "writing": // pen nib
      return (
        <>
          <path
            d="M9 39l4-13 20-20 9 9-20 20-13 4Z"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path d="M33 6l9 9-4.5 4.5-9-9L33 6Z" fill="currentColor" />
          <circle cx="16" cy="32" r="2.6" fill="currentColor" />
        </>
      );
    case "design": // stacked layers
      return (
        <>
          <path
            d="M24 8 6 17l18 9 18-9-18-9Z"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path
            d="M6 25l18 9 18-9M6 33l18 9 18-9"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </>
      );
    case "photo": // camera
      return (
        <>
          <rect
            x="5"
            y="14"
            width="38"
            height="26"
            rx="5"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path d="M17 14l3-5h8l3 5H17Z" fill="currentColor" />
          <circle cx="24" cy="27" r="7.5" fill="currentColor" />
          <circle cx="24" cy="27" r="3.2" fill="#fff" fillOpacity="0.85" />
        </>
      );
    case "music": // note
      return (
        <>
          <path
            d="M18 10l20-4v22a7 7 0 1 1-4-6.3V13l-12 2.4V32a7 7 0 1 1-4-6.3V10Z"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <circle cx="14" cy="34" r="6.5" fill="currentColor" />
          <circle cx="34" cy="30" r="6.5" fill="currentColor" />
        </>
      );
    case "code": // angle brackets
      return (
        <>
          <rect
            x="5"
            y="9"
            width="38"
            height="30"
            rx="5"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path
            d="M18 18l-6 6 6 6M30 18l6 6-6 6"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "craft": // needle & thread spool
      return (
        <>
          <rect
            x="12"
            y="8"
            width="24"
            height="32"
            rx="4"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path d="M8 14h32M8 34h32" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M20 20c4 3 4 5 8 8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
    case "services": // briefcase
      return (
        <>
          <rect
            x="5"
            y="16"
            width="38"
            height="24"
            rx="5"
            fill="currentColor"
            fillOpacity={SOFT}
          />
          <path
            d="M17 16v-4a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <rect x="5" y="24" width="38" height="5" fill="currentColor" />
        </>
      );
    case "all": // grid
    default:
      return (
        <>
          <rect x="7" y="7" width="15" height="15" rx="4" fill="currentColor" />
          <rect x="26" y="7" width="15" height="15" rx="4" fill="currentColor" fillOpacity={SOFT} />
          <rect x="7" y="26" width="15" height="15" rx="4" fill="currentColor" fillOpacity={SOFT} />
          <rect x="26" y="26" width="15" height="15" rx="4" fill="currentColor" />
        </>
      );
  }
}
