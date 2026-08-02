/**
 * Shape of the Origin Check copy, shared by both languages.
 *
 * Kept out of the main dictionary because it grows one direction at a
 * time and would otherwise bury the rest of the file. A profession page
 * exists only while there is a written guide behind it: a thin page that
 * promises content later costs more than no page at all.
 */

export interface OriginCheckAsk {
  /** What to ask for, phrased so it can be said out loud as written. */
  q: string;
  /** The answer that should reassure. */
  good: string;
  /** The answer that should give pause. */
  bad: string;
}

export interface OriginCheckProfession {
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** What a real piece of work in this trade leaves behind. */
  lead: string;
  signs: string[];
  ask: OriginCheckAsk[];
  warn: string[];
}

export interface OriginCheckCopy {
  metaTitle: string;
  metaDescription: string;
  title: string;
  tagline: string;
  definition: string;

  notDetectorTitle: string;
  notDetectorText: string;

  howTitle: string;
  howSteps: string[];

  chooseTitle: string;
  chooseIntro: string;
  chooseEmpty: string;

  professionLeadTitle: string;
  signsTitle: string;
  askTitle: string;
  warnTitle: string;
  goodLabel: string;
  badLabel: string;
  decisionTitle: string;
  decisionText: string;

  downloadLabel: string;
  copyLabel: string;
  copiedLabel: string;
  backLabel: string;

  /** Keyed by profession slug, matching the catalog's category slugs. */
  professions: Record<string, OriginCheckProfession>;
}
