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
    abbreviations: ['JOB', 'SAL', 'PRO', 'ECL', 'CAN'],
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
    abbreviations: ['MAT', 'MAR', 'LUC', 'JUA', 'JN', 'HEC'],
  },
  {
    id: 'pauline_epistles',
    name: 'Epístolas Paulinas',
    testament: 'NT',
    bookIds: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    abbreviations: [
      'ROM', '1CO', '2CO', 'GAL', 'EFE', 'FIL', 'COL',
      '1TE', '2TE', '1TI', '2TI', 'TIT', 'FLM',
    ],
  },
  {
    id: 'general_epistles',
    name: 'Epístolas Generales',
    testament: 'NT',
    bookIds: [58, 59, 60, 61, 62, 63, 64, 65],
    abbreviations: ['HEB', 'STG', '1PE', '2PE', '1JU', '2JU', '3JU', 'JUD'],
  },
  {
    id: 'apocalypse',
    name: 'Profecía',
    testament: 'NT',
    bookIds: [66],
    abbreviations: ['APO'],
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

export function getChaptersForBookId(bookId?: number | null): number {
  if (!bookId) return 50;
  return CHAPTER_COUNTS_BY_BOOK_ID[bookId] || 50;
}
