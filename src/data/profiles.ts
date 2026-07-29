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
  {
    id: "demo-mara-lindt",
    slug: "mara-lindt",
    name: "Mara Lindt",
    profileType: "creator",
    status: "free",
    verificationStatus: "none",
    mainCategory: "interior-designers",
    direction: "architecture-and-interiors",
    country: "Austria",
    city: "Vienna",
    shortDescription:
      "Interior designer. Plans the inside of a building down to the last door handle.",
    services: ["Interiors", "Furniture plans", "Lighting"],
    tags: ["Interiors"],
    socialLinks: {},
    dateCreated: "2025-06-02",
    demo: true,
  },
  {
    id: "demo-tomas-berg",
    slug: "tomas-berg",
    name: "Tomas Berg",
    profileType: "creator",
    status: "free",
    verificationStatus: "none",
    mainCategory: "landscape-designers",
    direction: "architecture-and-interiors",
    country: "Austria",
    city: "Graz",
    shortDescription:
      "Landscape designer. Works out what happens around the building: yards, planting, paths.",
    services: ["Yards", "Planting", "Public spaces"],
    tags: ["Landscape"],
    socialLinks: {},
    dateCreated: "2025-06-03",
    demo: true,
  },
  {
    id: "demo-ilja-hofer",
    slug: "ilja-hofer",
    name: "Ilja Hofer",
    profileType: "creator",
    status: "free",
    verificationStatus: "none",
    mainCategory: "3d-artists",
    direction: "design-and-3d",
    country: "Austria",
    city: "Vienna",
    shortDescription:
      "Builds the models and views a client can walk through before anything is built.",
    services: ["3D models", "Views", "Walk-throughs"],
    tags: ["3D"],
    socialLinks: {},
    dateCreated: "2025-06-04",
    demo: true,
  },
  {
    id: "demo-team-atrium",
    slug: "atrium-vier",
    name: "Atrium Vier",
    profileType: "team",
    status: "free",
    verificationStatus: "none",
    mainCategory: "architects",
    direction: "architecture-and-interiors",
    country: "Austria",
    city: "Vienna",
    teamSize: 4,
    contactPerson: "David Kort",
    members: [
      { name: "David Kort", role: "Architecture, working drawings", slug: "david-kort" },
      { name: "Mara Lindt", role: "Interiors", slug: "mara-lindt" },
      { name: "Tomas Berg", role: "Landscape, yards", slug: "tomas-berg" },
      { name: "Ilja Hofer", role: "Models and views", slug: "ilja-hofer" },
    ],
    introduction:
      "Atrium Vier is four people who take a building from the first sketch to the finished yard: the architecture, the interiors, the landscape around it and the views a client can walk through before anything is built.",
    shortDescription:
      "Four people who carry a building end to end: architecture, interiors, landscape, views.",
    fullDescription:
      "The four have worked together long enough that the parts fit: the interior is drawn against the real plan, the yard against the real building, the views against the real drawings. One conversation, one price, one team answering for the whole thing.",
    services: ["Houses", "Public buildings", "Interiors", "Yards"],
    tags: ["Architecture", "Interiors"],
    mainImage: "/images/david-kort-work-2.webp",
    gallery: [
      "/images/david-kort-work-2.webp",
      "/images/david-kort-work-1b.webp",
      "/images/david-kort-work-3.webp",
      "/images/david-kort-work-4.webp",
    ],
    galleryCaptions: [
      "A city block brought back into use: brick kept, everything behind it rebuilt.",
      "A mountain hotel: the wooden volume carries the rooms, the stone base holds the slope.",
      "Four residential towers with the yards planned before the buildings.",
      "A waterfront deck: three rings over the water, one of them a stage.",
    ],
    socialLinks: {},
    aiUsageStatement:
      "Everything here is drawn and modelled by the four of us. Drafting and modelling software is a tool; nothing is generated.",
    dateCreated: "2025-06-05",
    demo: true,
  },
];
