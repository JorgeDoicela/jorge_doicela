import {
  InterlinearVerse,
  GreekInterlinearVerse,
  StrongLexiconEntry,
} from '../types';
import { MASORETIC_INTERLINEAR_DATA } from '../data/masoreticData';
import { GREEK_INTERLINEAR_DATA } from '../data/greekData';
import { STRONG_LEXICON_DATABASE } from '../data/strongLexiconData';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchInterlinearPassage(
  bookAbbr: string,
  chapter: number,
  testament: 'OT' | 'NT' = 'OT',
): Promise<{
  hebrewVerses: InterlinearVerse[];
  greekVerses: GreekInterlinearVerse[];
}> {
  const upper = bookAbbr.toUpperCase();

  try {
    const response = await fetch(
      `${API_BASE_URL}/bible/morphology/passage?book=${encodeURIComponent(
        upper,
      )}&chapter=${chapter}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      const tokens = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      if (tokens.length > 0) {
        // Mapear tokens devueltos por el backend agrupados por versículo
        const versesMap = new Map<number, InterlinearVerse | GreekInterlinearVerse>();

        for (const t of tokens) {
          const vNum = t.verse?.verseNumber || 1;
          if (!versesMap.has(vNum)) {
            if (testament === 'NT') {
              versesMap.set(vNum, {
                bookAbbreviation: upper,
                bookName: t.verse?.book?.name || upper,
                chapter,
                verseNumber: vNum,
                language: 'Greek',
                tokens: [],
              });
            } else {
              versesMap.set(vNum, {
                bookAbbreviation: upper,
                bookName: t.verse?.book?.name || upper,
                chapter,
                verseNumber: vNum,
                language: 'Hebrew',
                tokens: [],
              });
            }
          }

          const currentVerse = versesMap.get(vNum)!;
          const isUntranslatableParticle =
            t.strongCode === 'H853' ||
            (t.gloss && t.gloss.startsWith('[') && t.gloss.endsWith(']'));

          const cleanSpanishSpan = isUntranslatableParticle ? '' : (t.gloss || '');
          const cleanGloss =
            t.strongCode === 'H853'
              ? '[acusativo / obj. directo]'
              : (t.gloss || '');
          const cleanPartOfSpeech =
            t.strongCode === 'H853'
              ? 'Partícula Acusativa (Marcador de Objeto Directo)'
              : (t.partOfSpeech || (testament === 'NT' ? 'Palabra Griega' : 'Palabra Hebrea'));

          if (testament === 'NT') {
            (currentVerse as GreekInterlinearVerse).tokens.push({
              id: `${upper}-${chapter}-${vNum}-${t.wordOrder}`,
              order: t.wordOrder,
              greek: t.surfaceText,
              lemma: t.consonantsOnly || t.surfaceText,
              transliteration: t.transliteration || '',
              spanishSpan: cleanSpanishSpan,
              gloss: cleanGloss,
              strong: t.strongCode || '',
              partOfSpeech: cleanPartOfSpeech,
              morphologyCode: t.morphologyCode || '',
              parsingSummary: t.morphologyCode || '',
            });
          } else {
            (currentVerse as InterlinearVerse).tokens.push({
              id: `${upper}-${chapter}-${vNum}-${t.wordOrder}`,
              order: t.wordOrder,
              hebrew: t.surfaceText,
              consonantsOnly: t.consonantsOnly || t.surfaceText,
              transliteration: t.transliteration || '',
              spanishSpan: cleanSpanishSpan,
              gloss: cleanGloss,
              strong: t.strongCode || '',
              language: 'Hebrew',
              partOfSpeech: cleanPartOfSpeech,
              morphologyCode: t.morphologyCode || '',
            });
          }
        }

        const parsedVerses = Array.from(versesMap.values());
        return {
          hebrewVerses: testament === 'OT' ? (parsedVerses as InterlinearVerse[]) : [],
          greekVerses: testament === 'NT' ? (parsedVerses as GreekInterlinearVerse[]) : [],
        };
      }
    }
  } catch {
    // Si la API no está accesible (ej. SSR o modo offline), se usa la caché local de respaldo
  }

  // Fallback seguro a datos de muestra locales
  const fallbackHebrew = MASORETIC_INTERLINEAR_DATA.filter(
    (v) => v.bookAbbreviation.toUpperCase() === upper && v.chapter === chapter,
  );
  const fallbackGreek = GREEK_INTERLINEAR_DATA.filter(
    (v) => v.bookAbbreviation.toUpperCase() === upper && v.chapter === chapter,
  );

  return {
    hebrewVerses:
      fallbackHebrew.length > 0 ? fallbackHebrew : MASORETIC_INTERLINEAR_DATA,
    greekVerses:
      fallbackGreek.length > 0 ? fallbackGreek : GREEK_INTERLINEAR_DATA,
  };
}

export async function fetchStrongLexiconEntry(
  strongCode: string,
): Promise<StrongLexiconEntry> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bible/morphology/lexicon/${encodeURIComponent(strongCode)}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 86400 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      const data = json?.data || json;
      if (data && data.strongCode) {
        return {
          strong: data.strongCode,
          language: data.strongCode.startsWith('H') ? 'Hebrew' : 'Greek',
          lemma: data.lemma,
          transliteration: data.transliteration,
          ipa: `/${data.transliteration}/`,
          pronunciationGuide: data.transliteration,
          partOfSpeech: data.partOfSpeech || 'Entrada Léxica',
          shortDefinition: data.shortDefinition,
          extendedDefinition: [data.extendedDefinition || data.shortDefinition],
          occurrencesInBible: data.occurrencesCount,
        };
      }
    }
  } catch {
    // Fallback local
  }

  const local = STRONG_LEXICON_DATABASE[strongCode];
  if (local) return local;

  return {
    strong: strongCode,
    language: strongCode.startsWith('H') ? 'Hebrew' : 'Greek',
    lemma: strongCode.startsWith('H') ? 'שָׁרָשׁ' : 'λόγος',
    transliteration: strongCode,
    ipa: `/${strongCode}/`,
    pronunciationGuide: strongCode,
    partOfSpeech: 'Entrada Léxica',
    shortDefinition: `Entrada Strong ${strongCode}.`,
    extendedDefinition: [`Definición académica para el código Strong ${strongCode}.`],
  };
}
