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
