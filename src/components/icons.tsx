/** Small utility UI icons. Kept minimal and consistent. */

type P = { size?: number; className?: string; strokeWidth?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true as const,
});

export const SearchIcon = ({ size = 20, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const MenuIcon = ({ size = 24, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ size = 24, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const ChevronDown = ({ size = 20, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRight = ({ size = 20, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ExternalLink = ({ size = 18, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14 4h6v6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 4l-9 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckShield = ({ size = 16, className = "" }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3Z" fill="currentColor" fillOpacity="0.9" />
    <path d="M8.5 12l2.5 2.5 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ size = 16, className = "" }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z" fill="currentColor" />
  </svg>
);

export const FilterIcon = ({ size = 18, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const PlusIcon = ({ size = 20, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const MinusIcon = ({ size = 20, className = "", strokeWidth = 2.2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const UsersIcon = ({ size = 22, className = "", strokeWidth = 2 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M2.5 19c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="17" cy="9" r="2.7" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M17 14c2.8 0 5 2 5 5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const HandshakeIcon = ({ size = 22, className = "", strokeWidth = 2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 12l4-4 3 3 4-4 4 4-4 4-3-3-4 4-4-4Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M13 11l3 3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const SparkIcon = ({ size = 22, className = "", strokeWidth = 2 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

/**
 * Three filled silhouettes: a team.
 *
 * Filled rather than outlined, unlike everything above it, and on its own
 * wider viewBox — three figures squeezed into the shared 24-square would
 * either touch or shrink to nothing. The middle one stands taller and
 * slightly forward so the group reads as a group and not as three equal
 * marks in a row.
 */
export const TeamIcon = ({ size = 27, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={(size * 24) / 30}
    viewBox="0 0 30 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <circle cx="7" cy="8" r="3.1" />
    <path d="M1.5 20c0-3.1 2.5-5.4 5.5-5.4s5.5 2.3 5.5 5.4z" />
    <circle cx="23" cy="8" r="3.1" />
    <path d="M17.5 20c0-3.1 2.5-5.4 5.5-5.4s5.5 2.3 5.5 5.4z" />
    <circle cx="15" cy="5.4" r="3.8" />
    <path d="M8.4 20c0-3.7 3-6.6 6.6-6.6s6.6 2.9 6.6 6.6z" />
  </svg>
);
