/**
 * Shape of the UI dictionary. Every visible interface string lives here,
 * grouped by area. Data-driven text (directions, categories, profiles)
 * is translated separately in the data layer, keyed by slug.
 *
 * Each language file implements this exact shape, so the type checker
 * guarantees no string is forgotten when a language is added.
 */

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
    reviewedByHand: string;
    leadersPickedByHand: string;
    humanMadeWork: string;
    backToHome: string;
    contactUs: string;
  };

  /** Language switcher. */
  languageSwitcher: {
    label: string;
  };

  home: {
    /** New hero (approved). */
    heroIntro: string;
    heroOptions: string[];
    heroAdvantagesTitle: string;
    heroAdvantages: string[];
    heroPrinciplesTitle: string;
    heroPrinciples: string[];
    heroNoAi: string[];
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
    planFree: string;
    planMonthly: string;
    planYearly: string;
    periodFree: string;
    periodMonthly: string;
    periodYearly: string;
    yearlyNote: string;
    featuresFree: string[];
    featuresMonthly: string[];
    featuresYearly: string[];
  };

  join: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    startNow: string;
    seePricing: string;
    whyTitle: string;
    whyPoints: string[];
    plansTitle: string;
    planFree: string;
    planMonthly: string;
    planYearly: string;
    periodFree: string;
    periodMonthly: string;
    periodYearly: string;
    yearlyNote: string;
    fullComparison1: string;
    fullComparisonLink: string;
    fullComparison2: string;
    howTitle: string;
    steps: { t: string; d: string }[];
    formTitle: string;
    formIntro: string;
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
  };

  notFound: {
    title: string;
    text: string;
    goHome: string;
    browseDirectory: string;
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
  };

  /** Meta titles/descriptions for pages that set their own. */
  meta: {
    directions: { title: string; description: string };
    categories: { title: string; description: string };
  };
}
