import { API_URL } from '../../../../config';
import { MorphologicalTokenResult } from '../types';

export interface GrammarSearchParams {
  query?: string;
  book?: string;
  strongCode?: string;
  morphologyCode?: string;
  limit?: number;
}

export async function searchGrammarTokens(
  params: GrammarSearchParams,
): Promise<MorphologicalTokenResult[]> {
  try {
    const urlParams = new URLSearchParams();
    if (params.query) urlParams.append('q', params.query);
    if (params.book) urlParams.append('book', params.book);
    if (params.strongCode) urlParams.append('strong', params.strongCode);
    if (params.morphologyCode) urlParams.append('morph', params.morphologyCode);
    if (params.limit) urlParams.append('limit', params.limit.toString());

    const res = await fetch(`${API_URL}/bible/morphology/tokens/search?${urlParams.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const rawTokens = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    if (rawTokens.length === 0) return [];

    return rawTokens.map((t: any) => ({
      id: t.id ? `tok-${t.id}` : `tok-${t.verse?.id || 1}-${t.wordOrder || 1}`,
      bookAbbr: t.verse?.book?.abbreviation || params.book || 'GEN',
      bookName: t.verse?.book?.name || 'Génesis',
      chapter: t.verse?.chapter || 1,
      verseNumber: t.verse?.verseNumber || 1,
      wordOriginal: t.surfaceText || '',
      lemma: t.lemma || t.surfaceText || '',
      transliteration: t.transliteration || '',
      gloss: t.gloss || '',
      strong: t.strongCode || '',
      language: (t.strongCode || '').startsWith('G') ? 'Griego' : 'Hebreo',
      partOfSpeech: t.morphologyCode?.startsWith('V-') ? 'Verbo' : t.morphologyCode?.startsWith('N-') ? 'Sustantivo' : 'Partícula',
      tense: 'Indeterminado',
      morphologyCode: t.morphologyCode || '',
      parsingSummary: `${t.morphologyCode || 'Morfología'} [${t.gloss || ''}]`,
      fullVerseContext: {
        originalText: t.verse?.text || t.surfaceText || '',
        spanishText: t.gloss || '',
      },
    }));
  } catch {
    return [];
  }
}
