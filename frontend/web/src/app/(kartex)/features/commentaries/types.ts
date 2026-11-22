export type CommentaryEntryType = 'book_intro' | 'chapter_intro' | 'passage';
export type CommentarySearchScope = 'chapter' | 'all';

export interface CommentaryAuthor {
  id: string;
  name: string;
  author: string;
  era: string;
  theologicalFocus: string;
  biography: string;
  historicalWork: string;
  license: string;
  language: string;
  entriesCount?: number;
}

export interface CommentaryEntry {
  id: string;
  authorId: string;
  bookId: string;
  bookOrder?: number;
  entryType?: CommentaryEntryType;
  chapter: number;
  verseStart: number;
  verseEnd?: number | null;
  title: string;
  contentMarkdown: string;
  tags?: string[];
  language: string;
}

export interface CommentaryBookCoverage {
  bookId: string;
  bookOrder: number;
  entriesCount: number;
  chapters: number[];
}

export interface CommentaryFilterParams {
  bookId?: string;
  chapter?: number;
  verse?: number;
  authorId?: string;
  entryType?: CommentaryEntryType;
  q?: string;
  lang?: string;
  limit?: number;
  offset?: number;
}
