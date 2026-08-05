/**
 * Shape of the UI dictionary. Every visible interface string lives here,
 * grouped by area. Data-driven text (directions, categories, profiles)
 * is translated separately in the data layer, keyed by slug.
 *
 * Each language file implements this exact shape, so the type checker
 * guarantees no string is forgotten when a language is added.
 */

import type { DirectionColor } from "@/lib/types";

export interface FaqEntry {
  q: string;
  a: string;
}

export interface ParticipantPage {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  /** Two or three paragraphs of substance: who this is, when to choose
   *  them, what to check. */
  body: string[];
  whenTitle: string;
  when: string[];
  emptyTitle: string;
  emptyMessage: string;
  ctaTitle: string;
  ctaText: string;
  ctaBrowse: string;
  ctaJoin: string;
}

export interface GlossaryTerm {
  /** The term itself, as people say it. */
  term: string;
  /** Short form, plural or English original, when there is one. */
  aka?: string;
  /** Two or three sentences. The first one is the definition, complete on
   *  its own, because that is the sentence that gets quoted. */
  definition: string;
  /** Where the full explanation lives, when there is one. */
  href?: string;
  hrefLabel?: string;
}

export interface Dictionary {
  /** Brand-level strings. Name stays the same in every language. */
  site: {
    name: string;
    tagline: string;
    taglineSub: string;
    slogan: string;
    description: string;
    /** Footer copyright line suffix, after "© YEAR Name." */
    footerNote: string;
    /** Fine print under the copyright: the legal entity behind the brand
     *  and who does the reviewing. Small on purpose; the brand leads. */
    ownerNote: string;
  };

  /** Primary navigation labels, keyed by canonical path. */
  nav: {
    directory: string;
    categories: string;
    verified: string;
    pricing: string;
    about: string;
    join: string;
  };

  /** Footer group titles and any footer-only labels. */
  footer: {
    explore: string;
    knowledge: string;
    glossary: string;
    creators: string;
    teams: string;
    companies: string;
    forCreators: string;
    project: string;
    legal: string;
    ourApproach: string;
    // link labels
    directory: string;
    allCategories: string;
    directions: string;
    verifiedProfiles: string;
    addYourProfile: string;
    pricing: string;
    humanMadeStandards: string;
    verification: string;
    method: string;
    workStages: string;
    howToVerify: string;
    originCheck: string;
    principles: string;
    faq: string;
    whyUs: string;
    about: string;
    contact: string;
    privacy: string;
    cookiePolicy: string;
    terms: string;
    listingPolicy: string;
    verificationPolicy: string;
    refundPolicy: string;
    contentRemoval: string;
    copyrightComplaint: string;
  };

  /** Header. */
  header: {
    addProfile: string;
    openMenu: string;
    closeMenu: string;
    searchPlaceholder: string;
    searchAria: string;
    search: string;
    language: string;
    addProfileFree: string;
  };

  /** Shared button / label strings used across pages. */
  common: {
    home: string;
    browseCatalog: string;
    addProfile: string;
    seeAll: string;
    viewDirection: string;
    allDirections: string;
    profile: string;
    profiles: string;
    category: string;
    categories: string;
    /** Plural forms for "N categories": [one, few, many]. English uses the
     *  first two only; Russian needs all three (категория/категории/категорий). */
    categoryForms: [string, string, string];
    /** Heading of the cross-link block at the foot of listing and
     *  profession pages. */
    relatedTitle: string;
    /** Byline shown next to the review date. Names the editorial team
     *  rather than a person: the authority here is the stated procedure,
     *  not a biography. */
    editorialBy: string;
    /** Label before the review date on explanatory pages. */
    updatedLabel: string;
    reviewedByHand: string;
    leadersPickedByHand: string;
    humanMadeWork: string;
    /** Card badge: participant type. {n} = number of people in the team. */
    badgeTeam: string;
    badgeTeamWithSize: string;
    /** Line on a creator card telling which team they are part of. */
    cardTeamLine: string; // uses {team}
    /** Plural forms for "N people": [one, few, many]. English uses the
     *  first two only; Russian needs all three (человек/человека/человек). */
    peopleForms: [string, string, string];
    badgeCompany: string;
    /** Placeholder profile marker: short on the card, full on the page. */
    badgeDemo: string;
    demoNoticeTitle: string;
    demoNoticeText: string;
    /** Card line listing what this participant actually does. */
    /** Verb before the "what they do" line on a card. One flat "Does:" for
     *  everyone reads flat; a card is the author's face in the catalog and
     *  should carry some pride, so the verb fits the trade — an architect
     *  designs, a writer writes, a sculptor sculpts. Keyed by direction,
     *  with a per-trade override for the handful the direction verb misses
     *  (a code auditor reviews, they do not develop). */
    cardVerb: Record<string, string>;
    cardVerbTrade: Record<string, string>;
    backToHome: string;
    contactUs: string;
  };

  /** Language switcher. */
  languageSwitcher: {
    label: string;
  };

  home: {
    /** New hero (approved). */
    statsVisitsLabel: string;
    /** Nine trades shown three by three under the stats band, each in the
     *  colour of the catalog direction it belongs to. Every tile is a link:
     *  href points either at the direction that holds the trade or, for a
     *  trade that is a single category, straight at that category. */
    audienceTrades: { label: string; color: DirectionColor; href: string }[];
    /** Last tile of the trades grid: "All 37" with the figure counted from
     *  the catalog, so it stays true when a profession is added. */
    audienceAllPrefix: string;
    steps: { title: string; text: string }[];
    heroAdvantagesTitle: string;
    heroAdvantages: string[];
    heroClientsTitle: string;
    /** A point in the clients list. A plain string is one line; the object
     *  form adds a quieter second line under it, for a point that needs a
     *  word of explanation without earning a bullet of its own. */
    heroClients: (string | { text: string; sub: string })[];
    heroCreatorsTitle: string;
    heroCreators: (string | { text: string; sub: string })[];
    heroJoinButton: string;
    /** The project's call, under the join button. */
    heroSlogan: string;
    /** Title above the "new members" marquee. */
    newMembersTitle: string;
    newMembersNamePlaceholder: string;
    newWorksTitle: string;
    heroStatement: string;
    heroFindButton: string;
    heroActions: { hint: string; label: string; href: string }[];
    heroSearchPlaceholder: string;
    heroSearchAria: string;
    findAuthor: string;
    findAuthorHint: string;
    browseCatalog: string;
    addProfile: string;
    exploreDirections: string;
    exploreDirectionsSub: string;
    popularCategories: string;
    popularCategoriesSub: string;
    howItWorks: string;
    howItWorksSub: string;
    howSteps: { q: string; a: string }[];
    howReport: string;
    howItWorksCards: { t: string; d: string }[];
    featuredCreators: string;
    featuredCreatorsSub: string;
    forBuyers: string;
    forBuyersText: string;
    forBuyersPoints: string[];
    forCreators: string;
    forCreatorsText: string;
    forCreatorsPoints: string[];
    newProfiles: string;
    newProfilesSub: string;
    verificationTitle: string;
    verificationText: string;
    seeVerified: string;
    standardsLink: string;
    faqTitle: string;
    faq: FaqEntry[];
    closingTitle: string;
    closingText: string;
    closingCta: string;
  };

  pricing: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    /** Free-places banner. {n} = places, {date} = the shared end date. */
    freeBannerTitle: string;
    freeBannerText: string;
    /** Monthly / yearly switch. */
    perMonth: string;
    perYear: string;
    billedMonthly: string;
    billedYearly: string;
    saveLabel: string; // "Save {n}"
    /** Word in front of the price that starts once the free places end. */
    laterPrefix: string;
    includedTitle: string;
    /** Word in front of the price on the folded strip: "Сейчас $0". */
    nowWord: string;
    /** One block per participant type. */
    planNames: { creator: string; team: string; company: string };
    /** Each of the three plates at the top of the pricing page is a title
     *  the visitor sees folded and a body they open. The third plate's body
     *  is split in two so the platform name between them can be set in the
     *  brand face, the way it is written everywhere else on the site. */
    introTitle: string;
    introBody: string;
    headlineTitle: string;
    headlineBodyLead: string;
    headlineBodyTail: string;
    /** Heading over the three plan cards. */
    chooseTitle: string;
    /** "or" between the monthly and the yearly price in one line. */
    orWord: string;
    planFor: { creator: string; team: string; company: string };
    /** One selling line under the plan name: what this plan gets you,
     *  rather than what it contains. Empty for a plan that has none. */
    planPitch: { creator: string; team: string; company: string };
    planFeatures: { creator: string[]; team: string[]; company: string[] };
    freeNowLabel: string;
    /** "экономия 32%" and "экономия $120". Which of the two a card shows is
     *  decided by the size of the saving, not by the plan. */
    savePercent: string;
    saveAmount: string; // shown in place of the price while free
    everythingTitle: string;
    everythingItems: string[];
    howPaymentTitle: string;
    howPaymentText1: string;
    howPaymentText2: string;
    readyTitle: string;
    readyText: string;
    addProfile: string;
    readStandards: string;
    claimFree: string;
    getStarted: string;
  };

  /** The three pages a plan button leads to: one per participant type, with
   *  a thank-you, the four steps and that type's form and nothing else. The
   *  general /join page keeps the "who are you" question for people arriving
   *  from the home page. */
  joinType: {
    thanksLead: string;
    /** The one line under the form: what listing costs right now. */
    afterForm: string;
    /** Shown on /profile-submitted, chosen by the ?type= in the address the
     *  Tally form redirects to. Falls back to the general text. */
    submitted: { creator: string; team: string; company: string };
    creator: { metaTitle: string; metaDescription: string; title: string; thanksText: string };
    team: { metaTitle: string; metaDescription: string; title: string; thanksText: string };
    company: { metaTitle: string; metaDescription: string; title: string; thanksText: string };
  };
  join: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    seePricing: string;
    plansTitle: string;
    fullComparisonLink: string;
    howTitle: string;
    steps: { t: string; d: string }[];
    formTitle: string;
    formIntro: string;
    /** "Who are you" picker shown before the form. */
    pickTitle: string;
    pickIntro: string;
    pickOptions: {
      creator: { title: string; text: string; points: string[] };
      team: { title: string; text: string; points: string[] };
      company: { title: string; text: string; points: string[] };
    };
    pickCta: string;
    pickChange: string;
    pickChosen: string;
    rulesTitle: string;
    rulesText1: string;
    rulesLink1: string;
    rulesText2: string;
    rulesLink2: string;
    rulesText3: string;
    faqTitle: string;
    faq: FaqEntry[];
  };

  about: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    whatTitle: string;
    whatText: string;
    whyTitle: string;
    whyText: string;
    howTitle: string;
    howText: string;
    notClaimTitle: string;
    notClaimText1: string;
    standardsLink: string;
    notClaimText2: string;
    verificationLink: string;
    notClaimText3: string;
    browseCatalog: string;
    addProfile: string;
  };

  contact: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    emailLabel: string;
    whatTitle: string;
    addingTitle: string;
    addingText1: string;
    addingLink: string;
    addingText2: string;
    correctionsTitle: string;
    correctionsText: string;
    reportingTitle: string;
    reportingText: string;
    pressTitle: string;
    pressText: string;
    legalTitle: string;
    legalText1: string;
    legalLink: string;
    legalText2: string;
    footNote: string;
  };

  directory: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    searchPlaceholder: string;
    searchAria: string;
    filters: string;
    filtersTitle: string;
    direction: string;
    allDirections: string;
    category: string;
    allCategories: string;
    country: string;
    anyCountry: string;
    verification: string;
    any: string;
    verifiedOnly: string;
    sortBy: string;
    newestFirst: string;
    featuredFirst: string;
    aToZ: string;
    clearAll: string;
    clearAllFilters: string;
    show: string;
    forQuery: string;
    sortLabelFeatured: string;
    sortLabelAz: string;
    noMatchesFor: string;
    noMatchesFilters: string;
    noMatchesHint: string;
    removePrefix: string;
  };

  verified: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    banner: string;
    howTitle: string;
    howCards: { t: string; d: string }[];
    twoBadges: string;
    countSuffixOne: string;
    countSuffixMany: string;
    emptyTitle: string;
    emptyMessage: string;
  };

  categoriesPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    viewDirection: string;
  };

  directionsPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    /** Heading shown when the list is filtered by participant type. */
    byType: { creator: string; team: string; company: string };
    byTypeIntro: { creator: string; team: string; company: string };
  };

  categoryDetail: {
    featuredIn: string; // "Featured in {name}"
    leadersPickedByHand: string;
    allProfiles: string;
    emptyTitlePrefix: string; // "No {name} yet"
    emptyMessage: string;
  };

  directionDetail: {
    categories: string;
    featuredIn: string; // "Featured in {name}"
    leadersPickedByHand: string;
  };

  standards: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    oneLineTitle: string;
    oneLineText: string;
    belongsTitle: string;
    belongsItems: string[];
    hybridTitle: string;
    hybridText1: string;
    hybridStrong: string;
    hybridText2: string;
    notBelongTitle: string;
    notBelongItems: string[];
    /** Closing block. The page is a definition and stops being one the
     *  moment it starts re-explaining verification, so what used to be two
     *  full sections here is now two lines pointing at the pages that own
     *  those subjects. */
    nextTitle: string;
    nextMethodText: string;
    nextMethodLink: string;
    nextReportText: string;
    nextReportLink: string;
  };

  /** Standalone Questions & Answers page. Each entry is a real search
   *  intent; the answer builds topical authority and points both
   *  audiences toward the catalog or toward creating a profile. */
  faqPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    groups: { title: string; items: FaqEntry[] }[];
    byProfessionTitle: string;
    byProfessionIntro: string;
    ctaTitle: string;
    ctaText: string;
    ctaFind: string;
    ctaJoin: string;
    /** Labels tying a profession page to its catalog category and back.
     *  The two pages answer different needs — one explains, one lists —
     *  so each has to be able to send the reader to the other. */
    professionAllQuestions: string;
    professionSeeCatalog: string;
    professionBackToFaq: string;
    professionOnCategory: string;
  };

  /** The three participant pages: creators, teams, companies. One page
   *  per kind, because "find an illustrator", "find a team for a project"
   *  and "find a studio for a large job" are three different questions
   *  and a single catalog with a filter answers none of them by name. */
  participants: {
    creators: ParticipantPage;
    teams: ParticipantPage;
    companies: ParticipantPage;
  };

  /** Glossary. People ask an answer engine what "human-made" means and
   *  what counts as using AI long before they ask where to hire anyone.
   *  Short definitions answer that better than an essay, and this is
   *  where our own named scale belongs, so quoting the definition means
   *  naming its source. */
  glossary: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    groups: { title: string; terms: GlossaryTerm[] }[];
    ctaTitle: string;
    ctaText: string;
    ctaKnowledge: string;
    ctaBrowse: string;
  };

  /** Knowledge base: the hub that gathers every explanatory page on the
   *  site. The catalog answers "who does this work"; this section answers
   *  "what counts as work without AI, and how do I tell". Both are needed
   *  before a search or answer engine treats the site as a source rather
   *  than a listing. */
  /** Standalone checklist page: how a client checks that a piece was not
   *  generated. The one page here written for somebody who is not a
   *  member and may never become one, which is exactly why it travels. */
  howToVerify: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    subtitle: string;
    whyTitle: string;
    whyParagraphs: string[];
    caveatTitle: string;
    caveatText: string;
    questionsTitle: string;
    questionsIntro: string[];
    goodLabel: string;
    badLabel: string;
    levelLabel: string;
    questions: { q: string; good: string; bad: string; level: string }[];
    decisionTitle: string;
    decisionParagraphs: string[];
    tracesTitle: string;
    tracesParagraphs: string[];
    professionsTitle: string;
    professionsIntro: string;
  };

  knowledge: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    docsTitle: string;
    docsIntro: string;
    docs: { title: string; text: string; href: string }[];
    professionsTitle: string;
    professionsIntro: string;
    ctaTitle: string;
    ctaText: string;
    ctaFind: string;
    ctaJoin: string;
  };

  /** "Work stages" — the proof page. Written as an instruction rather than
   *  an explanation: what to attach, what counts, what to do when the work
   *  is under an agreement, answered question by question.
   *
   *  Paragraphs and answers may carry [[key]] tokens, replaced by links at
   *  render time (see LINKS in the page). Keeping the destinations out of
   *  the text means one place to change when a route moves. */
  workStages: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    subtitle: string;
    intro: string;
    sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
    ctaTitle: string;
    ctaText: string;
    ctaFind: string;
    ctaJoin: string;
  };

  method: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
    ctaTitle: string;
    ctaText: string;
    ctaFind: string;
    ctaJoin: string;
  };

  /** "Why us" — the authority/positioning page (the "expertise" idea,
   *  named the way users expect). */
  whyUs: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
    ctaTitle: string;
    ctaText: string;
    ctaFind: string;
    ctaJoin: string;
  };

  profile: {
    /** Warm introduction at the top of a profile, written by the platform.
     *  Three short lines: an opening phrase with the author's name, trade
     *  and city; what they actually do; and one line on the work being made
     *  by hand, worded per direction so it does not wear out across pages.
     *
     *  Assembled from the profile's own fields, so every author gets one
     *  with no manual step. A profile can override the whole thing with its
     *  own `introduction` field when the assembled version reads badly. */
    intro: {
      /** Opening phrases, chosen by the author's own id so the page reads
       *  the same on every visit rather than shuffling on reload. */
      openers: string[];
      /** Used only for profiles added within the last two months, then it
       *  gives way to the others on its own. */
      openerNew: string;
      /** Warm adjectives about how a person works, not about how good they
       *  are: praise repeated on every page stops meaning anything, while
       *  "works by hand" stays true on the hundredth profile. */
      adjectives: string[];
      /** The made-by-hand line, one per direction slug. */
      byHand: Record<string, string>;
      /** Overrides byHand for the trades where the direction's line lands
       *  wrong: a sculptor does not work with a brush, a code auditor does
       *  not write the code they read. Keyed by category slug; a trade
       *  absent here falls back to its direction. */
      byHandTrade: Record<string, string>;
      /** Closing line, pointing at the author's own sites. Shown only when
       *  the profile actually carries external links, so the invitation is
       *  never empty. */
      more: string;
    };
    services: string;
    products: string;
    portfolio: string;
    portfolioHint: string;
    portfolioMore: string;
    stagesTitle: string;
    stagesHint: string;
    /** The word "Stage", for numbering pictures in alt text. */
    stageLabel: string;
    video: string;
    watchExternal: string;
    workingProcess: string;
    workingProcessHintStudio: string;
    workingProcessHintCreator: string;
    onAiTitle: string;
    reviewedByHand: string;
    howVerificationWorks: string;
    moreInPrefix: string; // "More in {category}"
    moreInFallback: string;
    seeAll: string;
    visit: string;
    visitPortfolio: string;
    visitWebsite: string;
    whereToFind: string; // "Where to find {name}"
    whereToFindThem: string;
    languages: string;
    purchaseNote: string;
    processStep1: string; // uses {kind}
    processStep2: string;
    processStep3Company: string;
    processStep3Creator: string;
    processStep4: string; // uses {kind}
    /** Team roster block on a team profile. */
    membersTitle: string;
    membersHint: string;
    contactPerson: string;
    /** Prefix before a company's starting year: "На рынке с 2014". */
    inBusinessSince: string;
    /** Line on a member's own profile pointing back at the team. */
    memberOfTeam: string; // uses {team}
    kindStudio: string;
    kindTeam: string;
    kindCreator: string;
    linkWebsite: string;
    linkPortfolio: string;
    linkEtsy: string;
    linkAmazon: string;
    linkBehance: string;
    linkDribbble: string;
    linkLinkedin: string;
    linkInstagram: string;
    linkYoutube: string;
  };

  badges: {
    verifiedCreator: string;
    verifiedBusiness: string;
    verifiedTitle: string;
    featured: string;
  };

  report: {
    prompt: string;
    reportProblem: string;
    sentThanks: string;
    title: string;
    subtitle: string;
    reason: string;
    reasonMisuse: string;
    reasonWrongInfo: string;
    reasonImpersonation: string;
    reasonBrokenLinks: string;
    reasonCopyright: string;
    reasonOther: string;
    details: string;
    detailsPlaceholder: string;
    sendReport: string;
    cancel: string;
    footNote: string;
  };

  tally: {
    notice1: string;
    notice2a: string;
    getInTouch: string;
    notice2b: string;
    iframeTitle: string;
  };

  states: {
    emptyTitle: string;
    emptyMessage: string;
    errorTitle: string;
    errorMessage: string;
    backToDirectory: string;
    /** The empty-category card: a real listing card with the spot free.
     *  slotTitle takes the category name via {name}. */
    slotYourWork: string;
    slotTitle: string;
    slotMessage: string;
    slotBeFirst: string;
    slotName: string;
    slotRole: string;
    slotTagCountry: string;
    slotTagDirection: string;
    slotTagWork: string;
    slotAction: string;
    slotNote: string;
  };

  notFound: {
    title: string;
    text: string;
    goHome: string;
    browseDirectory: string;
  };

  /** Reviews page and the form on it. */
  reviews: {
    title: string;
    subtitle: string;
    /** "{n}" is replaced with the number of approved reviews. */
    basedOn: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    ratingLabel: string;
    textLabel: string;
    textPlaceholder: string;
    submit: string;
    sending: string;
    moderationNote: string;
    thanksTitle: string;
    thanksText: string;
    errName: string;
    errRating: string;
    errText: string;
    errRate: string;
    errServer: string;
  };

  stub: {
    ownerNote: string;
  };

  legal: {
    privacy: { title: string; intro: string };
    cookiePolicy: { title: string; intro: string };
    terms: { title: string; intro: string };
    listingPolicy: { title: string; intro: string };
    verificationPolicy: { title: string; intro: string };
    refundPolicy: { title: string; intro: string };
    contentRemoval: { title: string; intro: string };
    copyrightComplaint: { title: string; intro: string };
  };

  status: {
    thankYou: { title: string; description: string; primary: string; secondary: string };
    paymentSuccess: { title: string; description: string; primary: string; secondary: string };
    paymentCancelled: { title: string; description: string; primary: string; secondary: string };
    profileSubmitted: { title: string; description: string; primary: string; secondary: string };
    profileSuspended: { title: string; description: string; primary: string; secondary: string };
    profileNotAvailable: { title: string; description: string; primary: string; secondary: string };
    newMember: { title: string; description: string; primary: string; secondary: string };
    confirmOk: { title: string; description: string; primary: string; secondary: string };
    confirmFail: { title: string; description: string; primary: string; secondary: string };
  };

  /** Meta titles/descriptions for pages that set their own. */
  meta: {
    directions: { title: string; description: string };
    categories: { title: string; description: string };
  };
}
