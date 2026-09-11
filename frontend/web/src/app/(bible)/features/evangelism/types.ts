export interface EvangelismStep {
  order: number;
  title: string;
  reference: string;
  verseText: string;
  exposition: string;
  reflectionQuestion?: string;
  actionCall?: string;
}

export interface EvangelismPathway {
  id: string;
  language: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  theologicalFocus?: string;
  steps: EvangelismStep[];
}

export interface KeyVerseItem {
  ref: string;
  text: string;
}

export interface EvangelismObjection {
  id: string;
  language: string;
  category: string;
  question: string;
  summary: string;
  biblicalAnswer: string;
  keyVerses: KeyVerseItem[];
  practicalAdvice: string;
}

export interface TractOutlinePoint {
  heading: string;
  passage: string;
  exposition: string;
  illustration?: string;
}

export interface EvangelismTract {
  id: string;
  language: string;
  slug: string;
  title: string;
  targetAudience?: string;
  summary: string;
  fullOutline: TractOutlinePoint[];
  prayerOfFaith: string;
  nextSteps: string[];
}

export type EvangelismSubSuite = 'pathways' | 'objections' | 'tracts';
