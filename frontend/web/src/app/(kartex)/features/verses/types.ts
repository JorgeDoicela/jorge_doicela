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

export interface Pericope {
  id: number;
  chapter: number;
  startVerse: number;
  endVerse?: number;
  title: string;
  titleEn?: string;
  orderIndex?: number;
  book?: BookInfo | { id: number };
}

export type ReaderLayoutMode = 'continuous' | 'verse-by-verse';
export type ReaderFontSize = 'sm' | 'md' | 'lg' | 'xl';
import type { ReaderFontFamily } from './config/readerFonts';
export type { ReaderFontFamily };

export interface ReaderSettings {
  layoutMode: ReaderLayoutMode;
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  showVerseNumbers: boolean;
  showPericopes: boolean;
  focusMode: boolean;
}

export type VerseHighlightColor = 'yellow' | 'green' | 'blue' | 'purple' | 'orange';

export interface VerseHighlight {
  bookId: number;
  chapter: number;
  verseNumber: number;
  color: VerseHighlightColor;
}
