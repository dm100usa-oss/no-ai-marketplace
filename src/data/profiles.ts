import type { Profile } from "@/lib/types";

/**
 * A single demo profile, kept on purpose.
 *
 * The catalog needs at least one entry so the grid, the category filters
 * and the profile page can be seen to work before the first real author
 * arrives; an empty catalog cannot be checked. Twenty-six earlier demo
 * placeholders were removed to avoid the clutter that caused confusion
 * before — one profile, clearly marked "demo", cannot be mistaken for a
 * real person.
 *
 * David Kort is a fictional architect. The images are the owner's own
 * architectural work, so nothing here is borrowed or generated. The `demo`
 * flag keeps him out of the real "new authors" and "new works" logic once
 * a genuine author is published: until then the homepage may show him so
 * the blocks are not empty; from the first real author on, he steps aside
 * on the homepage and remains only as the example on the join page.
 */
export const profiles: Profile[] = [
  {
    id: "demo-david-kort",
    slug: "david-kort",
    name: "Дэвид Корт",
    profileType: "creator",
    status: "featured",
    verificationStatus: "verified-creator",
    mainCategory: "architects",
    direction: "architecture-and-interiors",
    country: "Австрия",
    city: "Вена",
    languages: ["Немецкий", "Английский"],
    shortDescription:
      "Проектирует жилые дома и общественные здания. Ведет проект от эскиза до сдачи.",
    fullDescription:
      "Дэвид Корт проектирует жилые дома, общественные здания и городские пространства. Каждый проект начинается с эскиза и доводится до чертежей, по которым строят. За работой стоит живой человек, отвечающий за каждое решение.",
    services: ["Жилые дома", "Общественные здания", "Городские пространства"],
    tags: ["Архитектура", "Проектирование"],
    avatar: "/images/david-kort-avatar.webp",
    mainImage: "/images/david-kort-work-1b.webp",
    gallery: [
      "/images/david-kort-work-1b.webp",
      "/images/david-kort-work-2.webp",
      "/images/david-kort-work-3.webp",
      "/images/david-kort-work-4.webp",
    ],
    socialLinks: { portfolio: "#" },
    aiUsageStatement:
      "Каждый проект выполнен человеком. Расчетные и чертежные программы это инструмент, генерации нет.",
    verificationDescription:
      "Рабочие чертежи и фотографии построенных объектов рассмотрены вручную.",
    dateCreated: "2025-06-01",
    demo: true,
    showOnHomepage: true,
  },
];
