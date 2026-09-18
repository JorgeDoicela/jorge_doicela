export interface GlossaryTerm {
  id: number;
  slug: string;
  term: string;
  aliases?: string | null;
  category: string;
  shortDefinition: string;
  keyDifference?: string | null;
  caseSensitive: boolean;
  language: string;
  orderPriority: number;
}
