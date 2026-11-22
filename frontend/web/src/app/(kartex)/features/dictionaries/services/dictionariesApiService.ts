import { API_URL } from '../../../../config';
import {
  BibleDictionary,
  BibleDictionaryEntry,
  LetterCount,
  SearchEntriesResult,
} from '../types';

/**
 * Consulta el catálogo de diccionarios bíblicos disponibles
 */
export async function fetchDictionaries(
  locale: string = 'es',
  signal?: AbortSignal,
): Promise<BibleDictionary[]> {
  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries?lang=${locale}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

/**
 * Consulta el detalle y ficha de un diccionario por ID o slug
 */
export async function fetchDictionaryById(
  id: string,
  locale: string = 'es',
  signal?: AbortSignal,
): Promise<BibleDictionary | null> {
  try {
    const res = await fetch(
      `${API_URL}/kartex/dictionaries/${encodeURIComponent(id)}?lang=${locale}`,
      {
        headers: { Accept: 'application/json' },
        signal,
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? (json?.id ? json : null);
  } catch {
    return null;
  }
}

/**
 * Búsqueda paginada indexada de entradas de diccionario con FTS5
 */
export async function searchDictionaryEntries(
  params: {
    dictionaryId?: string;
    letter?: string;
    category?: string;
    q?: string;
    page?: number;
    limit?: number;
    lang?: string;
  },
  signal?: AbortSignal,
): Promise<SearchEntriesResult> {
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
      signal,
    });
    if (!res.ok) {
      return { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
    }
    const json = await res.json();
    const raw = json?.data ?? json;
    return raw?.items
      ? raw
      : { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
  } catch {
    return { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
  }
}

/**
 * Consulta el detalle completo de una entrada por su ID
 */
export async function fetchDictionaryEntryById(
  id: string,
  locale: string = 'es',
  signal?: AbortSignal,
): Promise<BibleDictionaryEntry | null> {
  try {
    const res = await fetch(
      `${API_URL}/kartex/dictionaries/entries/${encodeURIComponent(id)}?lang=${locale}`,
      {
        headers: { Accept: 'application/json' },
        signal,
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? (json?.id ? json : null);
  } catch {
    return null;
  }
}

/**
 * Consulta las letras alfabéticas A-Z con conteo de términos
 */
export async function fetchAvailableLetters(
  dictionaryId?: string,
  locale: string = 'es',
  category?: string,
  signal?: AbortSignal,
): Promise<LetterCount[]> {
  const query = new URLSearchParams();
  if (dictionaryId && dictionaryId !== 'all') {
    query.set('dictionaryId', dictionaryId);
  }
  if (category && category !== 'all') {
    query.set('category', category);
  }
  query.set('lang', locale);

  try {
    const res = await fetch(`${API_URL}/kartex/dictionaries/letters?${query.toString()}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

/**
 * Búsqueda transversal multiautor para cotejo comparativo de un término
 */
export async function lookupDictionaryTerm(
  term: string,
  locale: string = 'es',
  signal?: AbortSignal,
): Promise<BibleDictionaryEntry[]> {
  try {
    const res = await fetch(
      `${API_URL}/kartex/dictionaries/lookup/${encodeURIComponent(term)}?lang=${locale}`,
      {
        headers: { Accept: 'application/json' },
        signal,
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}
