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
    principles: string;
    faq: string;
    whyUs: string;
    about: string;
    contact: string;
    privacy: string;
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
    reviewedByHand: string;
    leadersPickedByHand: string;
    humanMadeWork: string;
    /** Card badge: participant type. {n} = number of people in the team. */
    badgeTeam: string;
    badgeTeamWithSize: string;
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
    heroClients: string[];
    heroCreatorsTitle: string;
    heroCreators: string[];
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
    intro: string;
    /** Free-places banner. {n} = places, {date} = the shared end date. */
    freeBannerTitle: string;
    freeBannerText: string;
    /** Monthly / yearly switch. */
    perMonth: string;
    perYear: string;
    billedMonthly: string;
    billedYearly: string;
    saveLabel: string; // "Save {n}"
    /** One block per participant type. */
    planNames: { creator: string; team: string; company: string };
    planFor: { creator: string; team: string; company: string };
    planFeatures: { creator: string[]; team: string[]; company: string[] };
    freeNowLabel: string; // shown in place of the price while free
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
    verificationBoxTitle: string;
    verificationBoxText1: string;
    verificationLink: string;
    verificationBoxText2: string;
    ifWrongTitle: string;
    ifWrongText1: string;
    listingPolicyLink: string;
    ifWrongText2: string;
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
  };

  /** "Our method" — absorbs the former Human-Made standards and
   *  Verification explanation into one authoritative page. */
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
  };

  /** Meta titles/descriptions for pages that set their own. */
  meta: {
    directions: { title: string; description: string };
    categories: { title: string; description: string };
  };
}
