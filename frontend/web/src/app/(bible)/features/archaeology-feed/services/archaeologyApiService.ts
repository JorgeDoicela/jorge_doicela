import { API_URL } from '../../../../config';
import { ArchaeologyArticle } from '../types';

export async function fetchArchaeologyArticles(
  category?: string,
  query?: string,
): Promise<ArchaeologyArticle[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query && query.trim()) params.append('q', query.trim());

    const res = await fetch(`${API_URL}/bible/historical/articles?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}
