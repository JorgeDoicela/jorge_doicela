import {
  MorphologicalTokenResult,
  ExegeticalPreset,
  LemmaCanonicalData,
  ConcordanceVerseResult,
} from '../types';

export const EXEGETICAL_PRESETS: ExegeticalPreset[] = [
  {
    id: 'preset-bara-elohim',
    title: 'Creación Ex-Nihilo (Bara Elohim)',
    description:
      'Filtro morfológico para identificar ocurrencias del lema H1254 en tronco verbal Qal.',
    badge: 'Teología de la Creación',
    filter: {
      language: 'hebrew_aramaic',
      partOfSpeech: 'Verbo',
      tense: 'Qal',
      searchQuery: 'bara',
    },
  },
  {
    id: 'preset-logos-incarnation',
    title: 'Cristología del Logos',
    description:
      'Filtro morfológico para identificar el lema G3056 en el corpus joánico.',
    badge: 'Cristología',
    filter: {
      language: 'greek',
      partOfSpeech: 'Sustantivo',
      searchQuery: 'logos',
    },
  },
  {
    id: 'preset-covenant-berit',
    title: 'Pacto Divino (Berit)',
    description:
      'Filtro para identificar el sustantivo H1285 a lo largo del canon bíblico.',
    badge: 'Teología del Pacto',
    filter: {
      language: 'hebrew_aramaic',
      partOfSpeech: 'Sustantivo',
      searchQuery: 'berit',
    },
  },
  {
    id: 'preset-agape-pauline',
    title: 'Amor Ágape Paulino',
    description:
      'Filtro para identificar el lema G26 en las epístolas paulinas.',
    badge: 'Ética y Teología Paulina',
    filter: {
      language: 'greek',
      searchQuery: 'agape',
    },
  },
];

export const LEMMA_CANONICAL_DATASET: LemmaCanonicalData[] = [];
export const CONCORDANCE_DATASET: ConcordanceVerseResult[] = [];
export const MORPHOLOGY_TOKENS: MorphologicalTokenResult[] = [];
