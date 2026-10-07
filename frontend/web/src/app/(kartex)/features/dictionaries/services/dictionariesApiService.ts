import { API_URL } from '../../../../config';
import {
  BibleDictionary,
  BibleDictionaryEntry,
  LetterCount,
  SearchEntriesResult,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Consulta el catálogo de diccionarios bíblicos disponibles
 */
export async function fetchDictionaries(locale: string = 'es'): Promise<BibleDictionary[]> {
  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries?lang=${locale}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json: ApiResponse<BibleDictionary[]> = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('[DictionariesApi] Error al obtener diccionarios:', err);
    return [];
  }
}

/**
 * Consulta el detalle y ficha de un diccionario por ID o slug
 */
export async function fetchDictionaryById(
  id: string,
  locale: string = 'es',
): Promise<BibleDictionary | null> {
  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries/${encodeURIComponent(id)}?lang=${locale}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json: ApiResponse<BibleDictionary> = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error(`[DictionariesApi] Error al obtener diccionario ${id}:`, err);
    return null;
  }
}

/**
 * Búsqueda paginada indexada de entradas de diccionario
 */
export async function searchDictionaryEntries(params: {
  dictionaryId?: string;
  letter?: string;
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
  lang?: string;
}): Promise<SearchEntriesResult> {
  const query = new URLSearchParams();
  if (params.dictionaryId && params.dictionaryId !== 'all') {
    query.set('dictionaryId', params.dictionaryId);
  }
  if (params.letter && params.letter !== 'all') {
    query.set('letter', params.letter);
  }
  if (params.category && params.category !== 'all') {
    query.set('category', params.category);
  }
  if (params.q && params.q.trim()) {
    query.set('q', params.q.trim());
  }
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  query.set('lang', params.lang || 'es');

  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries/entries?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
    }
    const json: ApiResponse<SearchEntriesResult> = await res.json();
    return json.success && json.data
      ? json.data
      : { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
  } catch (err) {
    console.error('[DictionariesApi] Error en búsqueda de entradas:', err);
    return { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
  }
}

/**
 * Consulta el detalle completo de una entrada por su ID
 */
export async function fetchDictionaryEntryById(
  id: string,
  locale: string = 'es',
): Promise<BibleDictionaryEntry | null> {
  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries/entries/${encodeURIComponent(id)}?lang=${locale}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json: ApiResponse<BibleDictionaryEntry> = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error(`[DictionariesApi] Error al obtener entrada ${id}:`, err);
    return null;
  }
}

/**
 * Consulta las letras alfabéticas A-Z con conteo de términos
 */
export async function fetchAvailableLetters(
  dictionaryId?: string,
  locale: string = 'es',
): Promise<LetterCount[]> {
  const query = new URLSearchParams();
  if (dictionaryId && dictionaryId !== 'all') {
    query.set('dictionaryId', dictionaryId);
  }
  query.set('lang', locale);

  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries/letters?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const json: ApiResponse<LetterCount[]> = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('[DictionariesApi] Error al obtener letras:', err);
    return [];
  }
}

/**
 * Búsqueda transversal multiautor para cotejo comparativo de un término
 */
export async function lookupDictionaryTerm(
  term: string,
  locale: string = 'es',
): Promise<BibleDictionaryEntry[]> {
  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries/lookup/${encodeURIComponent(term)}?lang=${locale}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const json: ApiResponse<BibleDictionaryEntry[]> = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error(`[DictionariesApi] Error en lookup de ${term}:`, err);
    return [];
  }
}
