import type { Locale } from "@/i18n/config";

/**
 * Slowly drifting band of work under the hero: paint, clay, notes, a page
 * of a manuscript. Things a person made, photographed on the desk where
 * they were made.
 *
 * Objects, not faces. A face has to be somebody, and on a site whose whole
 * claim is "no AI" a generated somebody is the one thing that would sink
 * it. A brushstroke is nobody. It just shows the material and the hand
 * that moved through it.
 *
 * Purely decorative, so no links and the whole strip is hidden from screen
 * readers. The loop is CSS only: the list renders twice and the track
 * slides by exactly half its width, so the seam never shows. Motion pauses
 * on hover and stops for prefers-reduced-motion (see globals.css).
 */

/**
 * Files under /images/people. Order is deliberate: the three bright
 * abstracts sit at 3, 10 and 17 so they never arrive together, and no two
 * shots of the same craft stand side by side.
 */
const SHOTS = [
  "paint-canvas",
  "sculpture",
  "literature",
  "paint-expression",
  "architecture",
  "music",
  "text",
  "paint-knife",
  "photography",
  "graphics",
  "paint-modern",
  "ceramics",
  "code-paper",
  "paint-strokes",
  "fashion",
  "typography",
  "interior",
  "paint-minimal",
  "film",
  "code-notebook",
  "jewelry",
  "paint-abstract",
];

function Card({ slug, eager }: { slug: string; eager: boolean }) {
  return (
    <div className="people-marquee__card">
      <img
        src={`/images/people/${slug}.webp`}
        alt=""
        width={600}
        height={800}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

export function PeopleMarquee({ lang }: { lang: Locale }) {
  void lang; // no text in the strip any more; kept so callers need no change
  return (
    <div className="people-marquee" aria-hidden="true">
      <div className="people-marquee__track">
        {SHOTS.map((s, i) => (
          <Card key={`a-${s}`} slug={s} eager={i < 4} />
        ))}
        {SHOTS.map((s) => (
          <Card key={`b-${s}`} slug={s} eager={false} />
        ))}
      </div>
    </div>
  );
}
