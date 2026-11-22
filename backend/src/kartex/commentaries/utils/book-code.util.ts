export interface CanonicalBookResolution {
  bookId: string;
  bookOrder: number;
}

interface BookAliasDefinition {
  order: number;
  canonicalAbbr: string;
  aliases: string[];
}

const CANONICAL_BOOK_DEFINITIONS: BookAliasDefinition[] = [
  { order: 1, canonicalAbbr: 'GEN', aliases: ['GEN', 'GN', 'GENESIS'] },
  { order: 2, canonicalAbbr: 'EXO', aliases: ['EXO', 'EX', 'EXODUS', 'EXODO'] },
  {
    order: 3,
    canonicalAbbr: 'LEV',
    aliases: ['LEV', 'LV', 'LEVITICUS', 'LEVITICO'],
  },
  {
    order: 4,
    canonicalAbbr: 'NUM',
    aliases: ['NUM', 'NM', 'NUMBERS', 'NUMEROS'],
  },
  {
    order: 5,
    canonicalAbbr: 'DEU',
    aliases: ['DEU', 'DT', 'DEUTERONOMY', 'DEUTERONOMIO'],
  },
  { order: 6, canonicalAbbr: 'JOS', aliases: ['JOS', 'JOSHUA', 'JOSUE'] },
  {
    order: 7,
    canonicalAbbr: 'JUE',
    aliases: ['JUE', 'JDG', 'JUDGES', 'JUECES'],
  },
  { order: 8, canonicalAbbr: 'RUT', aliases: ['RUT', 'RUTH'] },
  { order: 9, canonicalAbbr: '1SA', aliases: ['1SA', '1SAM', '1SAMUEL'] },
  { order: 10, canonicalAbbr: '2SA', aliases: ['2SA', '2SAM', '2SAMUEL'] },
  {
    order: 11,
    canonicalAbbr: '1RE',
    aliases: ['1RE', '1KI', '1KGS', '1KINGS', '1REYES'],
  },
  {
    order: 12,
    canonicalAbbr: '2RE',
    aliases: ['2RE', '2KI', '2KGS', '2KINGS', '2REYES'],
  },
  {
    order: 13,
    canonicalAbbr: '1CR',
    aliases: ['1CR', '1CH', '1CHR', '1CHRONICLES', '1CRONICAS'],
  },
  {
    order: 14,
    canonicalAbbr: '2CR',
    aliases: ['2CR', '2CH', '2CHR', '2CHRONICLES', '2CRONICAS'],
  },
  {
    order: 15,
    canonicalAbbr: 'ESD',
    aliases: ['ESD', 'EZR', 'EZRA', 'ESDRAS'],
  },
  { order: 16, canonicalAbbr: 'NEH', aliases: ['NEH', 'NEHEMIAH', 'NEHEMIAS'] },
  {
    order: 17,
    canonicalAbbr: 'EST',
    aliases: ['EST', 'ESTH', 'ESTHER', 'ESTER'],
  },
  { order: 18, canonicalAbbr: 'JOB', aliases: ['JOB', 'JB'] },
  {
    order: 19,
    canonicalAbbr: 'SAL',
    aliases: ['SAL', 'PSA', 'PS', 'PSALMS', 'SALMOS'],
  },
  {
    order: 20,
    canonicalAbbr: 'PRO',
    aliases: ['PRO', 'PRV', 'PROV', 'PROVERBS', 'PROVERBIOS'],
  },
  {
    order: 21,
    canonicalAbbr: 'ECL',
    aliases: ['ECL', 'ECC', 'QOH', 'ECCLESIASTES', 'ECLESIASTES'],
  },
  {
    order: 22,
    canonicalAbbr: 'CAN',
    aliases: ['CAN', 'SNG', 'SOL', 'SONG', 'CANTARES'],
  },
  {
    order: 23,
    canonicalAbbr: 'ISA',
    aliases: ['ISA', 'IS', 'ISAIAH', 'ISAIAS'],
  },
  {
    order: 24,
    canonicalAbbr: 'JER',
    aliases: ['JER', 'JR', 'JEREMIAH', 'JEREMIAS'],
  },
  {
    order: 25,
    canonicalAbbr: 'LAM',
    aliases: ['LAM', 'LM', 'LAMENTATIONS', 'LAMENTACIONES'],
  },
  {
    order: 26,
    canonicalAbbr: 'EZE',
    aliases: ['EZE', 'EZK', 'EZEKIEL', 'EZEQUIEL'],
  },
  { order: 27, canonicalAbbr: 'DAN', aliases: ['DAN', 'DN', 'DANIEL'] },
  {
    order: 28,
    canonicalAbbr: 'OSE',
    aliases: ['OSE', 'HOS', 'HOSEA', 'OSEAS'],
  },
  { order: 29, canonicalAbbr: 'JOE', aliases: ['JOE', 'JOL', 'JOEL'] },
  { order: 30, canonicalAbbr: 'AMO', aliases: ['AMO', 'AM', 'AMOS'] },
  {
    order: 31,
    canonicalAbbr: 'ABD',
    aliases: ['ABD', 'OBA', 'OBAD', 'OBADIAH', 'ABDIAS'],
  },
  {
    order: 32,
    canonicalAbbr: 'JON',
    aliases: ['JON', 'JNH', 'JONAH', 'JONAS'],
  },
  {
    order: 33,
    canonicalAbbr: 'MIQ',
    aliases: ['MIQ', 'MIC', 'MICAH', 'MIQUEAS'],
  },
  { order: 34, canonicalAbbr: 'NAH', aliases: ['NAH', 'NAM', 'NAHUM'] },
  {
    order: 35,
    canonicalAbbr: 'HAB',
    aliases: ['HAB', 'HB', 'HABAKKUK', 'HABACUC'],
  },
  {
    order: 36,
    canonicalAbbr: 'SOF',
    aliases: ['SOF', 'ZEP', 'ZEPH', 'ZEPHANIAH', 'SOFONIAS'],
  },
  {
    order: 37,
    canonicalAbbr: 'HAG',
    aliases: ['HAG', 'HG', 'HAGGAI', 'HAGEO'],
  },
  {
    order: 38,
    canonicalAbbr: 'ZAC',
    aliases: ['ZAC', 'ZEC', 'ZECH', 'ZECHARIAH', 'ZACARIAS'],
  },
  {
    order: 39,
    canonicalAbbr: 'MAL',
    aliases: ['MAL', 'ML', 'MALACHI', 'MALAQUIAS'],
  },
  {
    order: 40,
    canonicalAbbr: 'MAT',
    aliases: ['MAT', 'MT', 'MATT', 'MATTHEW', 'MATEO'],
  },
  {
    order: 41,
    canonicalAbbr: 'MAR',
    aliases: ['MAR', 'MRK', 'MK', 'MARK', 'MARCOS'],
  },
  {
    order: 42,
    canonicalAbbr: 'LUC',
    aliases: ['LUC', 'LUK', 'LK', 'LUKE', 'LUCAS'],
  },
  {
    order: 43,
    canonicalAbbr: 'JUA',
    aliases: ['JUA', 'JHN', 'JN', 'JOHN', 'JUAN'],
  },
  {
    order: 44,
    canonicalAbbr: 'HEC',
    aliases: ['HEC', 'ACT', 'AC', 'ACTS', 'HECHOS'],
  },
  {
    order: 45,
    canonicalAbbr: 'ROM',
    aliases: ['ROM', 'RM', 'ROMANS', 'ROMANOS'],
  },
  {
    order: 46,
    canonicalAbbr: '1CO',
    aliases: ['1CO', '1COR', '1CORINTHIANS', '1CORINTIOS'],
  },
  {
    order: 47,
    canonicalAbbr: '2CO',
    aliases: ['2CO', '2COR', '2CORINTHIANS', '2CORINTIOS'],
  },
  {
    order: 48,
    canonicalAbbr: 'GAL',
    aliases: ['GAL', 'GL', 'GALATIANS', 'GALATAS'],
  },
  {
    order: 49,
    canonicalAbbr: 'EFE',
    aliases: ['EFE', 'EPH', 'EPHESIANS', 'EFESIOS'],
  },
  {
    order: 50,
    canonicalAbbr: 'FIL',
    aliases: ['FIL', 'PHP', 'PHIL', 'PHILIPPIANS', 'FILIPENSES'],
  },
  {
    order: 51,
    canonicalAbbr: 'COL',
    aliases: ['COL', 'CL', 'COLOSSIANS', 'COLOSENSES'],
  },
  {
    order: 52,
    canonicalAbbr: '1TE',
    aliases: ['1TE', '1TH', '1THESS', '1THESSALONIANS', '1TESALONICENSES'],
  },
  {
    order: 53,
    canonicalAbbr: '2TE',
    aliases: ['2TE', '2TH', '2THESS', '2THESSALONIANS', '2TESALONICENSES'],
  },
  {
    order: 54,
    canonicalAbbr: '1TI',
    aliases: ['1TI', '1TIM', '1TIMOTHY', '1TIMOTEO'],
  },
  {
    order: 55,
    canonicalAbbr: '2TI',
    aliases: ['2TI', '2TIM', '2TIMOTHY', '2TIMOTEO'],
  },
  { order: 56, canonicalAbbr: 'TIT', aliases: ['TIT', 'TI', 'TITUS', 'TITO'] },
  {
    order: 57,
    canonicalAbbr: 'FLM',
    aliases: ['FLM', 'PHM', 'PHLM', 'PHILEMON', 'FILEMON'],
  },
  {
    order: 58,
    canonicalAbbr: 'HEB',
    aliases: ['HEB', 'HB', 'HEBREWS', 'HEBREOS'],
  },
  {
    order: 59,
    canonicalAbbr: 'STG',
    aliases: ['STG', 'JAS', 'JAM', 'JAMES', 'SANTIAGO'],
  },
  {
    order: 60,
    canonicalAbbr: '1PE',
    aliases: ['1PE', '1PT', '1PET', '1PETER', '1PEDRO'],
  },
  {
    order: 61,
    canonicalAbbr: '2PE',
    aliases: ['2PE', '2PT', '2PET', '2PETER', '2PEDRO'],
  },
  {
    order: 62,
    canonicalAbbr: '1JU',
    aliases: ['1JU', '1JN', '1JOHN', '1JUAN'],
  },
  {
    order: 63,
    canonicalAbbr: '2JU',
    aliases: ['2JU', '2JN', '2JOHN', '2JUAN'],
  },
  {
    order: 64,
    canonicalAbbr: '3JU',
    aliases: ['3JU', '3JN', '3JOHN', '3JUAN'],
  },
  { order: 65, canonicalAbbr: 'JUD', aliases: ['JUD', 'JUDE', 'JUDAS'] },
  {
    order: 66,
    canonicalAbbr: 'APO',
    aliases: ['APO', 'REV', 'RV', 'APOC', 'REVELATION', 'APOCALIPSIS'],
  },
];

const ALIAS_LOOKUP = new Map<string, CanonicalBookResolution>();
const ORDER_LOOKUP = new Map<number, CanonicalBookResolution>();

for (const def of CANONICAL_BOOK_DEFINITIONS) {
  const resolution: CanonicalBookResolution = {
    bookId: def.canonicalAbbr,
    bookOrder: def.order,
  };
  ORDER_LOOKUP.set(def.order, resolution);
  ALIAS_LOOKUP.set(String(def.order), resolution);
  for (const alias of def.aliases) {
    ALIAS_LOOKUP.set(alias.toUpperCase(), resolution);
  }
}

/**
 * Resuelve cualquier identificador de libro (abreviación española, código USFM inglés o ID 1-66)
 * al par canónico { bookId, bookOrder } utilizado en kartex.sqlite.
 */
export function resolveCanonicalBook(
  input: string | number | undefined | null,
): CanonicalBookResolution | null {
  if (input === undefined || input === null) return null;

  if (typeof input === 'number') {
    return ORDER_LOOKUP.get(input) || null;
  }

  const normalized = input
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

  if (!normalized) return null;

  return ALIAS_LOOKUP.get(normalized) || null;
}
