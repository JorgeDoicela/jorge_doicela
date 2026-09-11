import { API_URL } from '../../../../config';
import { AncientPlace } from '../types';

export async function fetchAtlasPlaces(
  category?: string,
  query?: string,
  lang: string = 'es',
): Promise<AncientPlace[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query && query.trim()) params.append('q', query.trim());
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/historical/atlas/places?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}
