import * as fs from 'fs';
import * as path from 'path';
import { resolveCanonicalBook } from '../commentaries/utils/book-code.util';
import { seedCorpus } from './seed-corpus';

interface CanonicalBookMeta {
  order: number;
  bookId: string;
  usfm: string;
  fileName: string;
  nameEs: string;
  nameEn: string;
  testament: 'OT' | 'NT';
}

const CANONICAL_BOOKS_META: CanonicalBookMeta[] = [
  {
    order: 1,
    bookId: 'GEN',
    usfm: 'GEN',
    fileName: '01_genesis.json',
    nameEs: 'Génesis',
    nameEn: 'Genesis',
    testament: 'OT',
  },
  {
    order: 2,
    bookId: 'EXO',
    usfm: 'EXO',
    fileName: '02_exodo.json',
    nameEs: 'Éxodo',
    nameEn: 'Exodus',
    testament: 'OT',
  },
  {
    order: 3,
    bookId: 'LEV',
    usfm: 'LEV',
    fileName: '03_levitico.json',
    nameEs: 'Levítico',
    nameEn: 'Leviticus',
    testament: 'OT',
  },
  {
    order: 4,
    bookId: 'NUM',
    usfm: 'NUM',
    fileName: '04_numeros.json',
    nameEs: 'Números',
    nameEn: 'Numbers',
    testament: 'OT',
  },
  {
    order: 5,
    bookId: 'DEU',
    usfm: 'DEU',
    fileName: '05_deuteronomio.json',
    nameEs: 'Deuteronomio',
    nameEn: 'Deuteronomy',
    testament: 'OT',
  },
  {
    order: 6,
    bookId: 'JOS',
    usfm: 'JOS',
    fileName: '06_josue.json',
    nameEs: 'Josué',
    nameEn: 'Joshua',
    testament: 'OT',
  },
  {
    order: 7,
    bookId: 'JUE',
    usfm: 'JDG',
    fileName: '07_jueces.json',
    nameEs: 'Jueces',
    nameEn: 'Judges',
    testament: 'OT',
  },
  {
    order: 8,
    bookId: 'RUT',
    usfm: 'RUT',
    fileName: '08_rut.json',
    nameEs: 'Rut',
    nameEn: 'Ruth',
    testament: 'OT',
  },
  {
    order: 9,
    bookId: '1SA',
    usfm: '1SA',
    fileName: '09_1_samuel.json',
    nameEs: '1 Samuel',
    nameEn: '1 Samuel',
    testament: 'OT',
  },
  {
    order: 10,
    bookId: '2SA',
    usfm: '2SA',
    fileName: '10_2_samuel.json',
    nameEs: '2 Samuel',
    nameEn: '2 Samuel',
    testament: 'OT',
  },
  {
    order: 11,
    bookId: '1RE',
    usfm: '1KI',
    fileName: '11_1_reyes.json',
    nameEs: '1 Reyes',
    nameEn: '1 Kings',
    testament: 'OT',
  },
  {
    order: 12,
    bookId: '2RE',
    usfm: '2KI',
    fileName: '12_2_reyes.json',
    nameEs: '2 Reyes',
    nameEn: '2 Kings',
    testament: 'OT',
  },
  {
    order: 13,
    bookId: '1CR',
    usfm: '1CH',
    fileName: '13_1_cronicas.json',
    nameEs: '1 Crónicas',
    nameEn: '1 Chronicles',
    testament: 'OT',
  },
  {
    order: 14,
    bookId: '2CR',
    usfm: '2CH',
    fileName: '14_2_cronicas.json',
    nameEs: '2 Crónicas',
    nameEn: '2 Chronicles',
    testament: 'OT',
  },
  {
    order: 15,
    bookId: 'ESD',
    usfm: 'EZR',
    fileName: '15_esdras.json',
    nameEs: 'Esdras',
    nameEn: 'Ezra',
    testament: 'OT',
  },
  {
    order: 16,
    bookId: 'NEH',
    usfm: 'NEH',
    fileName: '16_nehemias.json',
    nameEs: 'Nehemías',
    nameEn: 'Nehemiah',
    testament: 'OT',
  },
  {
    order: 17,
    bookId: 'EST',
    usfm: 'EST',
    fileName: '17_ester.json',
    nameEs: 'Ester',
    nameEn: 'Esther',
    testament: 'OT',
  },
  {
    order: 18,
    bookId: 'JOB',
    usfm: 'JOB',
    fileName: '18_job.json',
    nameEs: 'Job',
    nameEn: 'Job',
    testament: 'OT',
  },
  {
    order: 19,
    bookId: 'SAL',
    usfm: 'PSA',
    fileName: '19_salmos.json',
    nameEs: 'Salmos',
    nameEn: 'Psalms',
    testament: 'OT',
  },
  {
    order: 20,
    bookId: 'PRO',
    usfm: 'PRO',
    fileName: '20_proverbios.json',
    nameEs: 'Proverbios',
    nameEn: 'Proverbs',
    testament: 'OT',
  },
  {
    order: 21,
    bookId: 'ECL',
    usfm: 'ECC',
    fileName: '21_eclesiastes.json',
    nameEs: 'Eclesiastés',
    nameEn: 'Ecclesiastes',
    testament: 'OT',
  },
  {
    order: 22,
    bookId: 'CAN',
    usfm: 'SNG',
    fileName: '22_cantares.json',
    nameEs: 'Cantares',
    nameEn: 'Song of Solomon',
    testament: 'OT',
  },
  {
    order: 23,
    bookId: 'ISA',
    usfm: 'ISA',
    fileName: '23_isaias.json',
    nameEs: 'Isaías',
    nameEn: 'Isaiah',
    testament: 'OT',
  },
  {
    order: 24,
    bookId: 'JER',
    usfm: 'JER',
    fileName: '24_jeremias.json',
    nameEs: 'Jeremías',
    nameEn: 'Jeremiah',
    testament: 'OT',
  },
  {
    order: 25,
    bookId: 'LAM',
    usfm: 'LAM',
    fileName: '25_lamentaciones.json',
    nameEs: 'Lamentaciones',
    nameEn: 'Lamentations',
    testament: 'OT',
  },
  {
    order: 26,
    bookId: 'EZE',
    usfm: 'EZK',
    fileName: '26_ezequiel.json',
    nameEs: 'Ezequiel',
    nameEn: 'Ezekiel',
    testament: 'OT',
  },
  {
    order: 27,
    bookId: 'DAN',
    usfm: 'DAN',
    fileName: '27_daniel.json',
    nameEs: 'Daniel',
    nameEn: 'Daniel',
    testament: 'OT',
  },
  {
    order: 28,
    bookId: 'OSE',
    usfm: 'HOS',
    fileName: '28_oseas.json',
    nameEs: 'Oseas',
    nameEn: 'Hosea',
    testament: 'OT',
  },
  {
    order: 29,
    bookId: 'JOE',
    usfm: 'JOL',
    fileName: '29_joel.json',
    nameEs: 'Joel',
    nameEn: 'Joel',
    testament: 'OT',
  },
  {
    order: 30,
    bookId: 'AMO',
    usfm: 'AMO',
    fileName: '30_amos.json',
    nameEs: 'Amós',
    nameEn: 'Amos',
    testament: 'OT',
  },
  {
    order: 31,
    bookId: 'ABD',
    usfm: 'OBA',
    fileName: '31_abdias.json',
    nameEs: 'Abdías',
    nameEn: 'Obadiah',
    testament: 'OT',
  },
  {
    order: 32,
    bookId: 'JON',
    usfm: 'JON',
    fileName: '32_jonas.json',
    nameEs: 'Jonás',
    nameEn: 'Jonah',
    testament: 'OT',
  },
  {
    order: 33,
    bookId: 'MIQ',
    usfm: 'MIC',
    fileName: '33_miqueas.json',
    nameEs: 'Miqueas',
    nameEn: 'Micah',
    testament: 'OT',
  },
  {
    order: 34,
    bookId: 'NAH',
    usfm: 'NAM',
    fileName: '34_nahum.json',
    nameEs: 'Nahúm',
    nameEn: 'Nahum',
    testament: 'OT',
  },
  {
    order: 35,
    bookId: 'HAB',
    usfm: 'HAB',
    fileName: '35_habacuc.json',
    nameEs: 'Habacuc',
    nameEn: 'Habakkuk',
    testament: 'OT',
  },
  {
    order: 36,
    bookId: 'SOF',
    usfm: 'ZEP',
    fileName: '36_sofonias.json',
    nameEs: 'Sofonías',
    nameEn: 'Zephaniah',
    testament: 'OT',
  },
  {
    order: 37,
    bookId: 'HAG',
    usfm: 'HAG',
    fileName: '37_hageo.json',
    nameEs: 'Hageo',
    nameEn: 'Haggai',
    testament: 'OT',
  },
  {
    order: 38,
    bookId: 'ZAC',
    usfm: 'ZEC',
    fileName: '38_zacarias.json',
    nameEs: 'Zacarías',
    nameEn: 'Zechariah',
    testament: 'OT',
  },
  {
    order: 39,
    bookId: 'MAL',
    usfm: 'MAL',
    fileName: '39_malaquias.json',
    nameEs: 'Malaquías',
    nameEn: 'Malachi',
    testament: 'OT',
  },
  {
    order: 40,
    bookId: 'MAT',
    usfm: 'MAT',
    fileName: '40_mateo.json',
    nameEs: 'Mateo',
    nameEn: 'Matthew',
    testament: 'NT',
  },
  {
    order: 41,
    bookId: 'MAR',
    usfm: 'MRK',
    fileName: '41_marcos.json',
    nameEs: 'Marcos',
    nameEn: 'Mark',
    testament: 'NT',
  },
  {
    order: 42,
    bookId: 'LUC',
    usfm: 'LUK',
    fileName: '42_lucas.json',
    nameEs: 'Lucas',
    nameEn: 'Luke',
    testament: 'NT',
  },
  {
    order: 43,
    bookId: 'JUA',
    usfm: 'JHN',
    fileName: '43_juan.json',
    nameEs: 'Juan',
    nameEn: 'John',
    testament: 'NT',
  },
  {
    order: 44,
    bookId: 'HEC',
    usfm: 'ACT',
    fileName: '44_hechos.json',
    nameEs: 'Hechos',
    nameEn: 'Acts',
    testament: 'NT',
  },
  {
    order: 45,
    bookId: 'ROM',
    usfm: 'ROM',
    fileName: '45_romanos.json',
    nameEs: 'Romanos',
    nameEn: 'Romans',
    testament: 'NT',
  },
  {
    order: 46,
    bookId: '1CO',
    usfm: '1CO',
    fileName: '46_1_corintios.json',
    nameEs: '1 Corintios',
    nameEn: '1 Corinthians',
    testament: 'NT',
  },
  {
    order: 47,
    bookId: '2CO',
    usfm: '2CO',
    fileName: '47_2_corintios.json',
    nameEs: '2 Corintios',
    nameEn: '2 Corinthians',
    testament: 'NT',
  },
  {
    order: 48,
    bookId: 'GAL',
    usfm: 'GAL',
    fileName: '48_galatas.json',
    nameEs: 'Gálatas',
    nameEn: 'Galatians',
    testament: 'NT',
  },
  {
    order: 49,
    bookId: 'EFE',
    usfm: 'EPH',
    fileName: '49_efesios.json',
    nameEs: 'Efesios',
    nameEn: 'Ephesians',
    testament: 'NT',
  },
  {
    order: 50,
    bookId: 'FIL',
    usfm: 'PHP',
    fileName: '50_filipenses.json',
    nameEs: 'Filipenses',
    nameEn: 'Philippians',
    testament: 'NT',
  },
  {
    order: 51,
    bookId: 'COL',
    usfm: 'COL',
    fileName: '51_colosenses.json',
    nameEs: 'Colosenses',
    nameEn: 'Colossians',
    testament: 'NT',
  },
  {
    order: 52,
    bookId: '1TE',
    usfm: '1TH',
    fileName: '52_1_tesalonicenses.json',
    nameEs: '1 Tesalonicenses',
    nameEn: '1 Thessalonians',
    testament: 'NT',
  },
  {
    order: 53,
    bookId: '2TE',
    usfm: '2TH',
    fileName: '53_2_tesalonicenses.json',
    nameEs: '2 Tesalonicenses',
    nameEn: '2 Thessalonians',
    testament: 'NT',
  },
  {
    order: 54,
    bookId: '1TI',
    usfm: '1TI',
    fileName: '54_1_timoteo.json',
    nameEs: '1 Timoteo',
    nameEn: '1 Timothy',
    testament: 'NT',
  },
  {
    order: 55,
    bookId: '2TI',
    usfm: '2TI',
    fileName: '55_2_timoteo.json',
    nameEs: '2 Timoteo',
    nameEn: '2 Timothy',
    testament: 'NT',
  },
  {
    order: 56,
    bookId: 'TIT',
    usfm: 'TIT',
    fileName: '56_tito.json',
    nameEs: 'Tito',
    nameEn: 'Titus',
    testament: 'NT',
  },
  {
    order: 57,
    bookId: 'FLM',
    usfm: 'PHM',
    fileName: '57_filemon.json',
    nameEs: 'Filemón',
    nameEn: 'Philemon',
    testament: 'NT',
  },
  {
    order: 58,
    bookId: 'HEB',
    usfm: 'HEB',
    fileName: '58_hebreos.json',
    nameEs: 'Hebreos',
    nameEn: 'Hebrews',
    testament: 'NT',
  },
  {
    order: 59,
    bookId: 'STG',
    usfm: 'JAS',
    fileName: '59_santiago.json',
    nameEs: 'Santiago',
    nameEn: 'James',
    testament: 'NT',
  },
  {
    order: 60,
    bookId: '1PE',
    usfm: '1PE',
    fileName: '60_1_pedro.json',
    nameEs: '1 Pedro',
    nameEn: '1 Peter',
    testament: 'NT',
  },
  {
    order: 61,
    bookId: '2PE',
    usfm: '2PE',
    fileName: '61_2_pedro.json',
    nameEs: '2 Pedro',
    nameEn: '2 Peter',
    testament: 'NT',
  },
  {
    order: 62,
    bookId: '1JU',
    usfm: '1JN',
    fileName: '62_1_juan.json',
    nameEs: '1 Juan',
    nameEn: '1 John',
    testament: 'NT',
  },
  {
    order: 63,
    bookId: '2JU',
    usfm: '2JN',
    fileName: '63_2_juan.json',
    nameEs: '2 Juan',
    nameEn: '2 John',
    testament: 'NT',
  },
  {
    order: 64,
    bookId: '3JU',
    usfm: '3JN',
    fileName: '64_3_juan.json',
    nameEs: '3 Juan',
    nameEn: '3 John',
    testament: 'NT',
  },
  {
    order: 65,
    bookId: 'JUD',
    usfm: 'JUD',
    fileName: '65_judas.json',
    nameEs: 'Judas',
    nameEn: 'Jude',
    testament: 'NT',
  },
  {
    order: 66,
    bookId: 'APO',
    usfm: 'REV',
    fileName: '66_apocalipsis.json',
    nameEs: 'Apocalipsis',
    nameEn: 'Revelation',
    testament: 'NT',
  },
];

interface HelloAoBookListResponse {
  books: {
    id: string;
    name: string;
    commonName: string;
    introduction?: string;
    order: number;
    numberOfChapters: number;
    firstChapterNumber: number;
    lastChapterNumber: number;
  }[];
}

interface HelloAoChapterResponse {
  book: {
    id: string;
    name: string;
    commonName: string;
    introduction?: string;
    numberOfChapters: number;
  };
  chapter: {
    number: number;
    introduction?: string;
    content: {
      type: string;
      number?: number;
      content?: (string | { text?: string })[];
    }[];
  };
}

interface CorpusCommentaryEntry {
  id: string;
  entryType?: 'book_intro' | 'chapter_intro' | 'passage';
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
  title: string;
  contentMarkdown: string;
  tags: string[];
}

interface CorpusCommentaryEnvelope {
  authorId: string;
  bookId: string;
  language: 'es' | 'en';
  entries: CorpusCommentaryEntry[];
}

// Reemplazo de abreviaturas SWORD (ej. Pe2 1:19, Co1 15:45, Joh 5:17) a nombres legibles y compatibles con bibleReferenceParser
const SWORD_REF_MAP: Record<string, { en: string; es: string }> = {
  Gen: { en: 'Genesis', es: 'Génesis' },
  Exo: { en: 'Exodus', es: 'Éxodo' },
  Lev: { en: 'Leviticus', es: 'Levítico' },
  Num: { en: 'Numbers', es: 'Números' },
  Deu: { en: 'Deuteronomy', es: 'Deuteronomio' },
  Jos: { en: 'Joshua', es: 'Josué' },
  Jdg: { en: 'Judges', es: 'Jueces' },
  Rut: { en: 'Ruth', es: 'Rut' },
  Sa1: { en: '1 Samuel', es: '1 Samuel' },
  Sa2: { en: '2 Samuel', es: '2 Samuel' },
  Ki1: { en: '1 Kings', es: '1 Reyes' },
  Ki2: { en: '2 Kings', es: '2 Reyes' },
  Ch1: { en: '1 Chronicles', es: '1 Crónicas' },
  Ch2: { en: '2 Chronicles', es: '2 Crónicas' },
  Ezr: { en: 'Ezra', es: 'Esdras' },
  Neh: { en: 'Nehemiah', es: 'Nehemías' },
  Est: { en: 'Esther', es: 'Ester' },
  Job: { en: 'Job', es: 'Job' },
  Psa: { en: 'Psalm', es: 'Salmos' },
  Pro: { en: 'Proverbs', es: 'Proverbios' },
  Ecc: { en: 'Ecclesiastes', es: 'Eclesiastés' },
  Sol: { en: 'Song of Solomon', es: 'Cantares' },
  Sng: { en: 'Song of Solomon', es: 'Cantares' },
  Isa: { en: 'Isaiah', es: 'Isaías' },
  Jer: { en: 'Jeremiah', es: 'Jeremías' },
  Lam: { en: 'Lamentations', es: 'Lamentaciones' },
  Eze: { en: 'Ezekiel', es: 'Ezequiel' },
  Ezk: { en: 'Ezekiel', es: 'Ezequiel' },
  Dan: { en: 'Daniel', es: 'Daniel' },
  Hos: { en: 'Hosea', es: 'Oseas' },
  Joe: { en: 'Joel', es: 'Joel' },
  Jol: { en: 'Joel', es: 'Joel' },
  Amo: { en: 'Amos', es: 'Amós' },
  Oba: { en: 'Obadiah', es: 'Abdías' },
  Jon: { en: 'Jonah', es: 'Jonás' },
  Mic: { en: 'Micah', es: 'Miqueas' },
  Nah: { en: 'Nahum', es: 'Nahúm' },
  Nam: { en: 'Nahum', es: 'Nahúm' },
  Hab: { en: 'Habakkuk', es: 'Habacuc' },
  Zep: { en: 'Zephaniah', es: 'Sofonías' },
  Hag: { en: 'Haggai', es: 'Hageo' },
  Zec: { en: 'Zechariah', es: 'Zacarías' },
  Mal: { en: 'Malachi', es: 'Malaquías' },
  Mat: { en: 'Matthew', es: 'Mateo' },
  Mar: { en: 'Mark', es: 'Marcos' },
  Mrk: { en: 'Mark', es: 'Marcos' },
  Luk: { en: 'Luke', es: 'Lucas' },
  Joh: { en: 'John', es: 'Juan' },
  Jhn: { en: 'John', es: 'Juan' },
  Act: { en: 'Acts', es: 'Hechos' },
  Rom: { en: 'Romans', es: 'Romanos' },
  Co1: { en: '1 Corinthians', es: '1 Corintios' },
  Co2: { en: '2 Corinthians', es: '2 Corintios' },
  Gal: { en: 'Galatians', es: 'Gálatas' },
  Eph: { en: 'Ephesians', es: 'Efesios' },
  Phi: { en: 'Philippians', es: 'Filipenses' },
  Php: { en: 'Philippians', es: 'Filipenses' },
  Col: { en: 'Colossians', es: 'Colosenses' },
  Th1: { en: '1 Thessalonians', es: '1 Tesalonicenses' },
  Th2: { en: '2 Thessalonians', es: '2 Tesalonicenses' },
  Ti1: { en: '1 Timothy', es: '1 Timoteo' },
  Ti2: { en: '2 Timothy', es: '2 Timoteo' },
  Tit: { en: 'Titus', es: 'Tito' },
  Phm: { en: 'Philemon', es: 'Filemón' },
  Heb: { en: 'Hebrews', es: 'Hebreos' },
  Jam: { en: 'James', es: 'Santiago' },
  Jas: { en: 'James', es: 'Santiago' },
  Pe1: { en: '1 Peter', es: '1 Pedro' },
  Pe2: { en: '2 Peter', es: '2 Pedro' },
  Jo1: { en: '1 John', es: '1 Juan' },
  Jo2: { en: '2 John', es: '2 Juan' },
  Jo3: { en: '3 John', es: '3 Juan' },
  Jde: { en: 'Jude', es: 'Judas' },
  Jud: { en: 'Jude', es: 'Judas' },
  Rev: { en: 'Revelation', es: 'Apocalipsis' },
};

function normalizeScriptureReferences(text: string, lang: 'en' | 'es'): string {
  return text.replace(
    /\b(Gen|Exo|Lev|Num|Deu|Jos|Jdg|Rut|Sa1|Sa2|Ki1|Ki2|Ch1|Ch2|Ezr|Neh|Est|Job|Psa|Pro|Ecc|Sol|Sng|Isa|Jer|Lam|Eze|Ezk|Dan|Hos|Joe|Jol|Amo|Oba|Jon|Mic|Nah|Nam|Hab|Zep|Hag|Zec|Mal|Mat|Mar|Mrk|Luk|Joh|Jhn|Act|Rom|Co1|Co2|Gal|Eph|Phi|Php|Col|Th1|Th2|Ti1|Ti2|Tit|Phm|Heb|Jam|Jas|Pe1|Pe2|Jo1|Jo2|Jo3|Jde|Jud|Rev)\s+(\d+:\d+(?:-\d+)?)/g,
    (match, code: string, ref: string) => {
      const mapped = SWORD_REF_MAP[code];
      if (!mapped) return match;
      return `${mapped[lang]} ${ref}`;
    },
  );
}

function formatExegeticalMarkdown(rawText: string, lang: 'en' | 'es'): string {
  const cleaned = normalizeScriptureReferences(rawText.trim(), lang)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    // Separar numerales romanos principales en párrafos legibles con énfasis
    .replace(/\n(I|II|III|IV|V|VI|VII|VIII)\.\s+/g, '\n\n**$1.** ')
    .replace(
      /\s+(I|II|III|IV|V|VI|VII|VIII)\.\s+([A-ZÁÉÍÓÚ])/g,
      '\n\n**$1.** $2',
    );

  return cleaned.trim();
}

function extractEnglishSectionTitle(
  bookNameEn: string,
  chapter: number,
  verseStart: number,
  verseEnd: number | null,
  markdown: string,
): string {
  const rangeLabel =
    verseEnd && verseEnd > verseStart
      ? `${bookNameEn} ${chapter}:${verseStart}-${verseEnd}`
      : `${bookNameEn} ${chapter}:${verseStart}`;

  const firstParagraph = markdown.split('\n')[0] || '';
  const cleanedFirst = firstParagraph
    .replace(/^\*\*[IVX]+\.\*\*\s*/, '')
    .replace(
      /^(We have here,?\s*|Here is,?\s*|In these verses,?\s*|Observe here,?\s*)/i,
      '',
    )
    .replace(/^\*\*?[IVX1-9]+\.\*\*?\s*/, '')
    .trim();

  const firstSentence = cleanedFirst.split(/[.?!;]/)[0]?.trim() || '';
  if (firstSentence.length >= 12 && firstSentence.length <= 95) {
    const capitalized =
      firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
    return `${rangeLabel} — ${capitalized}`;
  }

  return `${rangeLabel} — Expository Commentary`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateTextToSpanish(textEn: string): Promise<string> {
  if (!textEn.trim()) return '';

  // Dividir por párrafos para no exceder límites de URL en bloques largos
  const paragraphs = textEn.split('\n\n');
  const batches: string[] = [];
  let currentBatch = '';

  for (const p of paragraphs) {
    if ((currentBatch + '\n\n' + p).length > 1600 && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = p;
    } else {
      currentBatch = currentBatch ? `${currentBatch}\n\n${p}` : p;
    }
  }
  if (currentBatch) {
    batches.push(currentBatch);
  }

  const translatedBatches: string[] = [];
  for (const batch of batches) {
    let translated = batch;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const url =
          'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=' +
          encodeURIComponent(batch);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as [[string, string][]];
        if (Array.isArray(data) && Array.isArray(data[0])) {
          translated = data[0].map((segment) => segment[0]).join('');
          break;
        }
      } catch {
        if (attempt < 3) {
          await sleep(400 * attempt);
        }
      }
    }
    translatedBatches.push(normalizeScriptureReferences(translated, 'es'));
    await sleep(120);
  }

  return translatedBatches.join('\n\n');
}

function readExistingEnvelope(
  filePath: string,
  authorId: string,
  bookId: string,
  language: 'es' | 'en',
): CorpusCommentaryEnvelope {
  if (!fs.existsSync(filePath)) {
    return { authorId, bookId, language, entries: [] };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as
      | CorpusCommentaryEnvelope
      | CorpusCommentaryEntry[];
    if (Array.isArray(raw)) {
      return { authorId, bookId, language, entries: raw };
    }
    return {
      authorId: raw.authorId || authorId,
      bookId: raw.bookId || bookId,
      language: raw.language || language,
      entries: Array.isArray(raw.entries) ? raw.entries : [],
    };
  } catch {
    return { authorId, bookId, language, entries: [] };
  }
}

function writeEnvelope(
  filePath: string,
  envelope: CorpusCommentaryEnvelope,
): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  envelope.entries.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    if (a.verseStart !== b.verseStart) return a.verseStart - b.verseStart;
    return (a.verseEnd ?? a.verseStart) - (b.verseEnd ?? b.verseStart);
  });
  fs.writeFileSync(filePath, JSON.stringify(envelope, null, 2) + '\n', 'utf-8');
}

function parseChapterFilter(raw?: string): Set<number> | null {
  if (!raw) return null;
  const set = new Set<number>();
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        for (let c = start; c <= end; c++) set.add(c);
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) set.add(num);
    }
  }
  return set.size > 0 ? set : null;
}

async function runImporter(): Promise<void> {
  const args = process.argv.slice(2);
  const getArg = (prefix: string): string | undefined => {
    const found = args.find((a) => a.startsWith(`${prefix}=`));
    return found ? found.slice(prefix.length + 1) : undefined;
  };

  const authorArg = (getArg('--author') || 'matthew-henry').toLowerCase();
  const authorId =
    authorArg === 'jfb' || authorArg === 'jamieson-fausset-brown'
      ? 'jfb'
      : 'matthew-henry';
  const remoteAuthorId =
    authorId === 'jfb' ? 'jamieson-fausset-brown' : 'matthew-henry';
  const idPrefix = authorId === 'jfb' ? 'jfb' : 'mh';

  const forceOverwrite = args.includes('--force');
  const skipTranslate = args.includes('--no-translate');
  const skipSeed = args.includes('--no-seed');
  const isAll = args.includes('--all');
  const isNT = args.includes('--nt');
  const isOT = args.includes('--ot');
  const bookArg = getArg('--book') || getArg('--books');
  const chaptersFilter = parseChapterFilter(
    getArg('--chapters') || getArg('--chapter'),
  );

  let targetBooks: CanonicalBookMeta[] = [];

  if (isAll) {
    targetBooks = [...CANONICAL_BOOKS_META];
  } else if (isNT) {
    targetBooks = CANONICAL_BOOKS_META.filter((b) => b.testament === 'NT');
  } else if (isOT) {
    targetBooks = CANONICAL_BOOKS_META.filter((b) => b.testament === 'OT');
  } else if (bookArg) {
    const requestedTokens = bookArg
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const token of requestedTokens) {
      const resolved = resolveCanonicalBook(token);
      if (resolved) {
        const meta = CANONICAL_BOOKS_META.find(
          (m) => m.bookId === resolved.bookId,
        );
        if (meta && !targetBooks.some((tb) => tb.bookId === meta.bookId)) {
          targetBooks.push(meta);
        }
      }
    }
  } else {
    console.log(
      '[CommentaryImporter] Uso: pnpm --filter backend import:matthew-henry --book=GEN [--chapters=1-5] [--nt] [--ot] [--all] [--force]',
    );
    return;
  }

  if (targetBooks.length === 0) {
    console.error(
      '[CommentaryImporter] No se encontraron libros canónicos válidos para los parámetros proporcionados.',
    );
    process.exit(1);
  }

  console.log(
    `[CommentaryImporter] Consultando catálogo remoto de ${remoteAuthorId} en HelloAO API...`,
  );
  const booksRes = await fetch(
    `https://bible.helloao.org/api/c/${remoteAuthorId}/books.json`,
  );
  if (!booksRes.ok) {
    throw new Error(
      `Error HTTP ${booksRes.status} al obtener books.json de HelloAO API`,
    );
  }
  const booksPayload = (await booksRes.json()) as HelloAoBookListResponse;
  const remoteBooksByUsfm = new Map(
    booksPayload.books.map((b) => [b.id.toUpperCase(), b]),
  );

  const corpusAuthorDir = path.resolve(
    __dirname,
    '../../../src/kartex/corpus/commentaries',
    authorId,
  );

  let totalChaptersImported = 0;
  let totalEntriesCreated = 0;

  for (const bookMeta of targetBooks) {
    const remoteBook = remoteBooksByUsfm.get(bookMeta.usfm);
    if (!remoteBook) {
      console.warn(
        `[CommentaryImporter] El libro ${bookMeta.nameEs} (${bookMeta.usfm}) no está disponible en ${remoteAuthorId}.`,
      );
      continue;
    }

    const enFilePath = path.join(corpusAuthorDir, 'en', bookMeta.fileName);
    const esFilePath = path.join(corpusAuthorDir, 'es', bookMeta.fileName);

    const enEnvelope = readExistingEnvelope(
      enFilePath,
      authorId,
      bookMeta.bookId,
      'en',
    );
    const esEnvelope = readExistingEnvelope(
      esFilePath,
      authorId,
      bookMeta.bookId,
      'es',
    );

    const existingEnChapters = new Set(
      enEnvelope.entries.map((e) => e.chapter),
    );
    const existingEsChapters = new Set(
      esEnvelope.entries.map((e) => e.chapter),
    );

    const startChapter = remoteBook.firstChapterNumber || 1;
    const endChapter =
      remoteBook.lastChapterNumber || remoteBook.numberOfChapters;

    console.log(
      `[CommentaryImporter] Procesando ${bookMeta.nameEs} (${bookMeta.bookId}) — Capítulos ${startChapter} al ${endChapter}...`,
    );

    for (let ch = startChapter; ch <= endChapter; ch++) {
      if (chaptersFilter && !chaptersFilter.has(ch)) continue;

      const hasEn = existingEnChapters.has(ch);
      const hasEs = existingEsChapters.has(ch);

      if (!forceOverwrite && hasEn && (hasEs || skipTranslate)) {
        console.log(
          `[CommentaryImporter] -> Omitiendo ${bookMeta.bookId} ${ch} (ya existe en el corpus local; usa --force para sobrescribir).`,
        );
        continue;
      }

      const chapterUrl = `https://bible.helloao.org/api/c/${remoteAuthorId}/${bookMeta.usfm}/${ch}.json`;
      const chRes = await fetch(chapterUrl);
      if (!chRes.ok) {
        console.warn(
          `[CommentaryImporter] -> No se pudo descargar ${bookMeta.bookId} ${ch} (HTTP ${chRes.status}).`,
        );
        continue;
      }

      const chData = (await chRes.json()) as HelloAoChapterResponse;
      const newEnEntries: CorpusCommentaryEntry[] = [];
      const newEsEntries: CorpusCommentaryEntry[] = [];

      // 1. Introducción / Sinopsis del Capítulo
      if (
        chData.chapter.introduction &&
        chData.chapter.introduction.trim().length > 0
      ) {
        const introId = `${idPrefix}-${bookMeta.bookId.toLowerCase()}-${ch}-intro`;
        const introMdEn = formatExegeticalMarkdown(
          chData.chapter.introduction,
          'en',
        );
        const introTitleEn = `Synopsis and Argument of ${bookMeta.nameEn} ${ch}`;

        newEnEntries.push({
          id: introId,
          entryType: 'chapter_intro',
          chapter: ch,
          verseStart: 0,
          verseEnd: null,
          title: introTitleEn,
          contentMarkdown: introMdEn,
          tags: [bookMeta.nameEn, 'Chapter Synopsis', 'Exposition'],
        });

        if (!skipTranslate) {
          const introMdEs = formatExegeticalMarkdown(
            await translateTextToSpanish(introMdEn),
            'es',
          );
          newEsEntries.push({
            id: introId,
            entryType: 'chapter_intro',
            chapter: ch,
            verseStart: 0,
            verseEnd: null,
            title: `Sinopsis y Argumento de ${bookMeta.nameEs} ${ch}`,
            contentMarkdown: introMdEs,
            tags: [bookMeta.nameEs, 'Sinopsis Capitular', 'Exposición'],
          });
        }
      }

      // 2. Bloques Exegéticos por Versículo / Sección
      const verseBlocks = (chData.chapter.content || []).filter(
        (item) =>
          item.type === 'verse' &&
          typeof item.number === 'number' &&
          Array.isArray(item.content) &&
          item.content.length > 0,
      );

      for (let i = 0; i < verseBlocks.length; i++) {
        const block = verseBlocks[i];
        const verseStart = block.number as number;
        const nextBlock = verseBlocks[i + 1];
        const verseEnd =
          nextBlock &&
          typeof nextBlock.number === 'number' &&
          nextBlock.number > verseStart + 1
            ? nextBlock.number - 1
            : null;

        const rawParagraphs = (block.content || [])
          .map((seg) => (typeof seg === 'string' ? seg : seg.text || ''))
          .filter((s) => s.trim().length > 0)
          .join('\n\n');

        if (!rawParagraphs.trim()) continue;

        const mdEn = formatExegeticalMarkdown(rawParagraphs, 'en');
        const titleEn = extractEnglishSectionTitle(
          bookMeta.nameEn,
          ch,
          verseStart,
          verseEnd,
          mdEn,
        );

        const entryId =
          verseEnd && verseEnd > verseStart
            ? `${idPrefix}-${bookMeta.bookId.toLowerCase()}-${ch}-${verseStart}-${verseEnd}`
            : `${idPrefix}-${bookMeta.bookId.toLowerCase()}-${ch}-${verseStart}`;

        newEnEntries.push({
          id: entryId,
          entryType: 'passage',
          chapter: ch,
          verseStart,
          verseEnd,
          title: titleEn,
          contentMarkdown: mdEn,
          tags: [
            bookMeta.nameEn,
            `${bookMeta.nameEn} ${ch}`,
            'Exegesis',
            'Pastoral Exposition',
          ],
        });

        if (!skipTranslate) {
          const mdEs = formatExegeticalMarkdown(
            await translateTextToSpanish(mdEn),
            'es',
          );
          const subtitleEn = titleEn.includes(' — ')
            ? titleEn.split(' — ').slice(1).join(' — ')
            : 'Expository Commentary';
          const subtitleEs = await translateTextToSpanish(subtitleEn);
          const rangeLabelEs =
            verseEnd && verseEnd > verseStart
              ? `${bookMeta.nameEs} ${ch}:${verseStart}-${verseEnd}`
              : `${bookMeta.nameEs} ${ch}:${verseStart}`;

          newEsEntries.push({
            id: entryId,
            entryType: 'passage',
            chapter: ch,
            verseStart,
            verseEnd,
            title: `${rangeLabelEs} — ${subtitleEs.trim()}`,
            contentMarkdown: mdEs,
            tags: [
              bookMeta.nameEs,
              `${bookMeta.nameEs} ${ch}`,
              'Exégesis',
              'Exposición Pastoral',
            ],
          });
        }
      }

      if (forceOverwrite || !hasEn) {
        enEnvelope.entries = enEnvelope.entries
          .filter((e) => e.chapter !== ch)
          .concat(newEnEntries);
      }

      if (!skipTranslate && (forceOverwrite || !hasEs)) {
        esEnvelope.entries = esEnvelope.entries
          .filter((e) => e.chapter !== ch)
          .concat(newEsEntries);
      }

      writeEnvelope(enFilePath, enEnvelope);
      if (!skipTranslate) {
        writeEnvelope(esFilePath, esEnvelope);
      }

      totalChaptersImported++;
      totalEntriesCreated += newEnEntries.length + newEsEntries.length;
      console.log(
        `[CommentaryImporter] -> ${bookMeta.bookId} ${ch} importado (${newEnEntries.length} bloques EN${skipTranslate ? '' : ` + ${newEsEntries.length} bloques ES`}).`,
      );
    }
  }

  console.log(
    `[CommentaryImporter] Ingesta finalizada: ${totalChaptersImported} capítulos procesados (${totalEntriesCreated} entradas generadas).`,
  );

  if (!skipSeed && totalChaptersImported > 0) {
    console.log(
      '[CommentaryImporter] Ejecutando seedCorpus() para sincronizar kartex.sqlite...',
    );
    seedCorpus();
  }
}

if (require.main === module) {
  runImporter().catch((err) => {
    console.error('[CommentaryImporter] Error fatal durante la ingesta:', err);
    process.exit(1);
  });
}
