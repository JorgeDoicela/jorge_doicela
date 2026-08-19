export interface BookInfo {
  id: number;
  name: string;
  abbreviation: string;
  testament: string;
}

export interface TranslationInfo {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
}

export interface Verse {
  id: number;
  book: string | BookInfo;
  translation?: TranslationInfo;
  chapter: number;
  verseNumber: number;
  text: string;
}

export type ReaderLayoutMode = 'continuous' | 'verse-by-verse';
export type ReaderFontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ReaderFontFamily = 'sans' | 'serif';

export interface ReaderSettings {
  layoutMode: ReaderLayoutMode;
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  showVerseNumbers: boolean;
}
