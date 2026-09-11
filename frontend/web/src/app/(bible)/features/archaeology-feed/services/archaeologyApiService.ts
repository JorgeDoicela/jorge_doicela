import { API_URL } from '../../../../config';
import { ArchaeologyArticle } from '../types';

export async function fetchArchaeologyArticles(
  category?: string,
  query?: string,
  lang: string = 'es',
): Promise<ArchaeologyArticle[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query && query.trim()) params.append('q', query.trim());
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/historical/articles?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}

export async function fetchArchaeologyArticleBySlug(
  slug: string,
  lang: string = 'es',
): Promise<ArchaeologyArticle | null> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/historical/articles/${slug}?${params.toString()}`);
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}
