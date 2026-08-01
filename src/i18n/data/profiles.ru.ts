/**
 * Russian translations for profiles, keyed by slug. English source is in
 * src/data/profiles.ts and is never modified.
 *
 * What is translated: shortDescription, fullDescription, services,
 * products, tags, aiUsageStatement, verificationDescription, and the
 * country name (so filters and labels read naturally in Russian).
 *
 * What is NOT translated (kept as in the original): author and company
 * names, city names, studio/brand names, external platform names.
 *
 * Any missing field falls back to English automatically.
 */

export interface ProfileTranslation {
  /** Country label in Russian (identity stays via slug; this is display only). */
  country?: string;
  /** City label in Russian, for well-known cities (Вена, Лондon, Токио).
   *  Optional: without it the city shows in its original spelling. */
  city?: string;
  /** Hand-written introduction in Russian, shown at the top of the profile
   *  in place of the assembled one. */
  introduction?: string;
  shortDescription?: string;
  fullDescription?: string;
  services?: string[];
  products?: string[];
  tags?: string[];
  aiUsageStatement?: string;
  verificationDescription?: string;
  /** Lines under the works, same order as the pictures in the English
   *  record. Left out, the English captions show as they are. */
  galleryCaptions?: string[];
  /** Lines under the work stages, same order as the pictures. Left out,
   *  the English ones show as they are. */
  stageCaptions?: string[];
}

export const profilesRu: Record<string, ProfileTranslation> = {
  "david-kort": {
    country: "Австрия",
    city: "Вена",
    introduction:
      "Знакомьтесь: David Kort, архитектор из Вены. Проектирует частные дома, общественные здания и городские пространства. Ведет каждый проект от первого наброска до рабочих чертежей, по которым идет стройка, и лично отвечает за каждое решение.",
    shortDescription:
      "Проектирует жилые дома и общественные здания. Ведет проект от эскиза до сдачи.",
    fullDescription:
      "Дэвид Корт проектирует жилые дома, общественные здания и городские пространства. Каждый проект начинается с эскиза и доводится до чертежей, по которым строят. За работой стоит живой человек, отвечающий за каждое решение.",
    services: ["Жилые дома", "Общественные здания", "Городские пространства"],
    tags: ["Архитектура", "Проектирование"],
    aiUsageStatement:
      "Каждый проект выполнен человеком. Расчетные и чертежные программы это инструмент, генерации нет.",
    verificationDescription:
      "Рабочие чертежи и фотографии построенных объектов рассмотрены вручную.",
  },
  "mara-lindt": {
    country: "Австрия",
    city: "Вена",
    shortDescription:
      "Дизайнер интерьеров. Продумывает здание изнутри, вплоть до дверной ручки.",
    services: ["Интерьеры", "Расстановка мебели", "Свет"],
    tags: ["Интерьеры"],
  },
  "tomas-berg": {
    country: "Австрия",
    city: "Грац",
    shortDescription:
      "Ландшафтный дизайнер. Отвечает за то, что вокруг здания: дворы, посадки, дорожки.",
    services: ["Дворы", "Озеленение", "Городские пространства"],
    tags: ["Ландшафт"],
  },
  "ilja-hofer": {
    country: "Австрия",
    city: "Вена",
    shortDescription:
      "Делает модели и виды, по которым заказчик проходит по зданию до начала стройки.",
    services: ["3D модели", "Виды", "Обходы"],
    tags: ["3D"],
  },
  "atrium-vier": {
    country: "Австрия",
    city: "Вена",
    introduction:
      "Atrium Vier это четверо, которые ведут здание от первого наброска до готового двора: архитектура, интерьеры, ландшафт вокруг и виды, по которым заказчик проходит по дому до начала стройки.",
    shortDescription:
      "Четверо, которые ведут здание целиком: архитектура, интерьеры, ландшафт, виды.",
    fullDescription:
      "Эти четверо работают вместе достаточно давно, чтобы части сходились: интерьер рисуется по настоящему плану, двор по настоящему зданию, виды по настоящим чертежам. Один разговор, одна цена, одна команда, отвечающая за все сразу.",
    services: ["Дома", "Общественные здания", "Интерьеры", "Дворы"],
    tags: ["Архитектура", "Интерьеры"],
    galleryCaptions: [
      "Квартал, возвращенный в город: кирпич сохранен, все за ним построено заново.",
      "Отель в горах: деревянный объем несет номера, каменное основание держит склон.",
      "Четыре жилые башни, где дворы спроектированы раньше самих домов.",
      "Настил на воде: три кольца над заливом, одно из них сцена.",
    ],
    aiUsageStatement:
      "Все здесь нарисовано и смоделировано нами четверыми. Чертежные и модельные программы это инструмент, генерации нет.",
  },
};
