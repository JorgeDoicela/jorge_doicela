import { API_URL } from '../../../../config';
import { HebrewLexiconEntry, GreekLexiconEntry } from '../types';

export async function fetchLexiconEntry(strongCode: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/bible/morphology/lexicon/${encodeURIComponent(strongCode)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json;
  } catch {
    return null;
  }
}

export async function searchLexiconEntries(
  query: string,
  language: 'hebrew' | 'greek' | 'all' = 'all',
  limit: number = 30,
): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (language !== 'all') params.append('lang', language);
    params.append('limit', limit.toString());

    const res = await fetch(`${API_URL}/bible/morphology/lexicon?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}
