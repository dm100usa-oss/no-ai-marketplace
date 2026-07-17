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
      "For a painting made by an artist with real paint rather than generated, this is where to look. The category holds painters working in oil, acrylic, watercolour, gouache and mixed media, authors of portraits, landscapes, still life and abstract work, and artists who take commissions and paint walls: murals, facades, interiors and decorative panels. Paint has a body: the stroke sits in layers, the canvas shows through, and a year on the picture looks different from the day it was finished. A file does no such thing, and what hangs on your wall is an object.",
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
      "Looking for sculpture shaped or carved by hand rather than printed from a generated model? Start here. The category holds sculptors working in clay, wood, stone, metal and plaster, authors of portrait, monumental and interior sculpture, and makers of contemporary forms, figurines and miniatures. A sculptor works against a material that answers back: stone splits along its own fault, clay slumps, wood runs with the grain. The work comes out of that argument, and nothing generated ever has the argument.",
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
      "Looking for original illustration drawn by an artist from scratch rather than generated? This category will help you find the right one. Here you will find book illustrators and children's book artists, cover and educational illustrators, specialists in advertising and commercial illustration for packaging, websites, magazines and social media, and artists who design characters and mascots and draw them in a style you would recognise anywhere. Illustrating a text is a reading of it: the artist decides which moment to show and what to leave out, and that decision comes from understanding the story rather than from a description in a prompt.",
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
      "For concept work on a character, an environment or a prop for a game, a film or animation, invented by an artist rather than generated, look here. The category holds character concept artists, environment and location specialists, authors of vehicle and prop concepts, and artists who lead the visual development of games, films and animated projects. A concept is not a nice picture, it is a working document: a modeller builds from it and a lighting artist reads the intent in it. It has to explain how the world holds together and survive the question of why it is like that.",
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
      "For prose written by a living author rather than generated, this is where to look. The category holds novelists and writers of short stories, authors of crime, science fiction and historical fiction, and writers who take books on commission, work as ghostwriters, and carry a manuscript from draft to publishable book. A novel holds together because the author knows more about people than the text says out loud. Generated prose can assemble sentences, but it has nothing to withhold, and prose without a second floor does not read.",
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
      "Need a book about work you know from the inside, written by a person rather than generated? Start here. The category holds authors of business and expert books, biographies and memoirs, specialists in history, psychology and popular science, and writers who turn someone else's experience into a coherent book. Non-fiction is not judged on smoothness, it is judged on whether it holds up: the author answers for every fact, knows where it came from, and can tell the difference between what is established and what everyone simply repeats. A generator cannot see that difference.",
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
      "For a children's book written by an author rather than generated, this is the place. The category holds authors of fairy tales and books for the very young, writers of teenage fiction, and people who write educational stories where the knowledge arrives through the plot rather than through a paragraph. Children's books are tested by the most honest audience alive: a child does not finish a book out of politeness. A writer who has read the pages aloud to a real child and watched where the attention went knows something about that text no generator does.",
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
      "Looking for poetry written by a poet rather than assembled to a pattern? Start here. The category holds poets writing lyric verse and their own collections, authors of children's poems, specialists in verse for occasions and for advertising, and writers of song lyrics. In a poem the meaning rides on sound: the rhyme, the pause and the broken beat carry as much as the words. Generated lines tend to be correct and empty, because they were assembled from likelihoods rather than from needing to say it exactly that way.",
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
      "Looking for a logo, a brand identity, packaging or advertising work drawn by a designer rather than assembled by a generator out of other people's work? This is where to look. The category holds identity designers who build the logo, the colour system, the typography and the brand book, advertising designers responsible for banners, posters, brochures, presentations and outdoor work, and print specialists working on catalogues, magazines, menus, business cards and packaging. A logo is not a picture, it is a decision: it has to survive on a shopfront and in an app icon, in one colour and on fabric, and only the person who designed it that way can tell you why it will.",
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
      "Need an interface for a website, a mobile app or an internal system, thought through by a designer rather than dropped into a template? Start here. The category holds web designers working on corporate sites, online shops, landing pages and catalogues, mobile designers building for iOS and Android along with prototypes, and product designers responsible for SaaS, customer accounts, dashboards and internal tools like CRM. A screen that looks good and a screen that works are two different things: good interface design grows out of watching where real people hesitate and give up, and no average of the internet contains that.",
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
      "For a 3D character, an environment or an object sculpted by an artist rather than produced by a generator, this is the place to look. The category holds character artists and digital sculptors, environment and prop artists, authors of game assets, and specialists in 3D animation, texturing and rendering for games, film, advertising and product visualisation. A model has to do more than look right in one frame: it needs clean topology, a sensible mesh and a weight the engine will accept, and only the person who took it from the first polygon knows why it is built that way.",
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
      "If a part, a product or a package has to be manufactured rather than just rendered, this is where to look. The category holds product and industrial designers working on objects, parts and assemblies, packaging and label designers, authors of technical and product visualisation, and people who prepare models for 3D printing and for the factory floor. The difference from a 3D artist is simple: an artist is hired to make a scene look right, a designer is hired to make an object work. Wall thickness, tolerances, how the material shrinks, a file the factory will actually accept: none of that is settled in a render. It is settled by the first batch, and a person answers for it.",
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
      "Looking for photographs of real people, products or events, taken by a photographer rather than generated? This is where to look. The category holds portrait photographers shooting personal, business and family work, commercial specialists covering product, e-commerce and catalogue shoots, architectural photographers working with interiors, property, hotels and restaurants, and reportage photographers covering weddings, conferences and corporate events. A photograph is evidence: this person was there, the light fell that way, and it happened. A generated image can reproduce everything except that.",
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
      "For an advert, a film, an interview or social content cut by a person rather than by an automatic trimmer, start here. The category holds commercial editors, YouTube and social media specialists, film and series editors, and people who assemble interviews and documentaries. Editing is rhythm: the same scene cut two frames early works, cut two frames late it does not. That call is not made by a rule, it is made by someone who has watched all the footage and knows what the story needs.",
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
      "Need animation, titles, a title sequence or an explainer made by an animator rather than a generator? This is the place. The category holds 2D and hand-drawn animators, stop motion specialists, character animators, and authors of explainer films, titles and idents. Animation runs on weight and timing: an object has to accelerate and settle the way objects do, and a character has to move as though it intends something. Those fractions of a second are set by hand, frame by frame.",
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
      "For colour grading on a film, an advert, a music video or online content, done by a colourist rather than a filter, look here. The category holds film and series colourists, advertising and music video specialists, and people grading commercial video and YouTube work. Colour is not a setting, it is a statement: it fixes the hour, the era and the mood of a scene, and it decides whether the audience believes any of it. That call comes from a person who has seen the whole cut and knows where the story is going.",
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
      "Need copy for a website, an advert or an email sequence, written by someone who understood your business rather than generated? This is where to look. The category holds copywriters working on sites, landing pages, ads, email sequences and product descriptions, authors of articles, blogs, interviews and social content, and SEO specialists writing articles, category pages and product cards. Good copy starts with questions for the client: what makes you different from the shop next door, who is buying, and what is stopping them. A generator asks none of that and writes something that suits anyone, which is to say nobody.",
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
      "For an editor or proofreader who will read closely and understand the intent rather than run a checker, look here. The category holds literary editors, book and manuscript specialists, commercial and academic editors, and proofreaders responsible for spelling, punctuation, typography and consistency. An editor earns their fee where the text is technically correct and still not working: the argument comes apart, the chapter opens in the wrong place. Seeing that means holding the whole thing in your head and knowing what the author was trying to do.",
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
      "Looking for translation done by someone who understands both cultures rather than a machine gloss? Start here. The category holds literary translators, specialists in business, legal, technical and medical translation, website translators, and localisers who adapt apps, games, books and advertising to a country and its habits. Translation begins where the dictionary ends: an idiom, a joke and a polite formula cannot be translated, only reinvented in the other language. Doing that means knowing what people laugh at there and what counts as rude.",
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
      "For a script for a film, a video, a game or the stage, written by an author rather than generated, this is the place. The category holds screenwriters for features and shorts, authors of commercial and corporate scripts, game narrative specialists working on quests and branching dialogue, and playwrights writing for theatre, musicals and adaptation. A script is a blueprint for time: a line has to sound like people talking, and a scene has to end one beat before the audience is ready to leave. That sense of rhythm is learned in a room with an audience, not in a dataset.",
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
      "For a real voice for an advert, an audiobook or a dub rather than synthesis, look here. The category holds advertising and corporate voice artists, audiobook narrators, documentary and e-learning voices, telephone system specialists, and dub actors for film, series, games and animation. Synthesis learned to pronounce the words correctly. It has not learned to leave the pause where the character finds it hard to speak. An actor knows what is happening to the person between the lines, and that is what you can hear.",
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
      "Need music written and played by a person rather than generated? This is where to look. The category holds composers writing for film, advertising, games, theatre and podcasts, songwriters working on songs, melodies and jingles, arrangers handling orchestration and preparing a piece for recording, and session musicians for studio work, live performance and individual parts. Music lives in the imprecision: slightly ahead of the beat, a note taken a shade differently. That is exactly what makes a performance alive, and exactly what generation averages away first.",
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
      "For sound on a film, a game or an advert, built by a sound designer rather than pulled from a stock library, start here. The category holds film and game sound designers, interface sound specialists, authors of atmospheres and effects, and people who build the sound of a scene from nothing. Good sound is almost never a recording of what is on screen: footsteps in snow are cornflour in a bag, and fire is often cellophane. The sound designer invents what to build the illusion from, and that substitution comes out of experience rather than out of a catalogue search.",
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
      "Looking for recording, mixing or mastering done by an engineer rather than automatic processing? This is the place. The category holds studio recording engineers, mixing and mastering specialists, audio restoration and clean-up experts, and people who prepare podcasts and finish sound for video. A mix is a decision about what matters in this song and what has to move behind it. An automatic tool levels everything toward the middle; a person listens to the whole thing and takes away what is in the way so the important part can be heard.",
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
      "Looking for a corporate site, an online shop, a web service or an internal application built by a developer rather than generated by a neural network? This is where to look. The category holds frontend developers who build interfaces in HTML, CSS, JavaScript, React and Vue, backend developers responsible for the server side, APIs, databases and integrations, and full-stack developers able to carry a project from the first line of code through launch and the years of support that follow. Generated code tends to hold up right until the first thing nobody anticipated: explaining the decisions and fixing what broke is work only the person who made those decisions can do.",
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
      "For an iOS or Android app written by a developer rather than assembled by a generator, start here. The category holds iOS and Android developers, cross-platform specialists, and people who handle service integrations, store submission and support after release. An app has to survive: the operating system moves on, the store changes its rules, somebody else's service breaks, and each time it is a person who remembers how the thing is built inside who puts it right.",
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
      "Need a game, or part of one, made by a developer rather than assembled from generated pieces? This is the place. The category holds game programmers, gameplay and mechanics specialists, Unity and Unreal Engine developers, and authors of mobile and PC games. A game lives or dies on feel: the jump has to have weight, the hit has to land in your hands, and a few frames of timing decide whether any of it is fun. That gets tuned by hand over hundreds of passes, and nothing generated can tell you where to stop.",
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
      "To automate the repetitive part of a job, connect services that were never meant to talk, or build a tool for one specific problem, look here. The category holds business process automation specialists, service integration developers, authors of bots and scripts, and people who process data and build internal tools for a particular company. Automation does not start with code, it starts with working out how the job is actually done, exceptions included, and the exceptions are never written down anywhere. The only way to find them is to ask the people doing the work.",
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
      "For a second pair of eyes on someone else's code, a hunt for a bug, or a security review, this is where to look. The category holds code quality auditors, bug hunters and architecture reviewers, performance specialists, and experts in security audit, vulnerability testing and hardening sites and applications. An audit is not a run through a checklist: the danger usually sits between the lines, in assumptions nobody wrote down. Finding those means asking the developer questions and understanding what the answers imply.",
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
      "For an interior for a flat, a house, an office or a restaurant, worked out by a designer rather than assembled from pictures, look here. The category holds residential interior designers, specialists in commercial spaces such as offices, restaurants, shops and hotels, and people who run a project end to end: concept, layout, materials, site supervision and decoration. A good render and living in the room are different things: the door has to open, the socket has to be where it is needed, and the material has to last ten years. That is settled on site, not on screen.",
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
      "Need a garden, a terrace or grounds designed by a person rather than generated? Start here. The category holds garden designers, specialists in public spaces and terraces, and people working on planting, plant selection and landscape lighting. A garden is the only project that is not delivered on the day the work ends but five years later: the tree grows and takes the view, the perennial spreads or dies. You are not designing a picture, you are designing time, and that means knowing these plants and this soil.",
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
      "For an object made by a maker's hands rather than stamped out in a factory, this is where to look. The category holds ceramicists making tableware, decorative and sculptural work, woodworkers building furniture, carving and interior pieces, leatherworkers making bags, belts and accessories, textile makers working in embroidery, weaving, knitting and patchwork, glass and stained glass artists, and makers of toys and dolls. A handmade object carries the hand: a slightly uneven edge, a living surface, the mark of a decision taken in the middle of the work. That is what separates it from a copy, and it cannot be generated.",
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
      "Looking for jewellery or accessories made by a maker rather than cast in a run from somebody else's sketch? Start here. The category holds jewellers making rings, earrings, pendants and bracelets, makers of commissioned pieces, repair and restoration specialists, and makers of accessories in leather, glass and other materials. A piece of jewellery is made for a person: for the size, for the hand, for the story behind the commission. A wedding ring with an engraving inside knows something no catalogue does, and it is made by the person who listened to the story.",
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
      "For clothing cut to your measurements or made by its author rather than produced in a run, look here. The category holds designers of women's, men's and children's clothing, authors of their own collections, specialists in stage and historical costume, and tailors making to order. Clothing is judged on a living body: fabric behaves the way it wants, the fit changes as you move, and the garment is finished at the fitting rather than on screen. No image will tell you what the sleeve does when the wearer raises an arm.",
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
      "To save a painting, a book, a piece of furniture or an old photograph, look here. The category holds restorers of painting, frames and gilding, specialists in antique and modern furniture, restorers of books and bindings, sculpture, textile and tapestry, experts in photographs and documents, and people working on architectural elements and decorative work. Restoration is the one craft that cannot be generated by definition: the object already exists, it is damaged, and there is no second attempt. These are people who match a pigment to a two-hundred-year-old canvas and know when to stop.",
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
      "For lettering drawn by a calligrapher's hand rather than set in a typeface or generated, this is the place. The category holds wedding and event calligraphers, specialists in diplomas, certificates and awards, authors of hand-lettered logos and packaging, letterers, and people who draw custom alphabets and work in the traditional schools of the craft. Calligraphy is movement held still on paper: the pressure, the speed and the breath are all visible in the line. A generated script is a picture of writing; this is writing.",
    seoTitle: "Calligraphy & Lettering — human calligraphers and letterers",
    seoDescription:
      "Directory of calligraphers and hand-lettering artists working by hand. Commission custom lettering directly from the artist.",
  },
];
