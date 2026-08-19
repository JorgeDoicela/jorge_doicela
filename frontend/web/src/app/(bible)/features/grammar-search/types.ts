export type BiblicalTestament = 'OT' | 'NT';
export type CanonicalGenre =
  | 'Pentateuco'
  | 'Históricos'
  | 'Poéticos'
  | 'Profetas Mayores'
  | 'Profetas Menores'
  | 'Evangelios'
  | 'Hechos'
  | 'Epístolas Paulinas'
  | 'Epístolas Generales'
  | 'Apocalipsis';

export interface CanonicalBookInfo {
  id: number;
  abbr: string;
  name: string;
  testament: BiblicalTestament;
  category: CanonicalGenre;
  bookNumber: number; // 1 to 66
  totalChapters: number;
  totalVersesApprox: number;
}

// 1. Tipos para Búsqueda Morfológica
export type LanguageFilter = 'all' | 'greek' | 'hebrew_aramaic';

export type PartOfSpeechFilter =
  | 'all'
  | 'Verbo'
  | 'Sustantivo'
  | 'Adjetivo'
  | 'Artículo'
  | 'Pronombre'
  | 'Preposición'
  | 'Conjunción'
  | 'Adverbio'
  | 'Partícula';

export type VerbalMoodFilter =
  | 'all'
  | 'Imperativo'
  | 'Indicativo'
  | 'Subjuntivo'
  | 'Optativo'
  | 'Infinitivo'
  | 'Participio';

export type VerbalTenseFilter =
  | 'all'
  | 'Presente'
  | 'Aoristo'
  | 'Futuro'
  | 'Imperfecto'
  | 'Perfecto'
  | 'Pluscuamperfecto'
  | 'Qal'
  | 'Nifal'
  | 'Piel'
  | 'Pual'
  | 'Hifil'
  | 'Hofal'
  | 'Hitpael';

export type VerbalVoiceFilter =
  | 'all'
  | 'Activa'
  | 'Media'
  | 'Pasiva'
  | 'Media/Pasiva';

export type GrammaticalCaseFilter =
  | 'all'
  | 'Nominativo'
  | 'Genitivo'
  | 'Dativo'
  | 'Acusativo'
  | 'Vocativo';

export type GrammaticalGenderFilter =
  | 'all'
  | 'Masculino'
  | 'Femenino'
  | 'Neutro'
  | 'Común';

export type GrammaticalNumberFilter =
  | 'all'
  | 'Singular'
  | 'Plural'
  | 'Dual';

export type GrammaticalPersonFilter =
  | 'all'
  | '1ª persona'
  | '2ª persona'
  | '3ª persona';

export type CanonScopeFilter =
  | 'all'
  | 'OT'
  | 'NT'
  | 'pentateuch'
  | 'history'
  | 'poetry'
  | 'prophets'
  | 'gospels'
  | 'pauline'
  | 'general_epistles'
  | 'revelation'
  | 'custom_books';

export interface MorphologyFilterState {
  language: LanguageFilter;
  partOfSpeech: PartOfSpeechFilter;
  mood: VerbalMoodFilter;
  tense: VerbalTenseFilter;
  voice: VerbalVoiceFilter;
  grammaticalCase: GrammaticalCaseFilter;
  gender: GrammaticalGenderFilter;
  number: GrammaticalNumberFilter;
  person: GrammaticalPersonFilter;
  scope: CanonScopeFilter;
  customBookAbbrs: string[];
  searchQuery: string; // Filtro de texto opcional en lema o glosa
}

export interface MorphologicalTokenResult {
  id: string;
  bookAbbr: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  wordOriginal: string;
  lemma: string;
  transliteration: string;
  gloss: string;
  strong: string;
  language: 'Griego' | 'Hebreo' | 'Arameo';
  partOfSpeech: string;
  mood?: string;
  tense?: string;
  voice?: string;
  grammaticalCase?: string;
  gender?: string;
  number?: string;
  person?: string;
  morphologyCode: string; // ej. V-PAM-2P, V-Qal-Perf-3ms
  parsingSummary: string; // ej. "Verbo Presente Activo Imperativo 2ª Plural"
  fullVerseContext: {
    originalText: string;
    spanishText: string;
  };
}

export interface ExegeticalPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  filter: Partial<MorphologyFilterState>;
}

// 2. Tipos para Análisis de Raíz/Lema y Scatter Plot
export interface LemmaVerseSample {
  reference: string;
  bookAbbr: string;
  chapter: number;
  verseNumber: number;
  wordInContext: string;
  gloss: string;
  spanishText: string;
}

export interface LemmaCanonicalData {
  id: string;
  lemma: string;
  originalScript: string;
  transliteration: string;
  ipa: string;
  strong: string;
  language: 'Griego' | 'Hebreo' | 'Arameo';
  partOfSpeech: string;
  primaryGloss: string;
  rootFamily?: string;
  totalOccurrences: number;
  otOccurrences: number;
  ntOccurrences: number;
  peakBook: {
    bookAbbr: string;
    bookName: string;
    count: number;
    percentage: number;
  };
  distributionByBook: Record<string, number>; // key: bookAbbr, value: count
  distributionByGenre: Record<CanonicalGenre, number>;
  sampleVerses: LemmaVerseSample[];
}

// 3. Tipos para Concordancia FTS5
export type ConcordanceOperator = 'AND' | 'OR' | 'NOT' | 'NEAR' | 'PHRASE' | 'WILDCARD';

export interface ConcordanceVerseResult {
  id: number;
  bookAbbr: string;
  bookName: string;
  testament: BiblicalTestament;
  category: CanonicalGenre;
  chapter: number;
  verseNumber: number;
  translationAbbr: string;
  translationName: string;
  text: string;
  matchedSpans: string[];
  relevanceScore: number;
}

export interface ConcordanceSearchStats {
  totalResults: number;
  executionTimeMs: number;
  parsedTokens: string[];
  operatorsUsed: string[];
  queriedTranslation: string;
}

export type GrammarSearchTab = 'morphology' | 'lemma_scatter' | 'concordance';
