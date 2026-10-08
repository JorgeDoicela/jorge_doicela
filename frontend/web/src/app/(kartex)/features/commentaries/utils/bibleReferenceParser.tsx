'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface BookInfo {
  id: number;
  abbr: string;
}

// Mapa exhaustivo de nombres y abreviaturas canónicas (Español e Inglés)
const SCRIPTURE_BOOK_MAP: Record<string, BookInfo> = {
  // Antiguo Testamento
  genesis: { id: 1, abbr: 'GEN' },
  génesis: { id: 1, abbr: 'GEN' },
  gen: { id: 1, abbr: 'GEN' },
  gn: { id: 1, abbr: 'GEN' },
  exodo: { id: 2, abbr: 'EXO' },
  éxodo: { id: 2, abbr: 'EXO' },
  exodus: { id: 2, abbr: 'EXO' },
  exo: { id: 2, abbr: 'EXO' },
  ex: { id: 2, abbr: 'EXO' },
  levitico: { id: 3, abbr: 'LEV' },
  levítico: { id: 3, abbr: 'LEV' },
  leviticus: { id: 3, abbr: 'LEV' },
  lev: { id: 3, abbr: 'LEV' },
  lv: { id: 3, abbr: 'LEV' },
  numeros: { id: 4, abbr: 'NUM' },
  números: { id: 4, abbr: 'NUM' },
  numbers: { id: 4, abbr: 'NUM' },
  num: { id: 4, abbr: 'NUM' },
  nm: { id: 4, abbr: 'NUM' },
  deuteronomio: { id: 5, abbr: 'DEU' },
  deuteronomy: { id: 5, abbr: 'DEU' },
  deu: { id: 5, abbr: 'DEU' },
  dt: { id: 5, abbr: 'DEU' },
  josue: { id: 6, abbr: 'JOS' },
  josué: { id: 6, abbr: 'JOS' },
  joshua: { id: 6, abbr: 'JOS' },
  jos: { id: 6, abbr: 'JOS' },
  jueces: { id: 7, abbr: 'JUE' },
  judges: { id: 7, abbr: 'JUE' },
  jue: { id: 7, abbr: 'JUE' },
  jdg: { id: 7, abbr: 'JUE' },
  rut: { id: 8, abbr: 'RUT' },
  ruth: { id: 8, abbr: 'RUT' },
  rt: { id: 8, abbr: 'RUT' },
  '1 samuel': { id: 9, abbr: '1SA' },
  '1samuel': { id: 9, abbr: '1SA' },
  '1sam': { id: 9, abbr: '1SA' },
  '1sa': { id: 9, abbr: '1SA' },
  '1s': { id: 9, abbr: '1SA' },
  '2 samuel': { id: 10, abbr: '2SA' },
  '2samuel': { id: 10, abbr: '2SA' },
  '2sam': { id: 10, abbr: '2SA' },
  '2sa': { id: 10, abbr: '2SA' },
  '2s': { id: 10, abbr: '2SA' },
  '1 reyes': { id: 11, abbr: '1RE' },
  '1 kings': { id: 11, abbr: '1RE' },
  '1reyes': { id: 11, abbr: '1RE' },
  '1rey': { id: 11, abbr: '1RE' },
  '1re': { id: 11, abbr: '1RE' },
  '1ki': { id: 11, abbr: '1RE' },
  '1kgs': { id: 11, abbr: '1RE' },
  '2 reyes': { id: 12, abbr: '2RE' },
  '2 kings': { id: 12, abbr: '2RE' },
  '2reyes': { id: 12, abbr: '2RE' },
  '2rey': { id: 12, abbr: '2RE' },
  '2re': { id: 12, abbr: '2RE' },
  '2ki': { id: 12, abbr: '2RE' },
  '2kgs': { id: 12, abbr: '2RE' },
  '1 cronicas': { id: 13, abbr: '1CR' },
  '1 crónicas': { id: 13, abbr: '1CR' },
  '1 chronicles': { id: 13, abbr: '1CR' },
  '1cro': { id: 13, abbr: '1CR' },
  '1cr': { id: 13, abbr: '1CR' },
  '1chr': { id: 13, abbr: '1CR' },
  '2 cronicas': { id: 14, abbr: '2CR' },
  '2 crónicas': { id: 14, abbr: '2CR' },
  '2 chronicles': { id: 14, abbr: '2CR' },
  '2cro': { id: 14, abbr: '2CR' },
  '2cr': { id: 14, abbr: '2CR' },
  '2chr': { id: 14, abbr: '2CR' },
  esdras: { id: 15, abbr: 'ESD' },
  ezra: { id: 15, abbr: 'ESD' },
  esd: { id: 15, abbr: 'ESD' },
  ezr: { id: 15, abbr: 'ESD' },
  nehemias: { id: 16, abbr: 'NEH' },
  nehemías: { id: 16, abbr: 'NEH' },
  nehemiah: { id: 16, abbr: 'NEH' },
  neh: { id: 16, abbr: 'NEH' },
  ester: { id: 17, abbr: 'EST' },
  esther: { id: 17, abbr: 'EST' },
  est: { id: 17, abbr: 'EST' },
  job: { id: 18, abbr: 'JOB' },
  salmos: { id: 19, abbr: 'SAL' },
  salmo: { id: 19, abbr: 'SAL' },
  psalms: { id: 19, abbr: 'SAL' },
  psalm: { id: 19, abbr: 'SAL' },
  sal: { id: 19, abbr: 'SAL' },
  ps: { id: 19, abbr: 'SAL' },
  psa: { id: 19, abbr: 'SAL' },
  proverbios: { id: 20, abbr: 'PRO' },
  proverbs: { id: 20, abbr: 'PRO' },
  prov: { id: 20, abbr: 'PRO' },
  prv: { id: 20, abbr: 'PRO' },
  pr: { id: 20, abbr: 'PRO' },
  eclesiastes: { id: 21, abbr: 'ECL' },
  eclesiastés: { id: 21, abbr: 'ECL' },
  ecclesiastes: { id: 21, abbr: 'ECL' },
  ecl: { id: 21, abbr: 'ECL' },
  ecc: { id: 21, abbr: 'ECL' },
  cantares: { id: 22, abbr: 'CAN' },
  'cantar de los cantares': { id: 22, abbr: 'CAN' },
  'song of solomon': { id: 22, abbr: 'CAN' },
  song: { id: 22, abbr: 'CAN' },
  can: { id: 22, abbr: 'CAN' },
  cnt: { id: 22, abbr: 'CAN' },
  isaias: { id: 23, abbr: 'ISA' },
  isaías: { id: 23, abbr: 'ISA' },
  isaiah: { id: 23, abbr: 'ISA' },
  isa: { id: 23, abbr: 'ISA' },
  is: { id: 23, abbr: 'ISA' },
  jeremias: { id: 24, abbr: 'JER' },
  jeremías: { id: 24, abbr: 'JER' },
  jeremiah: { id: 24, abbr: 'JER' },
  jer: { id: 24, abbr: 'JER' },
  jr: { id: 24, abbr: 'JER' },
  lamentaciones: { id: 25, abbr: 'LAM' },
  lamentations: { id: 25, abbr: 'LAM' },
  lam: { id: 25, abbr: 'LAM' },
  ezequiel: { id: 26, abbr: 'EZE' },
  ezekiel: { id: 26, abbr: 'EZE' },
  eze: { id: 26, abbr: 'EZE' },
  ezek: { id: 26, abbr: 'EZE' },
  daniel: { id: 27, abbr: 'DAN' },
  dan: { id: 27, abbr: 'DAN' },
  dn: { id: 27, abbr: 'DAN' },
  oseas: { id: 28, abbr: 'OSE' },
  hosea: { id: 28, abbr: 'OSE' },
  ose: { id: 28, abbr: 'OSE' },
  hos: { id: 28, abbr: 'OSE' },
  joel: { id: 29, abbr: 'JOE' },
  joe: { id: 29, abbr: 'JOE' },
  jl: { id: 29, abbr: 'JOE' },
  amos: { id: 30, abbr: 'AMO' },
  amós: { id: 30, abbr: 'AMO' },
  amo: { id: 30, abbr: 'AMO' },
  am: { id: 30, abbr: 'AMO' },
  abdias: { id: 31, abbr: 'ABD' },
  abdías: { id: 31, abbr: 'ABD' },
  obadiah: { id: 31, abbr: 'ABD' },
  abd: { id: 31, abbr: 'ABD' },
  obad: { id: 31, abbr: 'ABD' },
  jonas: { id: 32, abbr: 'JON' },
  jonás: { id: 32, abbr: 'JON' },
  jonah: { id: 32, abbr: 'JON' },
  jon: { id: 32, abbr: 'JON' },
  miqueas: { id: 33, abbr: 'MIQ' },
  micah: { id: 33, abbr: 'MIQ' },
  miq: { id: 33, abbr: 'MIQ' },
  mic: { id: 33, abbr: 'MIQ' },
  nahum: { id: 34, abbr: 'NAH' },
  nahúm: { id: 34, abbr: 'NAH' },
  nah: { id: 34, abbr: 'NAH' },
  habacuc: { id: 35, abbr: 'HAB' },
  habakkuk: { id: 35, abbr: 'HAB' },
  hab: { id: 35, abbr: 'HAB' },
  sofonias: { id: 36, abbr: 'SOF' },
  sofonías: { id: 36, abbr: 'SOF' },
  zephaniah: { id: 36, abbr: 'SOF' },
  sof: { id: 36, abbr: 'SOF' },
  zeph: { id: 36, abbr: 'SOF' },
  hageo: { id: 37, abbr: 'HAG' },
  haggai: { id: 37, abbr: 'HAG' },
  hag: { id: 37, abbr: 'HAG' },
  zacarias: { id: 38, abbr: 'ZAC' },
  zacarías: { id: 38, abbr: 'ZAC' },
  zechariah: { id: 38, abbr: 'ZAC' },
  zac: { id: 38, abbr: 'ZAC' },
  zech: { id: 38, abbr: 'ZAC' },
  malaquias: { id: 39, abbr: 'MAL' },
  malaquías: { id: 39, abbr: 'MAL' },
  malachi: { id: 39, abbr: 'MAL' },
  mal: { id: 39, abbr: 'MAL' },

  // Nuevo Testamento
  mateo: { id: 40, abbr: 'MAT' },
  matthew: { id: 40, abbr: 'MAT' },
  mat: { id: 40, abbr: 'MAT' },
  mt: { id: 40, abbr: 'MAT' },
  marcos: { id: 41, abbr: 'MAR' },
  mark: { id: 41, abbr: 'MAR' },
  mar: { id: 41, abbr: 'MAR' },
  mc: { id: 41, abbr: 'MAR' },
  mk: { id: 41, abbr: 'MAR' },
  lucas: { id: 42, abbr: 'LUC' },
  luke: { id: 42, abbr: 'LUC' },
  luc: { id: 42, abbr: 'LUC' },
  lc: { id: 42, abbr: 'LUC' },
  lk: { id: 42, abbr: 'LUC' },
  juan: { id: 43, abbr: 'JUA' },
  john: { id: 43, abbr: 'JUA' },
  jua: { id: 43, abbr: 'JUA' },
  jn: { id: 43, abbr: 'JUA' },
  jhn: { id: 43, abbr: 'JUA' },
  hechos: { id: 44, abbr: 'HEC' },
  acts: { id: 44, abbr: 'HEC' },
  hec: { id: 44, abbr: 'HEC' },
  hch: { id: 44, abbr: 'HEC' },
  act: { id: 44, abbr: 'HEC' },
  ac: { id: 44, abbr: 'HEC' },
  romanos: { id: 45, abbr: 'ROM' },
  romans: { id: 45, abbr: 'ROM' },
  rom: { id: 45, abbr: 'ROM' },
  ro: { id: 45, abbr: 'ROM' },
  '1 corintios': { id: 46, abbr: '1CO' },
  '1 corinthians': { id: 46, abbr: '1CO' },
  '1corintios': { id: 46, abbr: '1CO' },
  '1cor': { id: 46, abbr: '1CO' },
  '1co': { id: 46, abbr: '1CO' },
  '2 corintios': { id: 47, abbr: '2CO' },
  '2 corinthians': { id: 47, abbr: '2CO' },
  '2corintios': { id: 47, abbr: '2CO' },
  '2cor': { id: 47, abbr: '2CO' },
  '2co': { id: 47, abbr: '2CO' },
  galatas: { id: 48, abbr: 'GAL' },
  gálatas: { id: 48, abbr: 'GAL' },
  galatians: { id: 48, abbr: 'GAL' },
  gal: { id: 48, abbr: 'GAL' },
  efesios: { id: 49, abbr: 'EFE' },
  ephesians: { id: 49, abbr: 'EFE' },
  efe: { id: 49, abbr: 'EFE' },
  ef: { id: 49, abbr: 'EFE' },
  eph: { id: 49, abbr: 'EFE' },
  filipenses: { id: 50, abbr: 'FIL' },
  philippians: { id: 50, abbr: 'FIL' },
  fil: { id: 50, abbr: 'FIL' },
  phil: { id: 50, abbr: 'FIL' },
  php: { id: 50, abbr: 'FIL' },
  colosenses: { id: 51, abbr: 'COL' },
  colossians: { id: 51, abbr: 'COL' },
  col: { id: 51, abbr: 'COL' },
  '1 tesalonicenses': { id: 52, abbr: '1TE' },
  '1 thessalonians': { id: 52, abbr: '1TE' },
  '1tes': { id: 52, abbr: '1TE' },
  '1te': { id: 52, abbr: '1TE' },
  '1th': { id: 52, abbr: '1TE' },
  '2 tesalonicenses': { id: 53, abbr: '2TE' },
  '2 thessalonians': { id: 53, abbr: '2TE' },
  '2tes': { id: 53, abbr: '2TE' },
  '2te': { id: 53, abbr: '2TE' },
  '2th': { id: 53, abbr: '2TE' },
  '1 timoteo': { id: 54, abbr: '1TI' },
  '1 timothy': { id: 54, abbr: '1TI' },
  '1tim': { id: 54, abbr: '1TI' },
  '1ti': { id: 54, abbr: '1TI' },
  '2 timoteo': { id: 55, abbr: '2TI' },
  '2 timothy': { id: 55, abbr: '2TI' },
  '2tim': { id: 55, abbr: '2TI' },
  '2ti': { id: 55, abbr: '2TI' },
  tito: { id: 56, abbr: 'TIT' },
  titus: { id: 56, abbr: 'TIT' },
  tit: { id: 56, abbr: 'TIT' },
  filemon: { id: 57, abbr: 'FLM' },
  filemón: { id: 57, abbr: 'FLM' },
  philemon: { id: 57, abbr: 'FLM' },
  flm: { id: 57, abbr: 'FLM' },
  phm: { id: 57, abbr: 'FLM' },
  hebreos: { id: 58, abbr: 'HEB' },
  hebrews: { id: 58, abbr: 'HEB' },
  heb: { id: 58, abbr: 'HEB' },
  santiago: { id: 59, abbr: 'STG' },
  james: { id: 59, abbr: 'STG' },
  stg: { id: 59, abbr: 'STG' },
  jas: { id: 59, abbr: 'STG' },
  '1 pedro': { id: 60, abbr: '1PE' },
  '1 peter': { id: 60, abbr: '1PE' },
  '1ped': { id: 60, abbr: '1PE' },
  '1pe': { id: 60, abbr: '1PE' },
  '1pt': { id: 60, abbr: '1PE' },
  '2 pedro': { id: 61, abbr: '2PE' },
  '2 peter': { id: 61, abbr: '2PE' },
  '2ped': { id: 61, abbr: '2PE' },
  '2pe': { id: 61, abbr: '2PE' },
  '2pt': { id: 61, abbr: '2PE' },
  '1 juan': { id: 62, abbr: '1JU' },
  '1 john': { id: 62, abbr: '1JU' },
  '1jn': { id: 62, abbr: '1JU' },
  '1ju': { id: 62, abbr: '1JU' },
  '1jhn': { id: 62, abbr: '1JU' },
  '2 juan': { id: 63, abbr: '2JU' },
  '2 john': { id: 63, abbr: '2JU' },
  '2jn': { id: 63, abbr: '2JU' },
  '2ju': { id: 63, abbr: '2JU' },
  '2jhn': { id: 63, abbr: '2JU' },
  '3 juan': { id: 64, abbr: '3JU' },
  '3 john': { id: 64, abbr: '3JU' },
  '3jn': { id: 64, abbr: '3JU' },
  '3ju': { id: 64, abbr: '3JU' },
  '3jhn': { id: 64, abbr: '3JU' },
  judas: { id: 65, abbr: 'JUD' },
  jude: { id: 65, abbr: 'JUD' },
  jud: { id: 65, abbr: 'JUD' },
  apocalipsis: { id: 66, abbr: 'APO' },
  revelation: { id: 66, abbr: 'APO' },
  apoc: { id: 66, abbr: 'APO' },
  apo: { id: 66, abbr: 'APO' },
  rev: { id: 66, abbr: 'APO' },
};

/**
 * Expresión regular para detectar citas bíblicas canónicas en textos exegéticos:
 * Ejemplos: "Génesis 1:1", "Jn 1:1-3", "Rom 8:28", "Salmos 104:24", "1 Corintios 15:3"
 */
const SCRIPTURE_REF_REGEX =
  /\b((?:[123]\s+)?[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,20})\s+(\d{1,3})(?::(\d{1,3})(?:-(\d{1,3}))?)?\b/g;

export interface ScriptureClickOptions {
  onSelectPassage?: (bookId: number, chapter: number, verse?: number) => void;
}

/**
 * Analiza un fragmento de texto puro y convierte cualquier cita canónica reconocida
 * en un enlace interactivo hacia el Lector / Inspector Bíblico de Kartex.
 */
export function renderLinkedScriptureText(
  text: string,
  options?: ScriptureClickOptions,
): React.ReactNode {
  if (!text) return text;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reiniciar regex global
  SCRIPTURE_REF_REGEX.lastIndex = 0;

  while ((match = SCRIPTURE_REF_REGEX.exec(text)) !== null) {
    const fullMatch = match[0];
    const rawBook = match[1].toLowerCase().trim().replace(/\s+/g, ' ');
    const chapterStr = match[2];
    const verseStartStr = match[3];

    const bookInfo = SCRIPTURE_BOOK_MAP[rawBook];

    if (bookInfo) {
      // Texto previo al match
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      const chapter = parseInt(chapterStr, 10);
      const verse = verseStartStr ? parseInt(verseStartStr, 10) : undefined;
      const targetUrl = `/study/standard?book=${bookInfo.abbr}&chapter=${chapter}${verse ? `&verse=${verse}` : ''}`;

      elements.push(
        <Link
          key={`ref-${match.index}-${fullMatch}`}
          href={targetUrl}
          onClick={(e) => {
            e.stopPropagation();
            if (options?.onSelectPassage) {
              options.onSelectPassage(bookInfo.id, chapter, verse);
            }
          }}
          title={`Examinar ${fullMatch} en el Lector Canónico`}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono text-[12px] font-medium bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-400/20 border border-amber-500/25 dark:border-amber-400/25 transition-all cursor-pointer no-underline group/ref mx-0.5 align-baseline"
        >
          <span>{fullMatch}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/ref:opacity-100 transition-opacity shrink-0" />
        </Link>,
      );

      lastIndex = match.index + fullMatch.length;
    }
  }

  // Resto del texto
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}
