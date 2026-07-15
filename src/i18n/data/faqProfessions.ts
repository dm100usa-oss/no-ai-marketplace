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
  {
    slug: "copywriters",
    category: "copywriters",
    metaTitle: "Копирайтеры без ИИ: частые вопросы",
    metaDescription:
      "Где найти клиентов копирайтеру без ИИ, как доказать авторство текста, что делать при ложном срабатывании детектора.",
    title: "Копирайтеры: частые вопросы",
    intro:
      "Вопросы, которые чаще всего задают копирайтеры и те, кто их ищет. Ответы короткие и по делу.",
    items: [
      {
        q: "Где найти клиентов копирайтеру, который пишет сам?",
        a: "Там, где заказчик приходит именно за живым текстом, а не выбирает между вами и генерацией по цене. Здесь профиль ведет на ваш сайт и каналы, обращения приходят напрямую, комиссии с гонорара нет. На обычных биржах ваша ставка стоит рядом со ставкой того, кто отдает результат нейросети, и заказчик видит только разницу в цене.",
        links: [
          { label: "Добавить профиль", href: "/join" },
          { label: "Каталог копирайтеров", href: "/categories/copywriters" },
        ],
      },
      {
        q: "Как доказать, что текст написан человеком?",
        a: "Показать черновики и историю правок в документе: видно, как текст менялся, куда автор возвращался, что вычеркивал. Сгенерированный текст приходит сразу набело. По методу HTVS это второй и третий уровни, и заказчику обычно их достаточно. Сильнее всего работает то, чего у генерации нет в принципе: ваш личный опыт, разговор с заказчиком, цифры, которые вы сами добыли.",
        links: [{ label: "Как устроен метод HTVS", href: "/method" }],
      },
      {
        q: "Что делать, если детектор назвал мой текст сгенерированным?",
        a: "Не оправдываться, а показать историю документа. Детекторы ошибаются, и это доказано: стэнфордское исследование показало, что семь популярных детекторов помечали работы авторов, для которых английский неродной, как машинные в 61% случаев. Один детектор ошибся на 98% таких текстов. Если заказчик готов слушать, покажите ему эту цифру: она объясняет, почему детектор не может быть аргументом.",
        links: [{ label: "Добавить профиль", href: "/join" }],
      },
      {
        q: "Можно ли пользоваться проверкой орфографии, если пишешь без ИИ?",
        a: "Да. Линия простая: нельзя генерировать, все остальное можно. Проверить орфографию, расшифровать интервью, найти источник, разобрать структуру чужой статьи это инструменты. Написать за вас абзац нельзя. Бюро по авторским правам США рассуждает так же: вспомогательное использование ИИ не лишает текст охраны, а сгенерированные куски не охраняются и должны быть раскрыты при регистрации.",
        links: [{ label: "Стандарты Human-Made", href: "/human-made-standards" }],
      },
      {
        q: "Почему живой копирайтер стоит дороже генерации?",
        a: "Заказчик платит за то, чего у генерации нет. Фактуру: вы позвоните клиенту, прочитаете отчет, найдете цифру, которой нет в открытых источниках. Ответственность: за ошибку в тексте отвечает человек, а не выдача модели. Права: сгенерированный текст не регистрируется, ваш регистрируется, и заказчик может его защищать.",
      },
      {
        q: "Как проверить, что копирайтер пишет сам?",
        a: "Попросить черновик и историю правок в документе, а еще лучше дать задачу, где нужна фактура: интервью, свои цифры, разбор конкретного случая. Генерация тут проваливается, потому что фактуру негде взять. Чего делать не стоит: гонять текст через детектор, они ошибаются слишком часто, особенно на авторах, для которых язык неродной.",
        links: [{ label: "Каталог копирайтеров", href: "/categories/copywriters" }],
      },
    ],
  },
  {
    slug: "translators",
    category: "translators",
    metaTitle: "Переводчики без машинного перевода: частые вопросы",
    metaDescription:
      "Где разместиться переводчику, который переводит сам, как показать разницу с машинным переводом и как проверить переводчика.",
    title: "Переводчики: частые вопросы",
    intro:
      "Вопросы, которые чаще всего задают переводчики и те, кто их ищет. Ответы короткие и по делу.",
    items: [
      {
        q: "Где разместиться переводчику, который переводит сам?",
        a: "В каталоге, куда заказчик приходит именно за живым переводом. Здесь профиль ведет на ваш сайт, обращения идут напрямую, комиссии с гонорара нет. На общих биржах ваша работа стоит в одном списке с постредактурой машинного перевода, и заказчик, который не знает языка, разницы не увидит.",
        links: [
          { label: "Добавить профиль", href: "/join" },
          { label: "Каталог переводчиков", href: "/categories/translators" },
        ],
      },
      {
        q: "Как показать заказчику разницу между живым переводом и машинным?",
        a: "Дать тестовый абзац с идиомой, шуткой или игрой слов и рядом положить машинный вариант. Разница видна сразу и без знания языка: машина переведет буквально и потеряет смысл. Это сильнее любых объяснений, потому что заказчик увидит сам.",
      },
      {
        q: "Как доказать, что перевод сделан без машинного перевода?",
        a: "Показать черновики и историю правок: видно, где вы искали формулировку и возвращались к абзацу. Машинный перевод приходит ровным полотном сразу. По методу HTVS это второй и третий уровни. Дополнительно работают заметки переводчика: почему выбран этот вариант, а не тот.",
        links: [{ label: "Как устроен метод HTVS", href: "/method" }],
      },
      {
        q: "Можно ли пользоваться глоссарием и памятью переводов?",
        a: "Да. Линия простая: нельзя генерировать, все остальное можно. Память переводов, глоссарии, словари, проверка терминологии это профессиональные инструменты, они у переводчиков были задолго до нейросетей. Прогнать текст через машину и слегка причесать нельзя: это уже не ваш перевод.",
        links: [{ label: "Стандарты Human-Made", href: "/human-made-standards" }],
      },
      {
        q: "Почему живой перевод стоит дороже машинного?",
        a: "Потому что заказчик платит за понимание, а не за подстановку слов. Машина не знает, что шутка не сработает в другой стране, что фраза звучит грубо, что у термина в этой отрасли другое значение. Для договора, книги или рекламы цена ошибки выше стоимости перевода. Плюс ответственность: за смысл отвечает человек.",
      },
      {
        q: "Как проверить, что переводчик не пользуется машинным переводом?",
        a: "Дать тестовый абзац со сленгом, идиомой или юмором. Прогоните его через машинный переводчик сами и сравните с тем, что пришло от переводчика: совпадение конструкций видно сразу. Спросите, почему выбран тот или иной вариант, живой переводчик объяснит.",
        links: [{ label: "Каталог переводчиков", href: "/categories/translators" }],
      },
    ],
  },
  {
    slug: "web-developers",
    category: "web-developers",
    metaTitle: "Разработчики без ИИ-генерации кода: частые вопросы",
    metaDescription:
      "Как проверить, что разработчик пишет код сам, чем рискует заказчик при генерации кода и где найти разработчика без ИИ.",
    title: "Разработчики: частые вопросы",
    intro:
      "Вопросы, которые чаще всего задают заказчики и разработчики. Ответы короткие и по делу.",
    items: [
      {
        q: "Как проверить, что разработчик пишет код сам?",
        a: "Посмотреть историю коммитов: живая разработка идет шагами, с возвратами, исправлениями и осмысленными сообщениями. Сгенерированный код приходит большими кусками сразу. Второй способ надежнее: попросите объяснить архитектурное решение голосом. Тот, кто писал сам, объяснит, почему сделал так, а не иначе.",
        links: [{ label: "Каталог веб-разработчиков", href: "/categories/web-developers" }],
      },
      {
        q: "Чем рискует заказчик, если код сгенерирован?",
        a: "Тремя вещами. Поддержкой: никто в команде не понимает, почему код устроен именно так, и любая правка ломает соседнее. Безопасностью: генерация повторяет уязвимые шаблоны из обучающих данных. Правами: сгенерированный код не регистрируется как объект авторского права, и защищать его нечем.",
      },
      {
        q: "Где найти разработчика, который не отдает логику нейросети?",
        a: "В каталоге, где отсутствие генерации это условие входа. Профили ведут на GitHub и личные сайты разработчиков, вы связываетесь напрямую и комиссии с проекта нет. Каждый разработчик описывает в профиле, как он работает и какие инструменты использует.",
        links: [{ label: "Каталог веб-разработчиков", href: "/categories/web-developers" }],
      },
      {
        q: "Где разместиться разработчику, который пишет код сам?",
        a: "Здесь. Профиль ведет на ваш GitHub и сайт, обращения приходят напрямую, комиссии с проекта нет. Спрос на понятный поддерживаемый код растет ровно потому, что рынок наполнился быстрым сгенерированным. История коммитов, читаемая архитектура и внятный README сейчас продают лучше, чем список технологий.",
        links: [{ label: "Добавить профиль", href: "/join" }],
      },
      {
        q: "Можно ли пользоваться автодополнением, если работаешь без ИИ?",
        a: "Смотря чем. Линия простая: нельзя генерировать, все остальное можно. Подсказка имени метода, поиск по документации, линтер это инструменты. Сгенерировать функцию или модуль целиком и вставить не глядя нельзя: это уже не ваш код, и отвечать за него вы не сможете.",
        links: [{ label: "Стандарты Human-Made", href: "/human-made-standards" }],
      },
    ],
  },
  {
    slug: "photographers",
    category: "photographers",
    metaTitle: "Фотографы без ИИ: частые вопросы",
    metaDescription:
      "Как проверить, что фотография настоящая, что такое C2PA и где найти фотографа, который снимает, а не генерирует.",
    title: "Фотографы: частые вопросы",
    intro:
      "Вопросы, которые чаще всего задают фотографы и те, кто их ищет. Ответы короткие и по делу.",
    items: [
      {
        q: "Как доказать, что фотография настоящая?",
        a: "Отдать RAW-файл: в нем есть данные съемки, которых у генерации нет, и подделать их трудно. Это второй уровень метода HTVS, и заказчику его почти всегда достаточно. Выше стоит подпись C2PA, ее уже ставят камеры Leica, Sony, Nikon, Canon и телефоны Samsung и Pixel прямо при съемке.",
        links: [{ label: "Как устроен метод HTVS", href: "/method" }],
      },
      {
        q: "Что такое C2PA и нужно ли это фотографу?",
        a: "Это стандарт, который вшивает в файл подписанную запись о том, чем он снят и что с ним делали. К январю 2026 в коалиции более 6000 участников, в мае 2026 к ней присоединился OpenAI, а Google встраивает проверку в Поиск и Chrome. С августа 2026 Закон ЕС об ИИ требует машиночитаемого раскрытия сгенерированного контента. Фотографу это дает готовое доказательство, но полагаться только на него не стоит: почти все площадки срезают метаданные при загрузке.",
      },
      {
        q: "Где найти фотографа, который снимает, а не генерирует?",
        a: "В каталоге, где это условие входа. Особенно важно для предметной съемки: генерация промахивается в деталях реального товара, а заказчику нужен именно его товар, а не похожий. Профили ведут на сайты фотографов, вы связываетесь напрямую.",
        links: [{ label: "Каталог фотографов", href: "/categories/photographers" }],
      },
      {
        q: "Где разместиться фотографу без ИИ?",
        a: "Здесь. Профиль ведет на ваш сайт или магазин, обращения приходят напрямую, комиссии с гонорара нет. Каталог собирает заказчиков, которым нужна настоящая съемка: предметка, репортаж, интерьеры, все, где важен реальный объект.",
        links: [{ label: "Добавить профиль", href: "/join" }],
      },
      {
        q: "Можно ли обрабатывать снимки, если работаешь без ИИ?",
        a: "Да. Линия простая: нельзя генерировать, все остальное можно. Коррекция цвета, кадрирование, ретушь, удаление пыли с матрицы это обработка, которой фотографы занимаются со времен пленки. Дорисовать нейросетью то, чего не было в кадре, нельзя.",
        links: [{ label: "Стандарты Human-Made", href: "/human-made-standards" }],
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
  {
    slug: "copywriters",
    category: "copywriters",
    metaTitle: "Copywriters without AI: common questions",
    metaDescription:
      "Where a copywriter without AI can find clients, how to prove you wrote the text, and what to do about a false detector result.",
    title: "Copywriters: common questions",
    intro:
      "The questions copywriters and the people hiring them ask most. Short answers.",
    items: [
      {
        q: "Where can a copywriter who writes their own work find clients?",
        a: "Where the client came for writing by a person, not to compare you with generation on price. Here your profile links to your own site and channels, enquiries come straight to you, and there is no commission on your fee. On the general marketplaces your rate sits next to the rate of someone handing the job to a model, and all the client sees is the price gap.",
        links: [
          { label: "Add your profile", href: "/join" },
          { label: "Copywriters directory", href: "/categories/copywriters" },
        ],
      },
      {
        q: "How do I prove a text was written by a human?",
        a: "Show your drafts and the edit history of the document: you can see the text changing, the places you went back to, the lines you cut. Generated text arrives clean in one go. Those are levels two and three of HTVS, and they usually satisfy a client. Strongest of all is what generation cannot have: your own reporting, a call with the client, a number you dug out yourself.",
        links: [{ label: "How HTVS works", href: "/method" }],
      },
      {
        q: "What if a detector says my text is AI-generated?",
        a: "Do not argue, show the document history. Detectors get it wrong, and it is documented: a Stanford study found seven popular detectors flagged writing by non-native English speakers as machine-written 61% of the time, and one detector was wrong on 98% of those texts. If the client will listen, show them that figure: it explains why a detector cannot be the argument.",
        links: [{ label: "Add your profile", href: "/join" }],
      },
      {
        q: "Can I use a spellchecker and still write without AI?",
        a: "Yes. The line is simple: no generation, everything else is fine. Checking spelling, transcribing an interview, finding a source, breaking down someone else's structure are tools. Having a paragraph written for you is not. The US Copyright Office reasons the same way: assistive use of AI does not remove protection, while generated passages are unprotected and must be disclosed at registration.",
        links: [{ label: "Human-Made standards", href: "/human-made-standards" }],
      },
      {
        q: "Why does a human copywriter cost more than generation?",
        a: "The client pays for what generation does not have. Reporting: you will call the client, read the report, find the number that is not in public sources. Accountability: a person answers for a mistake, not a model output. Rights: generated text cannot be registered, yours can, and the client can defend it.",
      },
      {
        q: "How do I check that a copywriter writes their own work?",
        a: "Ask for a draft and the document edit history, and better still give a task that needs reporting: an interview, your own figures, a specific case. Generation fails there because there is nowhere to get the material. What not to do: run the text through a detector, they are wrong too often, especially on writers working in a second language.",
        links: [{ label: "Copywriters directory", href: "/categories/copywriters" }],
      },
    ],
  },
  {
    slug: "translators",
    category: "translators",
    metaTitle: "Translators without machine translation: common questions",
    metaDescription:
      "Where a human translator can list, how to show the difference from machine translation, and how to check a translator.",
    title: "Translators: common questions",
    intro:
      "The questions translators and the people hiring them ask most. Short answers.",
    items: [
      {
        q: "Where can a human translator list their services?",
        a: "In a directory where the client came for translation by a person. Here your profile links to your own site, enquiries come straight to you, and there is no commission on your fee. On the general marketplaces your work sits in the same list as machine translation post-editing, and a client who does not speak the language will not see the difference.",
        links: [
          { label: "Add your profile", href: "/join" },
          { label: "Translators directory", href: "/categories/translators" },
        ],
      },
      {
        q: "How do I show a client the difference between human and machine translation?",
        a: "Give them a test paragraph with an idiom, a joke or a pun, and put the machine version next to it. The difference is obvious without knowing the language: the machine goes literal and the meaning falls out. This beats any explanation, because the client sees it themselves.",
      },
      {
        q: "How do I prove a translation was not machine-translated?",
        a: "Show drafts and edit history: you can see where you hunted for a phrase and came back to a paragraph. Machine translation arrives as one even sheet. Those are levels two and three of HTVS. Translator's notes help too: why this choice and not that one.",
        links: [{ label: "How HTVS works", href: "/method" }],
      },
      {
        q: "Can I use a glossary and translation memory?",
        a: "Yes. The line is simple: no generation, everything else is fine. Translation memory, glossaries, dictionaries, terminology checks are professional tools and translators had them long before neural networks. Running the text through a machine and tidying it is not: that is no longer your translation.",
        links: [{ label: "Human-Made standards", href: "/human-made-standards" }],
      },
      {
        q: "Why does human translation cost more than machine translation?",
        a: "Because the client is paying for understanding, not word substitution. A machine does not know the joke will not land in another country, that the phrase reads as rude, that the term means something else in this industry. For a contract, a book or an ad, the cost of the error is higher than the cost of the translation. And accountability: a person answers for the meaning.",
      },
      {
        q: "How do I check that a translator does not use machine translation?",
        a: "Give a test paragraph with slang, an idiom or humour. Run it through a machine translator yourself and compare: matching constructions show up immediately. Ask why a particular choice was made, a human translator will explain.",
        links: [{ label: "Translators directory", href: "/categories/translators" }],
      },
    ],
  },
  {
    slug: "web-developers",
    category: "web-developers",
    metaTitle: "Developers without AI code generation: common questions",
    metaDescription:
      "How to check a developer writes their own code, what a client risks with generated code, and where to find a developer without AI.",
    title: "Developers: common questions",
    intro:
      "The questions clients and developers ask most. Short answers.",
    items: [
      {
        q: "How do I check that a developer writes their own code?",
        a: "Look at the commit history: real development moves in steps, with backtracks, fixes and messages that mean something. Generated code lands in large blocks at once. The second way is better: ask them to talk through an architectural decision. Someone who wrote it will explain why they did it this way and not another.",
        links: [{ label: "Web developers directory", href: "/categories/web-developers" }],
      },
      {
        q: "What does a client risk if the code is generated?",
        a: "Three things. Maintenance: nobody on the team knows why the code is shaped this way, and every fix breaks something next to it. Security: generation repeats vulnerable patterns from its training data. Rights: generated code is not registrable as a copyright work, so there is nothing to defend it with.",
      },
      {
        q: "Where do I find a developer who does not hand the logic to a model?",
        a: "In a directory where no generation is the condition of entry. Profiles link to developers' GitHub and personal sites, you contact them directly, and there is no commission on the project. Each developer describes in their profile how they work and which tools they use.",
        links: [{ label: "Web developers directory", href: "/categories/web-developers" }],
      },
      {
        q: "Where can a developer who writes their own code list?",
        a: "Here. Your profile links to your GitHub and site, enquiries come straight to you, and there is no commission on the project. Demand for readable maintainable code is rising precisely because the market filled up with fast generated code. A commit history, a clear architecture and a real README sell better right now than a list of technologies.",
        links: [{ label: "Add your profile", href: "/join" }],
      },
      {
        q: "Can I use autocomplete and still work without AI?",
        a: "Depends which. The line is simple: no generation, everything else is fine. Suggesting a method name, searching documentation, a linter are tools. Generating a whole function or module and pasting it in unread is not: that is no longer your code, and you will not be able to answer for it.",
        links: [{ label: "Human-Made standards", href: "/human-made-standards" }],
      },
    ],
  },
  {
    slug: "photographers",
    category: "photographers",
    metaTitle: "Photographers without AI: common questions",
    metaDescription:
      "How to prove a photograph is real, what C2PA is, and where to find a photographer who shoots rather than generates.",
    title: "Photographers: common questions",
    intro:
      "The questions photographers and the people hiring them ask most. Short answers.",
    items: [
      {
        q: "How do I prove a photograph is real?",
        a: "Hand over the RAW file: it carries capture data that generation does not have and that is hard to fake. That is level two of HTVS, and it is almost always enough for a client. Above it sits a C2PA signature, already written at capture by Leica, Sony, Nikon and Canon cameras and by Samsung and Pixel phones.",
        links: [{ label: "How HTVS works", href: "/method" }],
      },
      {
        q: "What is C2PA and does a photographer need it?",
        a: "It is a standard that embeds a signed record of what shot the file and what was done to it. By January 2026 the coalition had over 6,000 members, OpenAI joined in May 2026, and Google is building verification into Search and Chrome. From August 2026 the EU AI Act requires machine-readable disclosure of generated content. For a photographer it is proof that comes ready-made, but do not rely on it alone: almost every platform strips metadata on upload.",
      },
      {
        q: "Where do I find a photographer who shoots rather than generates?",
        a: "In a directory where that is the condition of entry. It matters most for product work: generation misses the details of a real product, and the client needs their product, not one that looks like it. Profiles link to photographers' own sites and you contact them directly.",
        links: [{ label: "Photographers directory", href: "/categories/photographers" }],
      },
      {
        q: "Where can a photographer list without AI?",
        a: "Here. Your profile links to your own site or shop, enquiries come straight to you, and there is no commission on your fee. The directory gathers clients who need real photography: product, reportage, interiors, anything where the actual object matters.",
        links: [{ label: "Add your profile", href: "/join" }],
      },
      {
        q: "Can I edit my shots and still work without AI?",
        a: "Yes. The line is simple: no generation, everything else is fine. Colour correction, cropping, retouching, cleaning sensor dust are processing photographers have done since film. Painting in something with a model that was never in the frame is not.",
        links: [{ label: "Human-Made standards", href: "/human-made-standards" }],
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
