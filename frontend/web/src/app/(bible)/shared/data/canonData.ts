export interface BookCategory {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  bookIds: number[];
  abbreviations: string[];
}

export const CANONICAL_CATEGORIES: BookCategory[] = [
  // Antiguo Testamento
  {
    id: 'pentateuch',
    name: 'Pentateuco / Torá',
    testament: 'OT',
    bookIds: [1, 2, 3, 4, 5],
    abbreviations: ['GEN', 'EXO', 'LEV', 'NUM', 'DEU'],
  },
  {
    id: 'historical_ot',
    name: 'Históricos',
    testament: 'OT',
    bookIds: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    abbreviations: [
      'JOS', 'JUE', 'RUT', '1SA', '2SA', '1RE', '2RE',
      '1CR', '2CR', 'ESD', 'NEH', 'EST',
    ],
  },
  {
    id: 'poetic',
    name: 'Poéticos y Sapienciales',
    testament: 'OT',
    bookIds: [18, 19, 20, 21, 22],
    abbreviations: ['JOB', 'SAL', 'PRO', 'ECL', 'CAN', 'CNT'],
  },
  {
    id: 'major_prophets',
    name: 'Profetas Mayores',
    testament: 'OT',
    bookIds: [23, 24, 25, 26, 27],
    abbreviations: ['ISA', 'JER', 'JEREMIAS', 'LAM', 'EZE', 'DAN'],
  },
  {
    id: 'minor_prophets',
    name: 'Profetas Menores',
    testament: 'OT',
    bookIds: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    abbreviations: [
      'OSE', 'JOE', 'AMO', 'ABD', 'JON', 'MIQ',
      'NAH', 'HAB', 'SOF', 'HAG', 'ZAC', 'MAL',
    ],
  },
  // Nuevo Testamento
  {
    id: 'gospels_history',
    name: 'Evangelios y Hechos',
    testament: 'NT',
    bookIds: [40, 41, 42, 43, 44],
    abbreviations: ['MAT', 'MAR', 'LUC', 'JUA', 'JN', 'HEC', 'HCH'],
  },
  {
    id: 'pauline_epistles',
    name: 'Epístolas Paulinas',
    testament: 'NT',
    bookIds: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    abbreviations: [
      'ROM', '1CO', '2CO', '1COR', '2COR', 'GAL', 'EFE', 'FIL', 'COL',
      '1TE', '2TE', '1TES', '2TES', '1TI', '2TI', '1TIM', '2TIM', 'TIT', 'FLM',
    ],
  },
  {
    id: 'general_epistles',
    name: 'Epístolas Generales',
    testament: 'NT',
    bookIds: [58, 59, 60, 61, 62, 63, 64, 65],
    abbreviations: ['HEB', 'STG', '1PE', '2PE', '1PED', '2PED', '1JU', '2JU', '3JU', '1JN', '2JN', '3JN', 'JUD'],
  },
  {
    id: 'apocalypse',
    name: 'Profecía',
    testament: 'NT',
    bookIds: [66],
    abbreviations: ['APO', 'REV'],
  },
];

export function isBookInCategory(
  category: BookCategory,
  book: { id: number; abbreviation: string },
): boolean {
  const upper = (book.abbreviation || '').toUpperCase();
  return (
    category.abbreviations.includes(upper) ||
    category.bookIds.includes(book.id)
  );
}

export const CHAPTER_COUNTS_BY_BOOK_ID: Record<number, number> = {
  1: 50, // Génesis
  2: 40, // Éxodo
  3: 27, // Levítico
  4: 36, // Números
  5: 34, // Deuteronomio
  6: 24, // Josué
  7: 21, // Jueces
  8: 4,  // Rut
  9: 31, // 1 Samuel
  10: 24, // 2 Samuel
  11: 22, // 1 Reyes
  12: 25, // 2 Reyes
  13: 29, // 1 Crónicas
  14: 36, // 2 Crónicas
  15: 10, // Esdras
  16: 13, // Nehemías
  17: 10, // Ester
  18: 42, // Job
  19: 150, // Salmos
  20: 31, // Proverbios
  21: 12, // Eclesiastés
  22: 8,  // Cantares
  23: 66, // Isaías
  24: 52, // Jeremías
  25: 5,  // Lamentaciones
  26: 48, // Ezequiel
  27: 12, // Daniel
  28: 14, // Oseas
  29: 3,  // Joel
  30: 9,  // Amós
  31: 1,  // Abdías
  32: 4,  // Jonás
  33: 7,  // Miqueas
  34: 3,  // Nahúm
  35: 3,  // Habacuc
  36: 3,  // Sofonías
  37: 2,  // Hageo
  38: 14, // Zacarías
  39: 4,  // Malaquías
  40: 28, // Mateo
  41: 16, // Marcos
  42: 24, // Lucas
  43: 21, // Juan
  44: 28, // Hechos
  45: 16, // Romanos
  46: 16, // 1 Corintios
  47: 13, // 2 Corintios
  48: 6,  // Gálatas
  49: 6,  // Efesios
  50: 4,  // Filipenses
  51: 4,  // Colosenses
  52: 5,  // 1 Tesalonicenses
  53: 3,  // 2 Tesalonicenses
  54: 6,  // 1 Timoteo
  55: 4,  // 2 Timoteo
  56: 3,  // Tito
  57: 1,  // Filemón
  58: 13, // Hebreos
  59: 5,  // Santiago
  60: 5,  // 1 Pedro
  61: 3,  // 2 Pedro
  62: 5,  // 1 Juan
  63: 1,  // 2 Juan
  64: 1,  // 3 Juan
  65: 1,  // Judas
  66: 22, // Apocalipsis
};

export const BOOK_CHAPTERS: Record<string, number> = {
  // Antiguo Testamento
  GEN: 50,
  EXO: 40,
  LEV: 27,
  NUM: 36,
  DEU: 34,
  JOS: 24,
  JUE: 21,
  RUT: 4,
  '1SAM': 31,
  '1SA': 31,
  '2SAM': 24,
  '2SA': 24,
  '1REY': 22,
  '1RE': 22,
  '2REY': 25,
  '2RE': 25,
  '1CRO': 29,
  '1CR': 29,
  '2CRO': 36,
  '2CR': 36,
  ESD: 10,
  NEH: 13,
  EST: 10,
  JOB: 42,
  SAL: 150,
  PRO: 31,
  ECL: 12,
  CNT: 8,
  CAN: 8,
  ISA: 66,
  JEREMIAS: 52,
  JER: 52,
  LAM: 5,
  EZE: 48,
  DAN: 12,
  OSE: 14,
  JOE: 3,
  AMO: 9,
  ABD: 1,
  JON: 4,
  MIQ: 7,
  NAH: 3,
  HAB: 3,
  SOF: 3,
  HAG: 2,
  ZAC: 14,
  MAL: 4,
  // Nuevo Testamento
  MAT: 28,
  MAR: 16,
  LUC: 24,
  JN: 21,
  JUA: 21,
  HCH: 28,
  HEC: 28,
  ROM: 16,
  '1COR': 16,
  '1CO': 16,
  '2COR': 13,
  '2CO': 13,
  GAL: 6,
  EFE: 6,
  FIL: 4,
  COL: 4,
  '1TES': 5,
  '1TE': 5,
  '2TES': 3,
  '2TE': 3,
  '1TIM': 6,
  '1TI': 6,
  '2TIM': 4,
  '2TI': 4,
  TIT: 3,
  FLM: 1,
  HEB: 13,
  STG: 5,
  '1PED': 5,
  '1PE': 5,
  '2PED': 3,
  '2PE': 3,
  '1JN': 5,
  '1JU': 5,
  '2JN': 1,
  '2JU': 1,
  '3JN': 1,
  '3JU': 1,
  JUD: 1,
  APO: 22,
};

export function getChaptersForBookId(bookId?: number | null): number {
  if (!bookId) return 50;
  return CHAPTER_COUNTS_BY_BOOK_ID[bookId] || 50;
}

export function getChapterCountForBook(abbreviation?: string): number {
  if (!abbreviation) return 50;
  const upper = abbreviation.toUpperCase();
  return BOOK_CHAPTERS[upper] || 50;
}
