export interface ParallelColumn {
  id: string; // identificador único de la columna (ej. 'col-1')
  translationId: number;
}

export interface VerseTranslationData {
  verseId: number;
  text: string;
  bookName: string;
  bookAbbreviation: string;
  chapter: number;
  verseNumber: number;
  translationId: number;
  translationName: string;
  translationAbbreviation: string;
}

export interface ParallelVerseRow {
  verseNumber: number;
  translations: Record<number, VerseTranslationData | null>;
}
