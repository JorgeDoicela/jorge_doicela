import { API_URL } from '../../../../config';
import {
  EvangelismPathway,
  EvangelismObjection,
  EvangelismTract,
} from '../types';

export async function fetchEvangelismPathways(
  lang: string = 'es',
): Promise<EvangelismPathway[]> {
  try {
    const res = await fetch(`${API_URL}/bible/evangelism/pathways?lang=${encodeURIComponent(lang)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function fetchEvangelismPathwayBySlug(
  slug: string,
  lang: string = 'es',
): Promise<EvangelismPathway | null> {
  try {
    const res = await fetch(
      `${API_URL}/bible/evangelism/pathways/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}

export async function fetchEvangelismObjections(
  category?: string,
  query?: string,
  lang: string = 'es',
): Promise<EvangelismObjection[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query && query.trim()) params.append('q', query.trim());
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/evangelism/objections?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function fetchEvangelismTracts(
  audience?: string,
  lang: string = 'es',
): Promise<EvangelismTract[]> {
  try {
    const params = new URLSearchParams();
    if (audience && audience !== 'all') params.append('audience', audience);
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/evangelism/tracts?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function fetchEvangelismTractBySlug(
  slug: string,
  lang: string = 'es',
): Promise<EvangelismTract | null> {
  try {
    const res = await fetch(
      `${API_URL}/bible/evangelism/tracts/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}
