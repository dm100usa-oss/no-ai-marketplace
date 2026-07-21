import type { Dictionary } from "@/i18n/types";

/**
 * English dictionary — the source language.
 * Text is kept identical to the original single-language site.
 */
export const en: Dictionary = {
  site: {
    name: "No AI Directory",
    tagline: "An international platform for talented professionals",
    taglineSub: "who create work without using artificial intelligence",
    slogan: "",
    description:
      "An international directory of professionals who create professional work and services without the use of generative AI.",
    footerNote: "Human-made creations.",
  },

  nav: {
    directory: "Directory",
    categories: "Categories",
    verified: "Verified",
    pricing: "Pricing",
    about: "About",
    join: "Join",
  },

  footer: {
    explore: "Explore",
    forCreators: "For creators",
    project: "Project",
    legal: "Legal",
    ourApproach: "Our approach",
    directory: "Directory",
    allCategories: "All categories",
    directions: "Directions",
    verifiedProfiles: "Verified profiles",
    addYourProfile: "Add your profile",
    pricing: "Pricing",
    humanMadeStandards: "Human-Made standards",
    verification: "Verification",
    method: "Our method",
    principles: "Our principles",
    faq: "Questions and answers",
    whyUs: "Why us",
    about: "About",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    listingPolicy: "Listing Policy",
    verificationPolicy: "Verification Policy",
    refundPolicy: "Refund Policy",
    contentRemoval: "Content Removal",
    copyrightComplaint: "Copyright Complaint",
  },

  header: {
    addProfile: "Add profile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    searchPlaceholder: "Search creators, categories, products…",
    searchAria: "Search",
    search: "Search",
    language: "Language",
    addProfileFree: "Add your profile, first 50 free",
  },

  common: {
    home: "Home",
    browseCatalog: "Browse catalog",
    addProfile: "Add profile",
    seeAll: "See all",
    viewDirection: "View direction",
    allDirections: "All directions",
    profile: "profile",
    profiles: "profiles",
    category: "category",
    categories: "categories",
    categoryForms: ["category", "categories", "categories"],
    reviewedByHand: "Reviewed by hand",
    leadersPickedByHand: "Leaders picked by hand",
    badgeTeam: "Team",
    badgeTeamWithSize: "Team · {n}",
    peopleForms: ["person", "people", "people"],
    badgeCompany: "Company",
    badgeDemo: "Demo",
    demoNoticeTitle: "This is a demo profile",
    demoNoticeText:
      "A made-up example showing how a profile works in the catalog. This person does not exist and the external links lead nowhere. Real profiles will appear here as the catalog fills up.",
    cardDoes: "Does:",
    humanMadeWork: "Human-made work",
    backToHome: "Back to home",
    contactUs: "Contact us",
  },

  languageSwitcher: {
    label: "Language",
  },

  home: {
    statsVisitsLabel: "visits this week",
    steps: [
      { title: "Tell us about yourself", text: "Create a profile and show your work" },
      { title: "Attract clients", text: "Who value your experience, quality and unique result" },
      { title: "Earn", text: "Doing what you love" },
    ],
    heroAdvantagesTitle: "Our advantages",
    heroAdvantages: [
      "100% of earnings for creators",
      "0% commission for clients",
      "No middlemen. No hidden fees",
    ],
    heroClientsTitle: "For clients",
    heroClients: [
      "Work with individual, verified professionals",
      "Build your own team for a specific project",
      "Choose an established team or company",
      "Talk directly with the people behind the work",
      "Lower legal and creative risks",
      "Get predictable quality and original work",
    ],
    heroCreatorsTitle: "For creators",
    heroCreators: [
      "Find clients who value your experience and craft",
      "Keep 100% of what you earn, no platform cut",
      "Work solo, join a team, or start your own company",
      "Build long-term relationships with clients",
    ],
    heroJoinButton: "Join the platform",
    heroSlogan: "Let's bring back the value of human work",
    newMembersTitle: "New members",
    newMembersNamePlaceholder: "Name",
    heroStatement:
      "No AI Directory is where businesses and individual clients find verified professionals, teams and companies working without generative AI, when originality, accountability and clear rights to the result matter",
    heroFindButton: "Find a creator",
    heroActions: [
      { hint: "A creator", label: "for a specific task", href: "/directions?type=creator" },
      { hint: "A team", label: "for your project", href: "/directions?type=team" },
      { hint: "A company", label: "for larger work", href: "/directions?type=company" },
    ],
    heroSearchPlaceholder: "Search creators, categories, products…",
    heroSearchAria: "Search creators",
    findAuthor: "Find a creator",
    findAuthorHint: "Choose who you need",
    browseCatalog: "Browse catalog",
    addProfile: "Add profile",
    exploreDirections: "All directions",
    exploreDirectionsSub:
      "Choose a direction and find the right creator, team, or company.",
    popularCategories: "Popular categories",
    popularCategoriesSub: "Straight to the specialization you need.",
    howItWorks: "How the platform works",
    howItWorksSub:
      "A showcase for human creators, with the actual work happening on their own platforms.",
    howItWorksCards: [
      {
        t: "Human creators",
        d: "Every profile belongs to a real person, studio or company whose work is made by people, not AI.",
      },
      {
        t: "Direct to their platform",
        d: "Cards link straight to the creator's own site, shop or portfolio. Buying and messaging happen there.",
      },
      {
        t: "Honest verification",
        d: "Creators can submit process photos, drafts and published work. We review by hand and describe what was checked.",
      },
    ],
    featuredCreators: "Featured creators",
    featuredCreatorsSub:
      "Leaders picked by hand rise to the top of the catalog.",
    forBuyers: "For buyers and clients",
    forBuyersText:
      "Looking for illustration, writing, design or photography made by a real person? Search or browse the catalog, open the profile that fits, and go straight to the creator's own site to talk or buy.",
    forBuyersPoints: [
      "Every profile is a real human creator or human-made business.",
      "No middleman, no in-site checkout. You deal with the creator directly.",
      "Verified profiles show exactly what was reviewed.",
    ],
    forCreators: "For creators and companies",
    forCreatorsText:
      "If your work is made by humans, be found by buyers who value that. Add your profile with links to your own site, shop or portfolio. Traffic goes to you, not to a middleman.",
    forCreatorsPoints: [
      "The first 50 profiles are free until the end of 2026.",
      "All external links belong to you. Buyers land on your platform.",
      "Submit materials for a verified badge and gain trust faster.",
    ],
    newProfiles: "New profiles",
    newProfilesSub: "Recently added human creators and companies.",
    verificationTitle: "Honest verification, reviewed by hand",
    verificationText:
      "Creators can submit process photos, video, sketches, drafts or published work. We review each submission by hand and describe on the profile what exactly was checked. Verification does not claim a legal guarantee. It is an honest, human review of the materials the creator provided.",
    seeVerified: "See verified profiles",
    standardsLink: "Our method",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is No AI Directory?",
        a: "An international directory of people, studios and companies whose work is made by humans, not by AI. You browse here, then visit the creator's own site or shop to buy or hire. The site is a showcase, not a shopping cart.",
      },
      {
        q: "How do I find a creator?",
        a: "Two ways: search from the top of any page, or browse the Directory tree by direction and category. Both lead to the same creator cards.",
      },
      {
        q: "Do I buy things on this site?",
        a: "No. Every card links to the creator's own website, shop or portfolio: Etsy, Behance, Amazon, their personal site and so on. Payments, delivery and communication all happen there, directly with the creator.",
      },
      {
        q: "What does “verified” mean?",
        a: "Verified profiles have submitted materials, such as process photos or video, sketches, drafts or published work, that were reviewed by hand. We describe what was reviewed on each profile. It is a good-faith review, not a legal guarantee.",
      },
      {
        q: "How do I add my profile?",
        a: "The first 50 profiles are free until the end of 2026. After that, listings are paid: a creator is $5.99/month or $49/year, a team $14.99 or $119, a company $29.99 or $239. You fill out one form, say who you are and submit materials for review. Full instructions on the Add Your Profile page.",
      },
      {
        q: "Is AI-generated work allowed?",
        a: "The catalog is focused on human-made work. Creators state their AI usage openly on their profile. Fully AI-generated listings are not accepted; hybrid work is accepted when the human contribution is the substance of the work and is stated clearly.",
      },
    ],
    closingTitle: "Are you a human creator?",
    closingText:
      "The first 50 profiles are free until the end of 2026. Get found by buyers looking for work made by people.",
    closingCta: "Add your profile",
  },

  pricing: {
    metaTitle: "Pricing",
    metaDescription:
      "No AI Directory plans: creator, team, company. The first 50 profiles are free until the end of 2026.",
    title: "Pricing",
    intro:
      "One plan per participant type. A creator pays for themselves, a team for the team, a company for the company. You pay to list a profile and nothing else: there is no commission on your work, and clients pay you directly.",
    freeBannerTitle: "The first {n} profiles are free",
    freeBannerText:
      "Free until {date}, whichever type you are. The places are counted across everyone together. Once they run out, listing moves to the plans below.",
    perMonth: "per month",
    perYear: "per year",
    billedMonthly: "Monthly",
    billedYearly: "Yearly",
    saveLabel: "Save {n}",
    planNames: {
      creator: "Creator",
      team: "Team",
      company: "Company",
    },
    planFor: {
      creator: "You work alone and answer for the result yourself.",
      team: "There are several of you and you take projects together.",
      company: "You are a registered business with your own staff.",
    },
    planFeatures: {
      creator: [
        "A personal profile in your own name",
        "Portfolio and all external links",
        "Several categories",
        "Clients contact you directly",
      ],
      team: [
        "A team profile with the number of members",
        "Shared portfolio and roles",
        "Several categories and directions",
        "One contact for the whole team",
      ],
      company: [
        "A company or studio profile",
        "Website, staff, registration",
        "All categories and directions",
        "Verified as a business",
      ],
    },
    freeNowLabel: "Free right now",
    everythingTitle: "In every plan",
    everythingItems: [
      "A profile page search engines and AI can read",
      "Direct links to your own platforms, no commission",
      "A verification request and the verified mark",
      "Cancel any time",
    ],
    howPaymentTitle: "How payment works",
    howPaymentText1:
      "Payment goes through Stripe. We never hold your card details and we take no percentage of your work: the client pays you directly on your own platform.",
    howPaymentText2:
      "You can cancel any time. Your profile stays in the catalog until the end of the period you paid for.",
    readyTitle: "Ready to list your profile",
    readyText:
      "While the free places last, listing costs nothing. Fill in the form and we will come back to you.",
    addProfile: "Add profile",
    readStandards: "Our standards",
    claimFree: "Claim a free place",
    getStarted: "Choose a plan",
  },

  join: {
    metaTitle: "Add your profile",
    metaDescription:
      "Add a profile to No AI Directory. The first 50 are free until the end of 2026, then from $5.99/month.",
    title: "Add your profile",
    intro:
      "Be found by buyers looking for work made by people. Add your profile in a few minutes. The first 50 profiles are free until the end of 2026.",
    startNow: "Start now",
    seePricing: "See pricing",
    whyTitle: "Why be on No AI Directory",
    whyPoints: [
      "All buyer traffic goes to your own site, shop or portfolio, not to a middleman.",
      "Your profile is a clean, indexable page built for SEO and generative AI answers.",
      "A verified badge shows exactly what we reviewed, which builds trust with buyers.",
      "One-time set-up, then the profile keeps working while you focus on the work.",
    ],
    plansTitle: "Plans",
    fullComparisonLink: "Pricing",
    howTitle: "How it works",
    steps: [
      {
        t: "Fill in the form",
        d: "Name, one main category, description, country, tags and the links to your own platforms. Verified creators also attach process materials.",
      },
      {
        t: "Pick a plan",
        d: "The first 50 profiles are free until the end of 2026. After that you choose the plan for your type and a period, monthly or yearly, and pay through Stripe.",
      },
      {
        t: "We review by hand",
        d: "We check the profile fits the Human-Made standards and, if you asked for verification, we look at the materials.",
      },
      {
        t: "Your profile goes live",
        d: "The profile appears in the catalog and starts sending traffic to your own platforms.",
      },
    ],
    formTitle: "The form",
    formIntro:
      "Fill in the form below. While free places last, listing costs nothing. Once they run out, the form moves to payment through Stripe.",
    pickTitle: "Who you are",
    pickIntro:
      "Pick how you work. It decides what the form asks you and how your profile looks in the catalog.",
    pickOptions: {
      creator: {
        title: "Creator",
        text: "You work alone and answer for the result yourself.",
        points: ["A personal profile in your own name", "Your portfolio and your links", "Clients write to you directly"],
      },
      team: {
        title: "Team",
        text: "There are several of you and you take projects together.",
        points: ["A team profile with the number of members", "Shared portfolio and roles", "One contact for the whole team"],
      },
      company: {
        title: "Company or studio",
        text: "You are a registered business with your own staff.",
        points: ["A company profile", "Website, registration, staff", "Verified as a business"],
      },
    },
    pickCta: "Fill in the form",
    pickChange: "Choose another",
    pickChosen: "You picked:",
    rulesTitle: "Rules and standards",
    rulesText1: "Please read ",
    rulesLink1: "Human-Made standards",
    rulesText2:
      " before you submit. The standards describe what belongs in the catalog and what does not, and how hybrid work fits. Payments and listing rules are covered in the ",
    rulesLink2: "Listing Policy",
    rulesText3: ".",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "How much does a profile cost?",
        a: "The first 50 profiles on the site are free until the end of 2026. After that, what you pay depends on who you are: a creator is $5.99/month or $49/year, a team $14.99 or $119, a company $29.99 or $239. Paying yearly saves about a third.",
      },
      {
        q: "What do I need to add a profile?",
        a: "A short description of your work, main and additional categories, country, tags, and links to your own site, portfolio or shop. Verified creators additionally submit process materials.",
      },
      {
        q: "How long until my profile goes live?",
        a: "Profiles are reviewed by hand and typically appear in the catalog within a few working days. Verification, if requested, may take a little longer.",
      },
      {
        q: "Can I edit my profile later?",
        a: "Yes. Email us with the changes and we update the listing. A self-service dashboard is on the roadmap.",
      },
      {
        q: "Can I cancel?",
        a: "Yes. Paid listings can be cancelled at any time; the profile stays live until the end of the current period, then is removed from the catalog.",
      },
      {
        q: "Do you take a cut of my sales?",
        a: "No. We are a directory, not a marketplace. All transactions happen on your own site, shop or portfolio. We never sit between you and your buyer.",
      },
    ],
  },

  about: {
    metaTitle: "About the project",
    metaDescription:
      "No AI Directory is an international directory of people, studios and companies who create work, products and services without AI. It is a showcase, not a shop.",
    title: "About No AI Directory",
    intro:
      "No AI Directory is an international directory of people, studios and companies whose work is made by humans, not by AI. It is a showcase and a source of traffic, not a shop with a cart, not a place where money changes hands.",
    whatTitle: "What the site does",
    whatText:
      "A buyer searches or browses the catalog, finds a creator or company, opens their profile, and clicks through to the creator's own site, shop or portfolio. Payment, delivery, communication and revisions all happen there, directly between buyer and creator. We do not sit in the middle.",
    whyTitle: "Why it exists",
    whyText:
      "As AI generates more of the content, products and services online, the demand for verified human-made work grows. Buyers, brands and agencies want to find creators whose work is genuinely made by hand or by human judgment. Creators, in turn, want to be recognized for that and be easy to find. No AI Directory closes both sides of that need.",
    howTitle: "How profiles get into the catalog",
    howText:
      "The first 50 profiles are free until the end of 2026. After that, listings are paid. Each profile is reviewed before it goes live. Verified creators additionally submit materials (process photos or video, drafts, published work) that we look at by hand. The profile then shows what was reviewed.",
    notClaimTitle: "What we do not claim",
    notClaimText1:
      "We do not claim a legal guarantee that no AI was ever used at any step of any listed work. Verification is an honest, human review of the materials the creator provided, and we describe on each profile exactly what that review covered. Read more in ",
    standardsLink: "Human-Made standards",
    notClaimText2: " and ",
    verificationLink: "Verification",
    notClaimText3: ".",
    browseCatalog: "Browse the catalog",
    addProfile: "Add your profile",
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "How to reach No AI Directory, for owners of listed profiles, buyers, journalists and partners.",
    title: "Contact",
    intro:
      "The best way to reach us is by email. We read every message and reply within a few working days.",
    emailLabel: "Email",
    whatTitle: "What to write about",
    addingTitle: "Adding your profile",
    addingText1: "Please use the ",
    addingLink: "Add your profile",
    addingText2:
      " page. The form there collects everything we need and is the fastest path in. Email is for follow-up questions.",
    correctionsTitle: "Corrections and updates",
    correctionsText:
      "If details on your profile need to change, email us with the profile URL and what should be updated.",
    reportingTitle: "Reporting a problem with a listing",
    reportingText:
      "Every profile page has a Report a problem link at the bottom. That is the fastest route, it lands directly in our inbox with the profile URL attached.",
    pressTitle: "Press and partnerships",
    pressText:
      "Journalists, researchers and partners are welcome. Please include the outlet and a short brief; we'll get back with relevant details.",
    legalTitle: "Legal notices",
    legalText1: "Copyright complaints and takedown requests are handled through ",
    legalLink: "Content Removal",
    legalText2: ". That page lists what we need to act on a request.",
    footNote:
      "No AI Directory does not run in-site transactions. Purchases and enquiries always happen on the creator's own platform, not here.",
  },

  directory: {
    metaTitle: "Directory",
    metaDescription:
      "Search and browse every active human-made creator, studio and company on No AI Directory. Filter by direction, category, country and verification.",
    title: "Directory",
    intro:
      "Every active profile in the catalog: people, studios and companies who create work, products and services without AI. Search by name, category or country, and open a card to jump straight to the creator's own platform.",
    searchPlaceholder: "Search creators, categories, products…",
    searchAria: "Search creators",
    filters: "Filters",
    filtersTitle: "Filters",
    direction: "Direction",
    allDirections: "All directions",
    category: "Category",
    allCategories: "All categories",
    country: "Country",
    anyCountry: "Any country",
    verification: "Verification",
    any: "Any",
    verifiedOnly: "Verified only",
    sortBy: "Sort by",
    newestFirst: "Newest first",
    featuredFirst: "Featured first",
    aToZ: "A to Z",
    clearAll: "Clear all",
    clearAllFilters: "Clear all filters",
    show: "Show",
    forQuery: "for",
    sortLabelFeatured: "Sort: featured first",
    sortLabelAz: "Sort: A→Z",
    noMatchesFor: "No matches for",
    noMatchesFilters: "No profiles match these filters",
    noMatchesHint: "Try a broader search or clear a filter.",
    removePrefix: "Remove",
  },

  verified: {
    metaTitle: "Verified profiles",
    metaDescription:
      "Creators and businesses reviewed based on submitted materials. Verified human-made process on No AI Directory.",
    title: "Verified profiles",
    intro:
      "These creators and businesses have been reviewed based on submitted materials. Verification is done by hand and reflects the human-made process shown to us. It is not a legal guarantee.",
    banner:
      "Verified based on submitted materials · Human-made process reviewed · Creator identity and process reviewed.",
    howTitle: "How verification works",
    howCards: [
      {
        t: "1. Submit materials",
        d: "Creators send process photos or video, sketches, drafts, published work, or anything that shows how the work is made.",
      },
      {
        t: "2. Reviewed by hand",
        d: "We look at the materials, check that they line up with the profile, and decide whether the review supports a verified badge.",
      },
      {
        t: "3. What was checked appears on the profile",
        d: "The profile shows a short description of what we actually reviewed, with no vague claims, no legal guarantees.",
      },
    ],
    twoBadges:
      "Two badges are used: Verified Human Creator (for individuals) and Verified Human-Made Business (for studios and companies).",
    countSuffixOne: "verified profile",
    countSuffixMany: "verified profiles",
    emptyTitle: "No verified profiles yet",
    emptyMessage:
      "Verified creators will appear here as materials are reviewed.",
  },

  categoriesPage: {
    metaTitle: "All categories",
    metaDescription:
      "Every category on No AI Directory, grouped by direction. Find human-made creators by exactly what they do.",
    title: "All categories",
    intro:
      "Every category across all directions, each with its own page. Find human creators by exactly what they make.",
    viewDirection: "View direction →",
  },

  directionsPage: {
    metaTitle: "Directions",
    metaDescription:
      "Browse the major directions of No AI Directory: art, literature, design, photo and video, writing, music, development, architecture and craft. People and studios who create without AI.",
    title: "Directions",
    intro:
      "The major directions of the catalog. Each one opens into its professions, where you find people and studios who create without AI.",
    byType: {
      creator: "Choose a direction",
      team: "Choose a direction",
      company: "Choose a direction",
    },
    byTypeIntro: {
      creator:
        "A creator works alone and answers for the result personally. Pick a direction, then a profession, then a person.",
      team: "A team comes together for a project that needs several specialists at once. Pick a direction, then a profession, then a team.",
      company:
        "A company or studio takes on larger work with its own staff. Pick a direction, then a profession, then a company.",
    },
  },

  categoryDetail: {
    featuredIn: "Featured in",
    leadersPickedByHand: "Leaders picked by hand",
    allProfiles: "All profiles in this category",
    emptyTitlePrefix: "No",
    emptyMessage:
      "This category is ready and waiting for its first profiles. Add yours.",
  },

  directionDetail: {
    categories: "Categories",
    featuredIn: "Featured in",
    leadersPickedByHand: "Leaders picked by hand.",
  },

  standards: {
    metaTitle: "Human-Made standards",
    metaDescription:
      "What counts as human-made on No AI Directory, what does not, and where hybrid work fits.",
    title: "Human-Made standards",
    intro:
      "A short, honest description of what we mean by human-made, so creators know what belongs here and buyers know what to expect.",
    oneLineTitle: "The one-line rule",
    oneLineText:
      "The substance of the work, meaning the drawing, the writing, the photograph, the design decision, the code, the object made by hand, is done by a human. If AI touched it, the human contribution is still the substance, and the creator says so clearly.",
    belongsTitle: "What clearly belongs here",
    belongsItems: [
      "Hand-drawn or hand-painted illustration and art, including work done in a graphics tablet by a person.",
      "Photography and video where the person behind the camera made the frames.",
      "Writing, editing and copy where a human wrote and shaped the text.",
      "Design and branding work where the concept, layout and typography are the designer's.",
      "Handmade objects, craft and small-batch production.",
      "Professional services that trade on human judgment: consulting, teaching, coaching, architecture, engineering, legal, medical adjacent work.",
    ],
    hybridTitle: "Where hybrid work fits",
    hybridText1:
      "AI touches many workflows now: background clean-up, transcription, research assistance, spell check, color balancing. That is fine, as long as the human contribution is the substance of the finished work and the creator is open about how AI was used. Each profile has an ",
    hybridStrong: "On the use of AI",
    hybridText2:
      " statement for this. Clarity is the standard, not silence.",
    notBelongTitle: "What does not belong",
    notBelongItems: [
      "Listings whose main output is AI-generated imagery, text, music or code with only a light human touch on top.",
      "Storefronts that resell AI-generated goods as human-made.",
      "Portfolios that pass off AI-generated pieces as hand work.",
      "Deceptive claims of authorship or process.",
    ],
    verificationBoxTitle: "Verification is optional and honest",
    verificationBoxText1:
      "Creators may submit materials for a verified badge. We review by hand and describe on the profile what we looked at. We do not claim a legal guarantee of no-AI-anywhere. See ",
    verificationLink: "Verification",
    verificationBoxText2: ".",
    ifWrongTitle: "If we get it wrong",
    ifWrongText1:
      "Every profile page has a Report a problem link. If a listing looks like it breaks these standards, tell us. we review reports by hand. See also ",
    listingPolicyLink: "Listing Policy",
    ifWrongText2: ".",
  },

  faqPage: {
    metaTitle: "Questions and answers",
    metaDescription:
      "How to find professionals who work without generative AI, how to work with them directly, and how the No AI Directory directory works.",
    title: "Questions and answers",
    intro:
      "Straight answers to the questions people actually ask about hiring, and about working, without generative AI. If a question is missing, the catalog and the profiles usually answer it in practice.",
    groups: [
      {
        title: "For people looking to hire",
        items: [
          {
            q: "Where can I find professionals who work without generative AI?",
            a: "Right here. No AI Directory is an international directory of professionals who create work and services without the use of generative AI. You can browse by category, search by name or skill, and open a full profile for each person or studio. Every profile links straight to the professional's own site and channels, so you reach out to them directly.",
          },
          {
            q: "How do I choose the right professional?",
            a: "Open a few profiles in the category you need and compare them the way you would compare portfolios anywhere: look at the work, read how each person describes their process, check the country and languages, and read their statement on how they use, or do not use, AI. When the work and the approach fit, contact them directly and agree on the details together.",
          },
          {
            q: "Do I pay a commission or work through a middleman?",
            a: "No. The directory helps you find the right professional and then steps out of the way. There is no platform fee on your project and no middleman between you and the person you hire. You contact them directly and agree on terms with them, one to one.",
          },
          {
            q: "How do I know the work is really made by a person?",
            a: "Each profile explains how the professional works and how they use AI, in their own words. Many profiles are also reviewed by hand and carry a verified badge that describes what was actually checked. We are honest about the limits of this: it is a careful human review, not a legal guarantee. The point is transparency you can read and judge for yourself.",
          },
        ],
      },
      {
        title: "For professionals listing their work",
        items: [
          {
            q: "Where can I present my services and find clients?",
            a: "Create a profile here. You get a dedicated page to describe yourself, publish your services, show your portfolio, and link to your own website and social channels. Clients who specifically want human-made work find you through search and the catalog and contact you directly, with no commission taken from your projects.",
          },
          {
            q: "How do I stand out from everyone else?",
            a: "On general marketplaces, work made by a person and work generated by AI sit side by side, and the difference gets lost. Here the whole audience is looking for exactly what you do. A clear profile, a real portfolio, and an honest statement about your process are enough to stand out, because that is precisely what this audience came to find.",
          },
          {
            q: "How do I show that my work is done without generative AI?",
            a: "Your profile carries a short statement on how you work and how you use AI, if at all. You can also submit materials, such as process photos, drafts, or published work, for a hand review and a verified badge. Openness is the standard here, not silence: buyers trust what they can read and see.",
          },
          {
            q: "How do clients reach me?",
            a: "Directly. Your profile links to your own site and channels, so inquiries come straight to you. The directory brings you an audience that is already looking for professionals who work without generative AI, and then lets you and the client work together without anyone in between.",
          },
        ],
      },
      {
        title: "About working without generative AI",
        items: [
          {
            q: "Why choose a professional who works without generative AI?",
            a: "Because original human work carries judgment, authorship, and accountability that generated output does not. For many projects, from brand identity to writing that represents a company, originality and a real person behind the work are the whole point. This directory exists for the moments when that matters.",
          },
          {
            q: "What counts as using generative AI?",
            a: "We draw the line at substance. If the core of the work, the drawing, the writing, the photograph, the design decision, the code, is created by a person, it belongs here, even when ordinary tools assist along the way. What does not belong is output that is mainly AI-generated and then presented as human-made. The professional states clearly how AI is or is not used, and that clarity is the standard.",
          },
          {
            q: "Is this about being against AI?",
            a: "No. It is about choice and honesty. AI has its place, and many everyday tools quietly use it. This directory simply gives people a reliable way to find and hire professionals whose work is made by a human, and gives those professionals a place where that is understood and valued.",
          },
        ],
      },
    ],
    byProfessionTitle: "Questions by profession",
    byProfessionIntro:
      "Every craft has its own proofs and its own questions. An illustrator shows layers, a translator shows how they handled an idiom, a developer shows commit history.",
    ctaTitle: "Find the right professional, or become one people find",
    ctaText:
      "Browse the catalog to hire someone directly, or create a profile and let the right clients come to you.",
    ctaFind: "Browse the catalog",
    ctaJoin: "Add your profile",
  },

  method: {
    metaTitle: "Our method",
    metaDescription:
      "How No AI Directory defines human-made work without generative AI, how professionals present themselves, and how profiles are reviewed and verified by hand.",
    title: "Our method",
    intro:
      "How this directory works, what we mean by work made without generative AI, and how we keep it honest for both sides. Plain language, no fine print.",
    sections: [
      {
        heading: "The idea in one line",
        paragraphs: [
          "No AI Directory is an international directory of professionals who create professional work and services without the use of generative AI. Professionals present themselves and their portfolios; clients find them through search and the catalog and work with them directly, with no middlemen and no commissions.",
        ],
      },
      {
        heading: "Where we draw the line",
        paragraphs: [
          "We judge by substance. The core of the work, the drawing, the writing, the photograph, the design decision, the code, the object made by hand, is done by a person. Ordinary tools may assist along the way, but the human contribution is the substance of the finished work, and the professional says so clearly.",
        ],
        bullets: [
          "Belongs here: hand-drawn and hand-painted art, including work made on a graphics tablet by a person; photography and video shot by the person behind the camera; writing and editing shaped by a human; design and branding where the concept and typography are the designer's; handmade objects and craft; and professional services built on human judgment, such as consulting, teaching, architecture, or engineering.",
          "Does not belong here: listings whose main output is AI-generated imagery, text, music, or code with only a light human touch on top; storefronts that resell AI-generated goods as human-made; and any claim of authorship or process that is not honest.",
        ],
      },
      {
        heading: "Where everyday tools fit",
        paragraphs: [
          "AI touches many workflows now, from background clean-up and transcription to spell check and color balancing. That is fine, as long as the human contribution is the substance of the finished work and the professional is open about how AI was used. Every profile carries a short statement on this. Clarity is the standard, not silence.",
        ],
      },
      {
        heading: "How professionals present themselves",
        paragraphs: [
          "Each professional builds their own profile: who they are, the services they offer, a portfolio of real work, the countries and languages they work in, links to their own site and channels, and a clear statement on how they use, or do not use, AI. This is what a client reads before reaching out, so honesty and detail work in the professional's favor.",
        ],
      },
      {
        heading: "HTVS: four levels of proof",
        paragraphs: [
          "There is no single proof that a human made the work. There are levels, and the higher the level, the fewer questions a client has. The method is called HTVS: Human Talent Verification and Support. Verification is for the client, so they can see what a creator's process is backed by. Support is for the creator, because a directory's job is not to suspect them but to put their work in front of the people who pay for it.",
          "You do not have to reach the top level. Level one is honest on its own, and it is where everyone starts. Level two satisfies most clients.",
        ],
        bullets: [
          "Level 1. Statement. The creator describes how they work, in their own words. What it proves: where the author stands and that they are willing to answer for it. What it does not prove: anything beyond what is said.",
          "Level 2. Source files. Layered files, sketches, drafts, work in progress. What it proves: the work grew in pieces rather than arriving finished. What it does not prove: that no part of it was generated.",
          "Level 3. Version history. Autosaves, cloud file history, edit history. What it proves: a sequence of work over time, which is hard to assemble after the fact. What it does not prove: who authored the versions being saved.",
          "Level 4. C2PA signature. A cryptographic provenance record written by editors and cameras. What it proves: the file has not changed since signing and passed through the named tools. What it does not prove: that what was shot or drawn is what is claimed. It is also easily lost: almost every platform strips metadata on upload.",
        ],
      },
      {
        heading: "How verification works",
        paragraphs: [
          "Verification is optional and honest. A professional may submit materials, such as process photos or video, sketches, drafts, or published work, that show how the work is made. We review them by hand, check that they line up with the profile, and, if the review supports it, add a verified badge with a short description of what we actually looked at.",
          "We are careful about what this means. It is a considered human review of the materials shown to us, not a legal guarantee that no AI was ever involved anywhere. Two badges are used: Verified Human Creator for individuals, and Verified Human-Made Business for studios and companies.",
        ],
      },
      {
        heading: "How we keep it honest",
        paragraphs: [
          "Every profile has a way to report a problem. If a listing looks like it crosses the line, people tell us, and we review those reports by hand. This directory works because both sides trust what they read here, so we would rather be plain about our limits than promise more than we can stand behind.",
        ],
      },
    ],
    ctaTitle: "See how it works in practice",
    ctaText:
      "Browse verified and unverified professionals in the catalog, or create your own profile and show how you work.",
    ctaFind: "Browse the catalog",
    ctaJoin: "Add your profile",
  },

  whyUs: {
    metaTitle: "Why us",
    metaDescription:
      "Why No AI Directory is the reliable place to find and hire professionals who work without generative AI, and to be found by clients who value human work.",
    title: "Why us",
    intro:
      "Why this directory, and not a general marketplace or an open search. What we focus on, and what that focus is worth to both sides.",
    sections: [
      {
        heading: "One clear focus",
        paragraphs: [
          "We do one thing: connect professionals who work without generative AI with the clients who specifically want that. We are not a general freelance marketplace with a filter bolted on. The whole directory is built around this single subject, which is exactly why it works for the people who come here for it.",
        ],
      },
      {
        heading: "A place, not a middleman",
        paragraphs: [
          "We help you find each other and then step out of the way. Clients contact professionals directly, and they agree on terms one to one, with no commission taken from the work and no one standing between them. We see ourselves as a partner to both sides, not a broker taking a cut of every project.",
        ],
      },
      {
        heading: "Honesty over hype",
        paragraphs: [
          "We are plain about what we do and do not promise. Profiles state how AI is used or not used; verification is a hand review, described in real terms, not a legal guarantee. That honesty is the point. It is what lets clients trust what they read here and lets professionals be judged on real work.",
        ],
      },
      {
        heading: "Built to be found",
        paragraphs: [
          "People increasingly ask search engines and AI assistants where to find professionals who work without generative AI. This directory is built so those answers lead here, and so each professional's profile can be found for exactly what they do. Being listed here means being findable by the clients who are already looking.",
        ],
      },
      {
        heading: "Value for both sides",
        paragraphs: [
          "For clients: a reliable way to find original, human-made work and to hire the person behind it directly. For professionals: an audience that already values what you do, a profile that represents you honestly, and direct inquiries with no commission on your projects. The same focus serves both, which is what makes the directory worth being part of.",
        ],
      },
    ],
    ctaTitle: "Join a directory built around human work",
    ctaText:
      "Find a professional and work with them directly, or add your profile and be found by the clients who want exactly what you do.",
    ctaFind: "Browse the catalog",
    ctaJoin: "Add your profile",
  },

  profile: {
    services: "Services",
    products: "Products",
    portfolio: "Portfolio",
    portfolioHint: "A selection of recent work. Tap any piece to view it full screen.",
    video: "Video",
    watchExternal: "Watch on external platform",
    workingProcess: "Working process",
    workingProcessHintStudio: "How the studio typically works with clients.",
    workingProcessHintCreator: "How the creator typically works with clients.",
    onAiTitle: "On the use of AI",
    reviewedByHand: "Reviewed by hand",
    howVerificationWorks: "How verification works",
    moreInPrefix: "More in",
    moreInFallback: "this category",
    seeAll: "See all →",
    visit: "Visit",
    visitPortfolio: "Visit portfolio",
    visitWebsite: "Visit website",
    whereToFind: "Where to find",
    whereToFindThem: "Where to find them",
    languages: "Languages",
    purchaseNote:
      "Purchases and enquiries happen on the creator's own platform, not here.",
    processStep1:
      "You reach out on {kind}'s own site or shop, using the links on this page.",
    processStep2:
      "You describe the project, including goals, materials and timing, and get a scope and quote.",
    processStep3Company:
      "Work is done by hand, by the team; process updates and drafts are shared as agreed.",
    processStep3Creator:
      "Work is done by hand, personally; process updates and drafts are shared as agreed.",
    processStep4:
      "Payment, delivery and revisions happen directly with {kind}, not on No AI Directory.",
    kindStudio: "the studio",
    kindTeam: "the team",
    kindCreator: "the creator",
    linkWebsite: "Website",
    linkPortfolio: "Portfolio",
    linkEtsy: "Etsy shop",
    linkAmazon: "Amazon",
    linkBehance: "Behance",
    linkDribbble: "Dribbble",
    linkLinkedin: "LinkedIn",
    linkInstagram: "Instagram",
    linkYoutube: "YouTube",
  },

  badges: {
    verifiedCreator: "Verified creator",
    verifiedBusiness: "Verified business",
    verifiedTitle: "Verified based on submitted materials",
    featured: "Featured",
  },

  report: {
    prompt: "Something wrong with this profile?",
    reportProblem: "Report a problem",
    sentThanks:
      "Thanks, your mail client should have opened with the report ready to send. We review every report by hand.",
    title: "Report a problem",
    subtitle: "Tell us what looks wrong. We read every report and act by hand.",
    reason: "Reason",
    reasonMisuse: "Suspected misuse of AI",
    reasonWrongInfo: "Wrong information on the profile",
    reasonImpersonation: "Impersonation or stolen identity",
    reasonBrokenLinks: "Broken or misleading links",
    reasonCopyright: "Copyright complaint",
    reasonOther: "Other",
    details: "Details",
    detailsPlaceholder: "What did you notice? Any evidence we should look at?",
    sendReport: "Send report",
    cancel: "Cancel",
    footNote:
      "Your mail client opens with the report ready to send. We do not track submissions inside this form.",
  },

  tally: {
    notice1:
      "The submission form is powered by Tally and includes a built-in limit of 50 free places. Once that limit is reached, the form automatically switches to the paid step and takes payment through Stripe.",
    notice2a: "The form is being connected. In the meantime, please ",
    getInTouch: "get in touch",
    notice2b: " to be added.",
    iframeTitle: "Add your profile",
  },

  states: {
    emptyTitle: "Nothing here yet",
    emptyMessage:
      "No profiles in this section yet. Check back soon, or add yours.",
    errorTitle: "Something didn't load",
    errorMessage: "This page couldn't be shown. Refresh to try again.",
    backToDirectory: "Back to directory",
    slotYourWork: "Your work",
    slotTitle: "No profiles yet: {name}",
    slotMessage: "This category is ready and waiting for its first profiles. Add yours.",
    slotBeFirst: "Be the first",
    slotName: "Name",
    slotRole: "Profession",
    slotTagCountry: "Country",
    slotTagDirection: "Direction",
    slotTagWork: "Work",
    slotAction: "Add your profile",
    slotNote: "The first 50 profiles are free until the end of 2026",
  },

  notFound: {
    title: "Page not found",
    text: "This page doesn't exist or was moved. Try the directory or search from the top.",
    goHome: "Go home",
    browseDirectory: "Browse directory",
  },

  reviews: {
    title: "Reviews",
    subtitle:
      "What people say about the platform after using it. Every review is read by a person before it goes up.",
    basedOn: "based on {n} reviews",
    formTitle: "Leave a review",
    nameLabel: "Name",
    namePlaceholder: "What should we call you",
    ratingLabel: "Rating",
    textLabel: "Review",
    textPlaceholder: "Tell us how it went",
    submit: "Send review",
    sending: "Sending...",
    moderationNote:
      "Your review goes up once it has been read. We do not remove criticism: only abuse and spam.",
    thanksTitle: "Thank you, your review is in",
    thanksText: "It will appear on the page once it has been read, usually within a day or two.",
    errName: "Please add a name, at least two characters.",
    errRating: "Please pick a rating from one to five stars.",
    errText: "Please write a few words, at least ten characters.",
    errRate: "There is already a review from this address today. Try again tomorrow.",
    errServer: "Could not send it. Please try again in a moment.",
  },

  stub: {
    ownerNote:
      "The final text is added by the owner. Structure and links are in place; content to follow.",
  },

  legal: {
    privacy: {
      title: "Privacy Policy",
      intro:
        "This page explains how No AI Directory handles personal data, cookies and third-party services (Tally forms, Stripe payments, analytics, hosting on Vercel). We collect the minimum needed to run the directory and never sell your data.",
    },
    terms: {
      title: "Terms of Use",
      intro:
        "These terms cover how visitors and listed creators use the site: acceptable use, the fact that all transactions happen on the creator's own platform, our right to remove listings that break the Human-Made standards, and standard disclaimers.",
    },
    listingPolicy: {
      title: "Listing Policy",
      intro:
        "This page describes what belongs in the catalog, how new listings are reviewed, how paid plans work, and the conditions under which a listing can be edited, suspended or removed. It complements the Human-Made standards, which describe what human-made means in practice.",
    },
    verificationPolicy: {
      title: "Verification Policy",
      intro:
        "This page states the ground rules for verification: what materials we accept, how the human review works, what a Verified badge means, what it does not mean (no legal guarantee), how findings are described on each profile, and how a badge can be revoked. The public-facing summary is on the Verified page; this document is the fuller policy.",
    },
    refundPolicy: {
      title: "Refund Policy",
      intro:
        "This page covers refunds for paid listings: when a refund is available, when it is not, how cancellations affect current billing periods, and the process for requesting a refund through Stripe. Purchases made on creators' own platforms are not covered by this site's refund policy. Those transactions are between buyer and creator.",
    },
    contentRemoval: {
      title: "Content Removal",
      intro:
        "This page explains how to request removal or correction of content, such as a wrong description, an image used without permission, incorrect claims about a person or business, or content that breaks the Human-Made standards. Every profile page also has a Report a problem button that lands directly in our inbox.",
    },
    copyrightComplaint: {
      title: "Copyright Complaint",
      intro:
        "This page describes how to file a copyright complaint about material shown on a profile, including what information we need (the work in question, proof of ownership, the URL, contact details, a statement made in good faith), how quickly we act on complete requests, how the counter-notice process works, and how to reach us.",
    },
  },

  status: {
    thankYou: {
      title: "Thank you",
      description:
        "We got your message and will read it by hand. You will hear back within a few working days.",
      primary: "Back to home",
      secondary: "Browse the catalog",
    },
    paymentSuccess: {
      title: "Payment successful",
      description:
        "Thank you, your payment went through. We'll review your profile by hand and publish it shortly. A receipt from Stripe is on its way to your email.",
      primary: "Back to home",
      secondary: "Browse the catalog",
    },
    paymentCancelled: {
      title: "Payment cancelled",
      description:
        "You cancelled the payment before it completed, so no charge was made. You can start again from the Add profile page whenever you're ready.",
      primary: "Back to Add profile",
      secondary: "See pricing",
    },
    profileSubmitted: {
      title: "Profile submitted",
      description:
        "We got your submission and are reviewing it by hand. Most profiles go live within a few working days. If you asked for verification, we may take a little longer to look at the materials.",
      primary: "Back to home",
      secondary: "Browse the catalog",
    },
    profileSuspended: {
      title: "Profile suspended",
      description:
        "This profile is temporarily hidden from the catalog while we review a report or a billing issue. If this is your profile, please get in touch. We handle every case by hand.",
      primary: "Contact us",
      secondary: "Browse other profiles",
    },
    profileNotAvailable: {
      title: "Profile not available",
      description:
        "This profile is no longer in the catalog. The creator may have taken it down, or the plan lapsed. The rest of the directory is still here.",
      primary: "Browse the catalog",
      secondary: "Back to home",
    },
    newMember: {
      title: "A new member's profile will be here",
      description:
        "This spot is for a creator who works without generative AI. Create a profile and be the first to take it.",
      primary: "Create a profile",
      secondary: "Back to home",
    },
  },

  meta: {
    directions: {
      title: "Directions",
      description:
        "Browse the major directions of No AI Directory: art, writing, design, photography, and the people and studios who create without AI.",
    },
    categories: {
      title: "All categories",
      description:
        "Every category on No AI Directory, grouped by direction. Find human-made creators by exactly what they do.",
    },
  },
};
