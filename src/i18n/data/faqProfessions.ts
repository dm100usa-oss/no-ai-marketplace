import type { Locale } from "@/i18n/config";

/**
 * FAQ by profession (HTVS). One page per profession: a page with a single
 * clear topic ranks higher than a page where everything sits together, and
 * AI engines cite single-topic pages rather than collections.
 *
 * Rules that these entries follow, learned the hard way:
 * - the answer comes first, in the first sentence, so an AI can lift it whole
 * - the question is worded the way people actually ask it
 * - 3-5 sentences per answer, no walls of text
 * - the link to us appears only where it IS the answer
 *
 * The HTVS scale itself lives on /faq once. Profession pages link to it
 * rather than repeating the four levels five times over.
 *
 * Project line: generation is not allowed, assistive tools are fine.
 */

export interface FaqQA {
  q: string;
  a: string;
  /** Optional links shown under the answer. */
  links?: { label: string; href: string }[];
}

export interface FaqProfession {
  slug: string;
  /** Matching catalog category slug, for the mutual link. */
  category: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  items: FaqQA[];
}

const ru: FaqProfession[] = [
  {
    slug: "illustrators",
    category: "illustrators",
    metaTitle: "Иллюстраторы без ИИ: частые вопросы",
    metaDescription:
      "Где разместить портфолио иллюстратору без ИИ, как доказать ручную работу и как проверить иллюстратора перед заказом.",
    title: "Иллюстраторы: частые вопросы",
    intro:
      "Вопросы, которые чаще всего задают иллюстраторы и те, кто их ищет. Ответы короткие и по делу.",
    items: [
      {
        q: "Где разместить портфолио иллюстратору без ИИ?",
        a: "В каталоге, где отсутствие генерации это условие входа, а не приписка мелким шрифтом. Здесь профиль ведет на ваш собственный сайт или магазин, а комиссии с заказов нет: вы платите за размещение и забираете весь гонорар. На крупных биржах ваши работы стоят в одной выдаче с генерацией, и заказчик не видит разницы, пока не спросит.",
        links: [
          { label: "Добавить профиль", href: "/join" },
          { label: "Каталог иллюстраторов", href: "/categories/illustrators" },
        ],
      },
      {
        q: "Как доказать, что иллюстрация нарисована вручную?",
        a: "Показать послойный файл и эскизы: генерация приходит одним плоским слоем, и подделать историю слоев задним числом нельзя. Единого доказательства не существует, есть уровни: заявление о процессе, исходники, история версий, подпись C2PA. Подниматься на верхний уровень необязательно, большинству заказчиков хватает исходников.",
        links: [{ label: "Как устроен метод HTVS", href: "/method" }],
      },
      {
        q: "Нужно ли записывать таймлапс рисования?",
        a: "Не обязательно. Послойный файл надежнее: его нельзя подделать задним числом, и он у вас есть после каждой работы, тогда как таймлапс надо помнить включить. Procreate пишет таймлапс сам, в Photoshop это делается записью экрана.",
      },
      {
        q: "Что делать, если заказчик обвиняет в использовании нейросети?",
        a: "Прислать послойный файл и пару эскизов. Это снимает вопрос в девяти случаях из десяти, спорить не нужно. Если заказчик ссылается на детектор, стоит знать: детекторы ненадежны, стэнфордское исследование показало ошибку в 61% на текстах авторов, для которых английский неродной, а для изображений точность еще ниже. Детектор это не доказательство, а повод посмотреть исходники.",
        links: [{ label: "Добавить профиль", href: "/join" }],
      },
      {
        q: "Почему ручная иллюстрация стоит дороже генерации?",
        a: "Заказчик платит за три вещи, которых у генерации нет. Права: Верховный суд США 2 марта 2026 оставил в силе требование человеческого авторства, поэтому сгенерированное изображение зарегистрировать нельзя, а вашу работу можно. Правки: вы поменяете позу героя, не переделывая все, а генерация переделывается целиком и возвращается другой. Точность: реальный товар, конкретный интерьер, узнаваемое лицо, где генерация промахивается в деталях, за которые и платят.",
      },
      {
        q: "Можно ли убирать фон в Photoshop, если работаешь без ИИ?",
        a: "Да. Линия простая: нельзя генерировать, все остальное можно. Убрать фон, поправить цвет, почистить края, найти референс это инструменты, и автор остается автором. Так же рассуждает закон: Бюро по авторским правам США считает, что вспомогательное использование ИИ не лишает работу охраны.",
        links: [{ label: "Стандарты Human-Made", href: "/human-made-standards" }],
      },
      {
        q: "Как проверить, что иллюстратор не использует ИИ?",
        a: "Попросить послойный файл предыдущей работы и два-три эскиза. Уходит минута, и этого достаточно: генерация приходит одним плоским слоем. Чего делать не стоит: гнать картинку через детектор и судить по анатомии рук, потому что приметы 2023 года устарели, а детекторы ошибаются. В каталоге иллюстраторы описывают процесс сразу в профиле.",
        links: [{ label: "Каталог иллюстраторов", href: "/categories/illustrators" }],
      },
    ],
  },
];

const en: FaqProfession[] = [
  {
    slug: "illustrators",
    category: "illustrators",
    metaTitle: "Illustrators without AI: common questions",
    metaDescription:
      "Where an illustrator can list a portfolio without AI, how to prove hand-drawn work, and how to check an illustrator before hiring.",
    title: "Illustrators: common questions",
    intro:
      "The questions illustrators and the people hiring them ask most. Short answers.",
    items: [
      {
        q: "Where can an illustrator list a portfolio without AI?",
        a: "In a directory where no generation is the condition of entry, not a line of small print. Here your profile links to your own site or shop and there is no commission on jobs: you pay for the listing and keep the whole fee. On the large marketplaces your work sits in the same results as generated images, and the client cannot tell until they ask.",
        links: [
          { label: "Add your profile", href: "/join" },
          { label: "Illustrators directory", href: "/categories/illustrators" },
        ],
      },
      {
        q: "How do I prove an illustration was drawn by hand?",
        a: "Show the layered file and your sketches: generated images arrive as one flat layer, and layer history cannot be faked after the fact. There is no single proof, there are levels: a statement about your process, source files, version history, a C2PA signature. You do not have to reach the top level, source files satisfy most clients.",
        links: [{ label: "How HTVS works", href: "/method" }],
      },
      {
        q: "Do I need to record a drawing timelapse?",
        a: "Not necessarily. A layered file is stronger: it cannot be faked after the fact, and you have one after every job, whereas a timelapse you have to remember to start. Procreate records a timelapse automatically; in Photoshop you would use screen capture.",
      },
      {
        q: "What if a client accuses me of using AI?",
        a: "Send the layered file and a couple of sketches. That settles it nine times out of ten, and there is nothing to argue about. If the client points to a detector, know this: detectors are unreliable, a Stanford study found a 61% error rate on writing by non-native English speakers, and for images accuracy is lower still. A detector is not proof, it is a reason to look at source files.",
        links: [{ label: "Add your profile", href: "/join" }],
      },
      {
        q: "Why does hand-drawn illustration cost more than generation?",
        a: "The client pays for three things generation does not have. Rights: on 2 March 2026 the US Supreme Court left the human authorship requirement in place, so a generated image cannot be registered while your work can. Revisions: you can change the character's pose without redoing everything, whereas a generated image has to be made again and comes back different. Accuracy: a real product, a specific interior, a recognisable face, where generation misses the details clients pay for.",
      },
      {
        q: "Can I remove backgrounds in Photoshop and still work without AI?",
        a: "Yes. The line is simple: no generation, everything else is fine. Removing a background, correcting colour, cleaning edges, finding a reference are tools, and the author stays the author. The law reasons the same way: the US Copyright Office holds that assistive use of AI does not remove protection.",
        links: [{ label: "Human-Made standards", href: "/human-made-standards" }],
      },
      {
        q: "How do I check that an illustrator does not use AI?",
        a: "Ask for the layered file from a previous job and two or three sketches. It takes a minute and it is enough: generated images arrive as one flat layer. What not to do: run the image through a detector or judge by the anatomy of the hands, because those 2023 tells are out of date and detectors get it wrong. In our directory illustrators describe their process in the profile.",
        links: [{ label: "Illustrators directory", href: "/categories/illustrators" }],
      },
    ],
  },
];

const byLocale: Record<Locale, FaqProfession[]> = { en, ru };

export function getFaqProfessions(locale: Locale): FaqProfession[] {
  return byLocale[locale] ?? en;
}

export function getFaqProfession(
  locale: Locale,
  slug: string,
): FaqProfession | undefined {
  return getFaqProfessions(locale).find((p) => p.slug === slug);
}

/** Slugs are the same across locales, so one list drives static params. */
export const FAQ_PROFESSION_SLUGS = en.map((p) => p.slug);
