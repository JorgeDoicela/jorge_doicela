export type DiffType = 'EQUAL' | 'REMOVED' | 'ADDED';

export interface DiffToken {
  type: DiffType;
  value: string;
}

export interface DiffResult {
  tokensA: DiffToken[];
  tokensB: DiffToken[];
  inlineTokens: DiffToken[];
  similarityPercentage: number;
  wordCountA: number;
  wordCountB: number;
  differencesCount: number;
}

export type TranslationPhilosophy =
  | 'Formal' // Equivalencia Formal (Palabra por palabra)
  | 'Dinámica' // Equivalencia Dinámica (Pensamiento por pensamiento)
  | 'Crítica' // Crítica Textual / Manuscritos
  | 'Histórica'; // Texto Histórico / Original

export interface TranslationApproachInfo {
  philosophy: TranslationPhilosophy;
  description: string;
  badgeColor: string;
}

export interface VerseComparisonData {
  bookName: string;
  chapter: number;
  verseNumber: number;
  translationA: {
    id: number;
    abbreviation: string;
    name: string;
    text: string;
  };
  translationB: {
    id: number;
    abbreviation: string;
    name: string;
    text: string;
  };
}
