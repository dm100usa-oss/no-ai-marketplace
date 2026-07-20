"use client";

import type { Locale } from "@/i18n/config";

/**
 * Second marquee, under the join call: "New members".
 *
 * Same slow drift as the work strip at the top, on the same soft-blue band.
 * The cards match the empty-slot card style used across the catalogue: a
 * soft diagonal gradient with a person silhouette and a spot for a name.
 * When real members join (with their permission) their photo or company
 * logo and name replace a placeholder, one card each.
 *
 * Eight cards for now. The list renders twice so the loop is seamless.
 * Decorative, so hidden from screen readers.
 */

// Same soft palette the catalogue's empty-slot cards use.
const HUES = ["#e3ecfb", "#dff1e9", "#eae4fa", "#fbeedb", "#fbe4e9", "#fce7dc", "#ddf0f2"];

function gradient(i: number): string {
  const a = HUES[i % HUES.length];
  const b = HUES[(i + 3) % HUES.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

function PersonSilhouette({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" fill={color} />
      <path d="M4.8 20c0-3.6 3.2-6 7.2-6s7.2 2.4 7.2 6" fill={color} />
    </svg>
  );
}

// Eight placeholder members. Swap a card's data for a real photo/logo and
// name once a member joins (with permission).
const MEMBERS = Array.from({ length: 8 }, (_, i) => ({ i, name: "" }));

function MemberCard({
  i,
  name,
  namePlaceholder,
}: {
  i: number;
  name: string;
  namePlaceholder: string;
}) {
  return (
    <div className="members-marquee__card">
      <div className="members-marquee__photo" style={{ background: gradient(i) }}>
        <PersonSilhouette color="rgba(90,110,150,0.55)" />
      </div>
      <div className="members-marquee__name">{name || namePlaceholder}</div>
    </div>
  );
}

export function NewMembersMarquee({
  lang,
  title,
  namePlaceholder,
}: {
  lang: Locale;
  title: string;
  namePlaceholder: string;
}) {
  void lang;
  return (
    <section className="members-marquee-section">
      <div className="members-marquee-inner">
        <h2 className="members-marquee-title">{title}</h2>
        <div className="members-marquee" aria-hidden="true">
          <div className="members-marquee__track">
            {MEMBERS.map((m) => (
              <MemberCard
                key={`a-${m.i}`}
                i={m.i}
                name={m.name}
                namePlaceholder={namePlaceholder}
              />
            ))}
            {MEMBERS.map((m) => (
              <MemberCard
                key={`b-${m.i}`}
                i={m.i}
                name={m.name}
                namePlaceholder={namePlaceholder}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
