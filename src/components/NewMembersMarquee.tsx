"use client";

import Link from "next/link";
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

// A real member to show in the strip: photo, name and a link to the
// profile. The homepage resolves these; an empty list is fine and simply
// leaves the strip as all invitations.
export interface MarqueeMember {
  name: string;
  avatar: string;
  href: string;
}

function MemberCard({
  i,
  name,
  namePlaceholder,
  lang,
  member,
}: {
  i: number;
  name: string;
  namePlaceholder: string;
  lang: Locale;
  member?: MarqueeMember;
}) {
  // A real member links to their profile and shows their photo; an empty
  // slot is a soft gradient invitation that links to /join.
  const href = member ? `/${lang}${member.href}` : `/${lang}/new-member`;
  return (
    <Link
      href={href}
      className="members-marquee__card members-marquee__card--link"
    >
      <div
        className="members-marquee__photo"
        style={member ? undefined : { background: gradient(i) }}
      >
        {member ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatar}
            alt={member.name}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <PersonSilhouette color="rgba(90,110,150,0.55)" />
        )}
      </div>
      <div className="members-marquee__name">
        {member ? member.name : name || namePlaceholder}
      </div>
    </Link>
  );
}

export function NewMembersMarquee({
  lang,
  title,
  namePlaceholder,
  members = [],
}: {
  lang: Locale;
  title: string;
  namePlaceholder: string;
  members?: MarqueeMember[];
}) {
  // Real members first, then invitation slots up to eight, so the strip is
  // always full even with a single author in the catalog. The list renders
  // twice for a seamless loop.
  const slots = Array.from({ length: 8 }, (_, i) => ({
    i,
    member: members[i],
  }));

  return (
    <section className="members-marquee-section">
      <div className="members-marquee-inner">
        <h2 className="members-marquee-title">{title}</h2>
        <div className="members-marquee">
          <div className="members-marquee__track">
            {slots.map((s) => (
              <MemberCard
                key={`a-${s.i}`}
                i={s.i}
                name=""
                namePlaceholder={namePlaceholder}
                lang={lang}
                member={s.member}
              />
            ))}
            {slots.map((s) => (
              <MemberCard
                key={`b-${s.i}`}
                i={s.i}
                name=""
                namePlaceholder={namePlaceholder}
                lang={lang}
                member={s.member}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
