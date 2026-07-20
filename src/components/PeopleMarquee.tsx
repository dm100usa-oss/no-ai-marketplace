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
 * Files under /images/people. Order is deliberate: the bright abstracts sit
 * apart so they never arrive together, and no two shots of the same craft
 * stand side by side. The two guitar frames are twelve cards apart; the
 * photographs the owner shot himself are spread across the loop rather than
 * clustered.
 *
 * Weighted towards material over paper. A page of handwriting is
 * unreadable at 120px and turns into grey noise; clay, wood and glass
 * still read as themselves. Drawings and plans lose to the same rule: at
 * this size thin linework goes flat and reads as a gap in the band.
 */
const SHOTS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
];

function Card({ slug, eager }: { slug: string; eager: boolean }) {
  return (
    <div
      className="people-marquee__card"
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={`/images/people/${slug}.webp`}
        alt=""
        width={600}
        height={800}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      <span className="people-marquee__guard" aria-hidden="true" />
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
