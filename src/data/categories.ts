import type { Category } from "@/lib/types";

/**
 * Categories (TZ 3.3). Created as data, not hard-coded. Each category
 * gets its own indexable page with an SEO intro (TZ 5.3: no empty pages
 * made only of cards). Adding a category is adding an entry here.
 */
export const categories: Category[] = [
  // ---- art ----
  {
    slug: "painters",
    name: "Painters",
    direction: "art",
    shortDescription: "Painters working in oil, acrylic, watercolour and mixed media.",
    seoText:
      "Painters here work with real brushes and real paint. This category covers oil, acrylic, watercolour, gouache and mixed media, from studies to large gallery canvases, sold as originals or prints. Every painter links to their own studio site, gallery or shop, where you can buy an existing piece or commission a new one directly.",
    seoTitle: "Painters — original human-made painting",
    seoDescription:
      "Find painters who work by hand in oil, acrylic and watercolour. Buy originals or commission directly from the artist.",
  },
  {
    slug: "sculptors",
    name: "Sculptors",
    direction: "art",
    shortDescription: "Sculptors working in clay, stone, metal and wood.",
    seoText:
      "Sculptors on the platform shape physical material by hand: clay, stone, wood, metal, plaster. This category covers figurative and abstract sculpture, busts, reliefs and object art, made as originals or limited runs. Each sculptor links to their own studio site or shop for direct purchase and commissions.",
    seoTitle: "Sculptors — human-made sculpture in clay, stone and metal",
    seoDescription:
      "Directory of sculptors working by hand in clay, stone, wood and metal. Commission or buy sculpture directly from the artist.",
  },
  {
    slug: "illustrators",
    name: "Illustrators",
    direction: "art",
    shortDescription: "Illustrators who draw by hand across styles and media.",
    seoText:
      "Illustrators here draw by hand, without AI generation. This category covers editorial, book, children's, product and decorative illustration in pen and ink, watercolour, gouache, digital hand-drawing and mixed technique. Each illustrator links to their own portfolio or shop, where you can commission a piece or buy prints directly.",
    seoTitle: "Illustrators — human-made, hand-drawn illustration",
    seoDescription:
      "Find illustrators who draw by hand, without AI. Browse human-made illustration and commission each artist directly.",
  },
  {
    slug: "concept-artists",
    name: "Concept Artists",
    direction: "art",
    shortDescription: "Concept artists designing characters, creatures and worlds.",
    seoText:
      "Concept artists here design the look of games, films and animation by hand: characters, creatures, environments, props and key art. This category is for studios and developers who need a coherent visual world someone can defend, extend and iterate on. Each artist links to their own portfolio for direct commissions.",
    seoTitle: "Concept Artists — human character, creature and world design",
    seoDescription:
      "Directory of concept artists who design characters, creatures and environments by hand, without AI. Commission each artist directly.",
  },
  // ---- literature ----
  {
    slug: "fiction-authors",
    name: "Fiction Authors",
    direction: "literature",
    shortDescription: "Novelists and short-story writers.",
    seoText:
      "Fiction authors here write their own manuscripts. This category covers novels, novellas and short stories across genres, from literary fiction to science fiction, fantasy, crime and romance. Each author links to their own site, publisher page or shop, where you can read samples, buy the book or reach them directly.",
    seoTitle: "Fiction Authors — human-written novels and short stories",
    seoDescription:
      "Directory of novelists and short-story writers who write without AI. Find human-written fiction and contact each author directly.",
  },
  {
    slug: "non-fiction-authors",
    name: "Non-Fiction Authors",
    direction: "literature",
    shortDescription: "Authors of research, memoir, history and practical books.",
    seoText:
      "Non-fiction authors here write from their own knowledge and research. This category covers history, science, biography and memoir, business and practical books, written by people who can source every claim and answer for it. Each author links to their own site, publisher page or shop for direct contact.",
    seoTitle: "Non-Fiction Authors — human-written research, history and memoir",
    seoDescription:
      "Directory of non-fiction authors who research and write without AI. Find human-written books and contact each author directly.",
  },
  {
    slug: "childrens-authors",
    name: "Children's Authors",
    direction: "literature",
    shortDescription: "Writers of picture books and children's fiction.",
    seoText:
      "Children's authors here write picture books, early readers and middle-grade fiction by hand. This category is for parents, teachers and publishers looking for stories written by a person who understands how children actually read. Each author links to their own site or publisher page for direct contact.",
    seoTitle: "Children's Authors — human-written picture books and children's fiction",
    seoDescription:
      "Directory of children's authors who write without AI. Find human-written picture books and children's fiction, and contact each author directly.",
  },
  {
    slug: "poets",
    name: "Poets",
    direction: "literature",
    shortDescription: "Poets writing and publishing their own work.",
    seoText:
      "Poets here write their own verse. This category covers collections, individual poems, commissioned pieces for occasions and spoken word. Each poet links to their own site, publisher or shop, where you can read, buy or commission directly.",
    seoTitle: "Poets — human-written poetry and verse",
    seoDescription:
      "Directory of poets who write without AI. Read and commission human-written poetry directly from the author.",
  },
  // ---- graphics-and-design ----
  {
    slug: "graphic-designers",
    name: "Graphic Designers",
    direction: "graphics-and-design",
    shortDescription: "Graphic designers for identity, print and packaging.",
    seoText:
      "Graphic designers here make decisions themselves and can explain each one. This category covers brand identity, logos, packaging, print, merch and social graphics, from independent designers and small studios. Each profile links to the designer's own site or portfolio for direct commissions.",
    seoTitle: "Graphic Designers — human identity, print and packaging design",
    seoDescription:
      "Directory of graphic designers who design without AI: identity, logos, packaging and print. Reach each designer directly.",
  },
  {
    slug: "ui-ux-designers",
    name: "UI/UX Designers",
    direction: "graphics-and-design",
    shortDescription: "Interface and experience designers for apps and sites.",
    seoText:
      "UI/UX designers here research, structure and design interfaces that real people can actually use. This category covers product design, user flows, wireframes, design systems and prototypes for web and mobile. Each profile links to the designer's own portfolio or case studies for direct contact.",
    seoTitle: "UI/UX Designers — human interface and product design",
    seoDescription:
      "Directory of UI/UX designers who design interfaces without AI. Find human-made product design and contact each designer directly.",
  },
  {
    slug: "3d-artists",
    name: "3D Artists",
    direction: "graphics-and-design",
    shortDescription: "3D modellers for games, print, product and animation.",
    seoText:
      "3D artists here build clean, correct geometry by hand. This category covers modelling, texturing and rendering for games, animation, product visualisation and 3D printing, from people who understand topology and can hand over a model that actually works in production. Each profile links to the artist's own portfolio.",
    seoTitle: "3D Artists — human 3D modelling for games, print and product",
    seoDescription:
      "Directory of 3D artists who model by hand, without AI. Find production-ready human-made 3D work and hire each artist directly.",
  },
  {
    slug: "3d-designers",
    name: "3D Designers",
    direction: "graphics-and-design",
    shortDescription: "Product and industrial 3D designers: parts, packaging, print-ready models.",
    seoText:
      "3D designers here work on things that have to be made, not only rendered. This category covers product and industrial design, packaging, parts and assemblies, technical visualisation and models prepared for 3D printing or manufacture. Where a 3D artist is hired to make a scene look right, a 3D designer is hired to make an object work: wall thickness, tolerances, materials, a file the factory can actually use. Each profile links to the designer's own portfolio.",
    seoTitle: "3D Designers — human product and industrial 3D design",
    seoDescription:
      "Directory of 3D designers who model products, parts and packaging by hand, without AI. Find manufacture-ready human-made 3D design and hire each designer directly.",
  },
  // ---- photo-and-video ----
  {
    slug: "photographers",
    name: "Photographers",
    direction: "photo-and-video",
    shortDescription: "Photographers shooting real people, products and events.",
    seoText:
      "Photographers here work behind a real camera. This category covers portrait, product, e-commerce, event, wedding, documentary and reportage photography. Each photographer links to their own site or portfolio for direct booking.",
    seoTitle: "Photographers — human photography, real cameras",
    seoDescription:
      "Directory of photographers who shoot real work, without AI generation. Find human-made photography and book each photographer directly.",
  },
  {
    slug: "video-editors",
    name: "Video Editors",
    direction: "photo-and-video",
    shortDescription: "Editors cutting long-form, ads, Reels and Shorts.",
    seoText:
      "Video editors here cut real footage on a real timeline. This category covers YouTube long-form, commercials, short-form for Reels, Shorts and TikTok, podcasts and documentary edits, from people who understand pacing and retention. Each editor links to their own reel or portfolio for direct booking.",
    seoTitle: "Video Editors — human editing for YouTube, ads and short-form",
    seoDescription:
      "Directory of video editors who cut real footage without AI. Find human-made editing and book each editor directly.",
  },
  {
    slug: "motion-designers",
    name: "Motion & 2D Animators",
    direction: "photo-and-video",
    shortDescription: "Motion designers and frame-by-frame animators.",
    seoText:
      "Motion designers and 2D animators here animate by hand. This category covers explainers, logo animation, titles and intros, and frame-by-frame character animation. Each profile links to the animator's own reel or portfolio for direct commissions.",
    seoTitle: "Motion & 2D Animators — human animation and motion design",
    seoDescription:
      "Directory of motion designers and 2D animators who animate by hand, without AI. Find human-made animation and hire each artist directly.",
  },
  {
    slug: "colourists",
    name: "Colourists",
    direction: "photo-and-video",
    shortDescription: "Colourists grading footage for film, ads and video.",
    seoText:
      "Colourists here grade real footage with a trained eye. This category covers colour correction and creative grading for film, commercials, music videos and online content. Each colourist links to their own reel for direct booking.",
    seoTitle: "Colourists — human colour grading for film and video",
    seoDescription:
      "Directory of colourists who grade footage by hand. Find human-made colour work and book each colourist directly.",
  },
  // ---- writing-and-translation ----
  {
    slug: "copywriters",
    name: "Copywriters",
    direction: "writing-and-translation",
    shortDescription: "Copywriters for sales pages, ads and content.",
    seoText:
      "Copywriters here write from real understanding of the product and the buyer. This category covers landing and sales pages, email sequences, ad copy, expert articles and social posts, written by people who defend every claim. Each copywriter links to their own site or portfolio for direct hire.",
    seoTitle: "Copywriters — human-written sales copy and content",
    seoDescription:
      "Directory of copywriters who write without AI. Find human-written copy with real judgement behind it and hire each writer directly.",
  },
  {
    slug: "editors",
    name: "Editors & Proofreaders",
    direction: "writing-and-translation",
    shortDescription: "Editors and proofreaders for manuscripts and copy.",
    seoText:
      "Editors and proofreaders here read closely and fix what is actually wrong: structure, argument, grammar, consistency. This category covers manuscript editing, developmental editing, copy-editing and proofreading. Each editor links to their own site or portfolio for direct hire.",
    seoTitle: "Editors & Proofreaders — human editing and proofreading",
    seoDescription:
      "Directory of editors and proofreaders who work by hand. Find human editing for manuscripts and copy, and hire each editor directly.",
  },
  {
    slug: "translators",
    name: "Translators",
    direction: "writing-and-translation",
    shortDescription: "Translators and localisers across language pairs.",
    seoText:
      "Translators here carry meaning across languages, not just words. This category covers literary translation, business and technical translation, and localisation adapted to the target culture. Each translator links to their own site or portfolio for direct hire.",
    seoTitle: "Translators — human translation and localisation",
    seoDescription:
      "Directory of translators and localisers who translate without AI. Find human translation and hire each translator directly.",
  },
  {
    slug: "scriptwriters",
    name: "Scriptwriters",
    direction: "writing-and-translation",
    shortDescription: "Scriptwriters for film, video, games and quests.",
    seoText:
      "Scriptwriters here build story and dialogue by hand. This category covers screenplays, video scripts, game narrative, quests and branching dialogue. Each writer links to their own site or portfolio for direct hire.",
    seoTitle: "Scriptwriters — human scripts for film, video and games",
    seoDescription:
      "Directory of scriptwriters who write scripts and game narrative without AI. Find human-written story work and hire each writer directly.",
  },
  // ---- music-and-audio ----
  {
    slug: "voice-actors",
    name: "Voice Actors",
    direction: "music-and-audio",
    shortDescription: "Voice actors and narrators recording live.",
    seoText:
      "Voice actors here record with a real voice in a real room. This category covers commercial voice-over, audiobook narration, dubbing, character voices and e-learning. Each actor links to their own demo reel for direct booking.",
    seoTitle: "Voice Actors — human voice-over and narration",
    seoDescription:
      "Directory of voice actors and narrators who record live, without synthetic voices. Book each actor directly.",
  },
  {
    slug: "composers",
    name: "Composers & Musicians",
    direction: "music-and-audio",
    shortDescription: "Composers and musicians writing and playing original work.",
    seoText:
      "Composers and musicians here write and play their own music. This category covers original scores and soundtracks, songs, beats, session performance and custom tracks. Each profile links to the musician's own site or portfolio for direct commissions.",
    seoTitle: "Composers & Musicians — human-written original music",
    seoDescription:
      "Directory of composers and musicians who write and play without AI generation. Commission original human-made music directly.",
  },
  {
    slug: "sound-designers",
    name: "Sound Designers",
    direction: "music-and-audio",
    shortDescription: "Sound designers creating custom effects and audio worlds.",
    seoText:
      "Sound designers here record and build sound from scratch. This category covers custom effects for games and film, foley, ambience and audio branding. Each profile links to the designer's own reel for direct booking.",
    seoTitle: "Sound Designers — human sound effects and audio design",
    seoDescription:
      "Directory of sound designers who create custom effects by hand. Find human-made sound design and book each specialist directly.",
  },
  {
    slug: "audio-engineers",
    name: "Audio Engineers",
    direction: "music-and-audio",
    shortDescription: "Engineers mixing, mastering and cleaning audio.",
    seoText:
      "Audio engineers here mix and master with trained ears. This category covers mixing, mastering, audio restoration and podcast editing. Each engineer links to their own site or portfolio for direct booking.",
    seoTitle: "Audio Engineers — human mixing, mastering and podcast editing",
    seoDescription:
      "Directory of audio engineers who mix and master by hand. Find human audio work and book each engineer directly.",
  },
  // ---- development-and-it ----
  {
    slug: "web-developers",
    name: "Web Developers",
    direction: "development-and-it",
    shortDescription: "Developers building sites, stores and web apps.",
    seoText:
      "Web developers here design the architecture themselves and understand every line they ship. This category covers websites, online stores, web applications and front-end work, from people who can explain their decisions and fix what they built. Each developer links to their own site, repository or portfolio.",
    seoTitle: "Web Developers — human-written sites, stores and web apps",
    seoDescription:
      "Directory of web developers who write and answer for their own code. Find developers who understand and support what they build.",
  },
  {
    slug: "mobile-developers",
    name: "Mobile Developers",
    direction: "development-and-it",
    shortDescription: "Developers building iOS and Android applications.",
    seoText:
      "Mobile developers here build apps they can maintain. This category covers native iOS and Android and cross-platform applications, from people who own the architecture and support the result. Each developer links to their own site, repository or portfolio.",
    seoTitle: "Mobile Developers — human-written iOS and Android apps",
    seoDescription:
      "Directory of mobile developers who write and answer for their own code. Find developers who understand and support what they build.",
  },
  {
    slug: "game-developers",
    name: "Game Developers",
    direction: "development-and-it",
    shortDescription: "Developers programming game logic, physics and mechanics.",
    seoText:
      "Game developers here write the systems behind the game: mechanics, physics, AI behaviour, tools and gameplay logic. This category is for studios and creators who need code that holds together under real play. Each developer links to their own site, repository or portfolio.",
    seoTitle: "Game Developers — human-written game logic and mechanics",
    seoDescription:
      "Directory of game developers who write and answer for their own code. Find developers who understand and support what they build.",
  },
  {
    slug: "automation-developers",
    name: "Scripts & Automation",
    direction: "development-and-it",
    shortDescription: "Developers building bots, parsers and automation.",
    seoText:
      "Automation developers here build tools that keep running. This category covers Telegram and chat bots, scrapers and parsers, integrations and workflow automation, written by people who handle the edge cases. Each developer links to their own site, repository or portfolio.",
    seoTitle: "Scripts & Automation — human-written bots, parsers and integrations",
    seoDescription:
      "Directory of developers who build bots, parsers and automation by hand. Find developers who understand and support what they build.",
  },
  {
    slug: "code-auditors",
    name: "Code Audit & Security",
    direction: "development-and-it",
    shortDescription: "Specialists reviewing code for bugs and vulnerabilities.",
    seoText:
      "Code auditors here read code line by line and tell you what is actually wrong. This category covers code review, bug hunting, security assessment and rescue of projects that stopped working and nobody can explain why. Each specialist links to their own site, repository or portfolio.",
    seoTitle: "Code Audit & Security — human code review and bug hunting",
    seoDescription:
      "Directory of specialists who audit code by hand: bugs, vulnerabilities and rescue of broken projects. Contact each specialist directly.",
  },
  // ---- architecture-and-interiors ----
  {
    slug: "interior-designers",
    name: "Interior Designers",
    direction: "architecture-and-interiors",
    shortDescription: "Designers producing plans, layouts and material selection.",
    seoText:
      "Interior designers here draw real plans for real rooms. This category covers layouts, technical drawings, material and finish selection, lighting and full project supervision, made by people who account for the actual building and budget. Each designer links to their own site or portfolio for direct contact.",
    seoTitle: "Interior Designers — human plans, layouts and material selection",
    seoDescription:
      "Directory of interior designers who design without AI. Find human-made plans and contact each designer directly.",
  },
  {
    slug: "landscape-designers",
    name: "Landscape Designers",
    direction: "architecture-and-interiors",
    shortDescription: "Designers planning gardens, plots and outdoor spaces.",
    seoText:
      "Landscape designers here plan for the real site: soil, light, climate, water and how the planting will look in five years. This category covers garden design, plot planning, planting schemes and hardscaping. Each designer links to their own site or portfolio for direct contact.",
    seoTitle: "Landscape Designers — human garden and plot design",
    seoDescription:
      "Directory of landscape designers who plan real sites without AI. Find human-made landscape design and contact each designer directly.",
  },
  // ---- handmade-and-craft ----
  {
    slug: "craft-makers",
    name: "Craft Makers",
    direction: "handmade-and-craft",
    shortDescription: "Makers of ceramics, furniture, decor and objects.",
    seoText:
      "Craft makers here shape physical objects with their hands. This category covers ceramics and pottery, woodwork and furniture, glass, metal, and decor for the home. Every maker links to their own shop or studio site, where you can buy or commission directly.",
    seoTitle: "Craft Makers — handmade ceramics, furniture and decor",
    seoDescription:
      "Directory of makers producing handmade ceramics, furniture, glass and decor. Buy or commission directly from the maker.",
  },
  {
    slug: "accessory-makers",
    name: "Accessories & Jewellery",
    direction: "handmade-and-craft",
    shortDescription: "Makers of leather goods, bags and jewellery.",
    seoText:
      "Accessory makers here cut, stitch and set by hand. This category covers leather bags and wallets, belts, small goods and handmade jewellery. Every maker links to their own shop, where you can buy or commission directly.",
    seoTitle: "Accessories & Jewellery — handmade leather goods and jewellery",
    seoDescription:
      "Directory of makers producing handmade bags, leather goods and jewellery. Buy or commission directly from the maker.",
  },
  {
    slug: "clothing-designers",
    name: "Clothing Designers",
    direction: "handmade-and-craft",
    shortDescription: "Designers sewing bespoke clothing and custom pieces.",
    seoText:
      "Clothing designers here cut and sew real garments. This category covers bespoke tailoring, pattern making, custom pieces and hand-painted clothing. Every designer links to their own shop or studio site for direct orders.",
    seoTitle: "Clothing Designers — bespoke tailoring and custom clothing",
    seoDescription:
      "Directory of clothing designers who sew and pattern by hand. Order bespoke and custom pieces directly from the designer.",
  },

  // ---- other ----
  {
    slug: "restoration",
    name: "Restoration",
    direction: "other",
    shortDescription: "Restorers of paintings, furniture, books and photographs.",
    seoText:
      "Restoration is the one craft that cannot be generated by definition: the object already exists, it is damaged, and it has to survive the repair. This category covers restorers of paintings, frames, furniture, books, bindings, photographs and documents, people who match a pigment to a two-hundred-year-old canvas and know when to stop. Every restorer links to their own workshop site or portfolio, where you can see completed work and discuss a piece directly.",
    seoTitle: "Restoration — human restorers of art, furniture and books",
    seoDescription:
      "Directory of restorers working by hand on paintings, furniture, books and photographs. See finished work and contact each workshop directly.",
  },
  {
    slug: "calligraphy",
    name: "Calligraphy & Lettering",
    direction: "other",
    shortDescription: "Calligraphers and hand-lettering artists.",
    seoText:
      "Calligraphers draw letters with a pen, a brush and a hand that has practised the stroke for years. This category covers wedding and event calligraphy, certificates, hand-lettered logos and packaging, custom scripts and traditional schools of the craft. A generated script is a picture of writing; this is writing. Each calligrapher links to their own portfolio or shop for direct commissions.",
    seoTitle: "Calligraphy & Lettering — human calligraphers and letterers",
    seoDescription:
      "Directory of calligraphers and hand-lettering artists working by hand. Commission custom lettering directly from the artist.",
  },
];
