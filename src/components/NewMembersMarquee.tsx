"use client";

import type { Locale } from "@/i18n/config";

/**
 * Second marquee, under the join call: "New members".
 *
 * Same slow drift as the work strip at the top, but the cards stand for
 * people and companies rather than pieces of work. Right now they are
 * soft translucent placeholders with a spot for a name; when real members
 * give permission, their photo or company logo and name go in here, one
 * card each.
 *
 * Eight cards for now. The list renders twice so the loop is seamless,
 * exactly like the work marquee. Decorative, so hidden from screen
 * readers.
 */

// Placeholder cards. Each has a soft tint and a spot for a future name.
// When a member joins (with permission) swap `tint` for their photo/logo
// and fill `name`.
const MEMBERS = [
  { tint: "#eaf1ff", name: "" },
  { tint: "#f3ecff", name: "" },
  { tint: "#eafaf1", name: "" },
  { tint: "#fff2ea", name: "" },
  { tint: "#eafcff", name: "" },
  { tint: "#fdeaf3", name: "" },
  { tint: "#f5f7ea", name: "" },
  { tint: "#eef0ff", name: "" },
];

function MemberCard({ tint, name }: { tint: string; name: string }) {
  return (
    <div className="members-marquee__card">
      <div
        className="members-marquee__photo"
        style={{ backgroundColor: tint }}
      />
      <div className="members-marquee__name">{name || "\u00A0"}</div>
    </div>
  );
}

export function NewMembersMarquee({
  lang,
  title,
}: {
  lang: Locale;
  title: string;
}) {
  void lang;
  return (
    <section className="members-marquee-section">
      <h2 className="members-marquee-title">{title}</h2>
      <div className="members-marquee" aria-hidden="true">
        <div className="members-marquee__track">
          {MEMBERS.map((m, i) => (
            <MemberCard key={`a-${i}`} tint={m.tint} name={m.name} />
          ))}
          {MEMBERS.map((m, i) => (
            <MemberCard key={`b-${i}`} tint={m.tint} name={m.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
