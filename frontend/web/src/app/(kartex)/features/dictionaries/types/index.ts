export type DictionaryCategory =
  | 'all'
  | 'theology'
  | 'person'
  | 'place'
  | 'artifact'
  | 'custom'
  | 'flora_fauna';

export interface BiblicalReferenceItem {
  reference: string;
  context: string;
}

export interface BibleDictionary {
  id: string;
  slug: string;
  language: string;
  title: string;
  author: string;
  era: string;
  year: number;
  entriesCount: number;
  theologicalFocus: string;
  description: string;
  license: string;
}

export interface BibleDictionaryEntry {
  id: string;
  language: string;
  dictionaryId: string;
  term: string;
  normalizedTerm: string;
  letter: string;
  category: DictionaryCategory;
  etymology?: string | null;
  definitionMarkdown: string;
  biblicalReferences?: BiblicalReferenceItem[];
  relatedTerms?: string[];
  createdAt?: string;
}

export interface LetterCount {
  letter: string;
  count: number;
}

export interface SearchEntriesResult {
  items: BibleDictionaryEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
