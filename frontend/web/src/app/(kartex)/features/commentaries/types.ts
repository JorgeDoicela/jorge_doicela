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
}

export interface CommentaryEntry {
  id: string;
  authorId: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number | null;
  title: string;
  contentMarkdown: string;
  tags?: string[];
  language: string;
}

export interface CommentaryFilterParams {
  bookId?: string;
  chapter?: number;
  verse?: number;
  authorId?: string;
  q?: string;
  lang?: string;
}
