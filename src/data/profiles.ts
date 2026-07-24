import type { Profile } from "@/lib/types";

/**
 * A single demo profile, kept on purpose.
 *
 * The catalog needs at least one entry so the grid, the category filters
 * and the profile page can be seen to work before the first real author
 * arrives; an empty catalog cannot be checked. One profile, clearly marked
 * "demo", cannot be mistaken for a real person.
 *
 * David Kort is a fictional architect. The images are the owner's own
 * architectural work, so nothing here is borrowed or generated. Following
 * the project's own rule, the base record is English and the Russian
 * version is laid over it from src/i18n/data/profiles.ru.ts; the name and
 * city stay as they are in both languages. The `demo` flag keeps him out
 * of the real "new authors" and "new works" logic once a genuine author is
 * published: until then the homepage may show him so the blocks are not
 * empty; from the first real author on, he steps aside on the homepage and
 * remains only as the example on the join page.
 */
export const profiles: Profile[] = [
  {
    id: "demo-david-kort",
    slug: "david-kort",
    name: "David Kort",
    profileType: "creator",
    status: "featured",
    verificationStatus: "verified-creator",
    mainCategory: "architects",
    direction: "architecture-and-interiors",
    country: "Austria",
    city: "Vienna",
    languages: ["German", "English"],
    introduction:
      "Meet David Kort, an architect from Vienna. He designs private homes, public buildings and shared city spaces, carrying every project from the first sketch to the working drawings the builders follow, and answering personally for each decision along the way.",
    shortDescription:
      "Designs homes and public buildings. Sees every project through, from first sketch to finished build.",
    fullDescription:
      "David Kort designs homes, public buildings and shared city spaces. Every project starts as a sketch and is carried through to the working drawings the builders follow. Behind the work is a real person, answerable for every decision on the page.",
    services: ["Homes", "Public buildings", "City spaces"],
    tags: ["Architecture", "Design"],
    avatar: "/images/david-kort-avatar.webp",
    mainImage: "/images/david-kort-work-1b.webp",
    gallery: [
      "/images/david-kort-work-1b.webp",
      "/images/david-kort-work-2.webp",
      "/images/david-kort-work-3.webp",
      "/images/david-kort-work-4.webp",
    ],
    socialLinks: {},
    aiUsageStatement:
      "Every project is done by a person. Drafting and calculation software is a tool; there is no generation involved.",
    verificationDescription:
      "Working drawings and photographs of completed buildings were reviewed by hand.",
    dateCreated: "2025-06-01",
    demo: true,
    showOnHomepage: true,
  },
];
