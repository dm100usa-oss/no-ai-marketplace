import type { Locale } from "@/i18n/config";

/**
 * Slowly drifting band of faces under the hero. The point it makes is the
 * point of the whole site: real people at real work, not generated output.
 * Purely decorative, so the cards are not links and the whole strip is
 * hidden from screen readers.
 *
 * The loop is CSS only: the list is rendered twice and the track slides by
 * exactly half its width, so the seam never shows. No JS, no timers.
 * Motion pauses on hover and stops outright when the visitor has asked the
 * system for reduced motion (see globals.css).
 */

export interface PersonShot {
  /** File under /images/people, without extension. */
  slug: string;
  /** Caption shown at the foot of the card. */
  label: string;
}

/**
 * Order is deliberate: the three outdoor shots (sketcher, violinist,
 * sound-recordist) sit at positions 5, 12 and 19 so they never land next to
 * one another as the strip moves.
 */
export const PEOPLE: Record<Locale, PersonShot[]> = {
  ru: [
    { slug: "artist", label: "Художник" },
    { slug: "operator", label: "Оператор" },
    { slug: "guitarist", label: "Гитарист" },
    { slug: "sound-engineer", label: "Звукорежиссёр" },
    { slug: "sketcher", label: "Скетчер" },
    { slug: "painter", label: "Живописец" },
    { slug: "sculptor", label: "Скульптор" },
    { slug: "designer", label: "Дизайнер" },
    { slug: "illustrator", label: "Иллюстратор" },
    { slug: "writer", label: "Писатель" },
    { slug: "graphic-artist", label: "Художник-график" },
    { slug: "violinist", label: "Скрипач" },
    { slug: "composer", label: "Композитор" },
    { slug: "programmer", label: "Программист" },
    { slug: "screenwriter", label: "Сценарист" },
    { slug: "cinematographer", label: "Кинооператор" },
    { slug: "sound-producer", label: "Саунд-продюсер" },
    { slug: "director", label: "Режиссёр" },
    { slug: "sound-recordist", label: "Звукооператор" },
    { slug: "cellist", label: "Виолончелист" },
    { slug: "poet", label: "Поэт" },
  ],
  en: [
    { slug: "artist", label: "Artist" },
    { slug: "operator", label: "Camera operator" },
    { slug: "guitarist", label: "Guitarist" },
    { slug: "sound-engineer", label: "Sound engineer" },
    { slug: "sketcher", label: "Sketch artist" },
    { slug: "painter", label: "Painter" },
    { slug: "sculptor", label: "Sculptor" },
    { slug: "designer", label: "Designer" },
    { slug: "illustrator", label: "Illustrator" },
    { slug: "writer", label: "Writer" },
    { slug: "graphic-artist", label: "Graphic artist" },
    { slug: "violinist", label: "Violinist" },
    { slug: "composer", label: "Composer" },
    { slug: "programmer", label: "Programmer" },
    { slug: "screenwriter", label: "Screenwriter" },
    { slug: "cinematographer", label: "Cinematographer" },
    { slug: "sound-producer", label: "Sound producer" },
    { slug: "director", label: "Director" },
    { slug: "sound-recordist", label: "Sound recordist" },
    { slug: "cellist", label: "Cellist" },
    { slug: "poet", label: "Poet" },
  ],
};

function Card({ person, eager }: { person: PersonShot; eager: boolean }) {
  return (
    <figure className="people-marquee__card">
      <img
        src={`/images/people/${person.slug}.webp`}
        alt=""
        width={600}
        height={800}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>{person.label}</figcaption>
    </figure>
  );
}

export function PeopleMarquee({ lang }: { lang: Locale }) {
  const people = PEOPLE[lang] ?? PEOPLE.en;

  return (
    <div className="people-marquee" aria-hidden="true">
      <div className="people-marquee__track">
        {/* Two identical passes: the second one covers the wrap-around. */}
        {people.map((p, i) => (
          <Card key={`a-${p.slug}`} person={p} eager={i < 4} />
        ))}
        {people.map((p) => (
          <Card key={`b-${p.slug}`} person={p} eager={false} />
        ))}
      </div>
    </div>
  );
}
