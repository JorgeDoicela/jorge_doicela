import { API_URL } from '../../../../config';
import { ChiasmStructure, PaulinePassageDiscourse } from '../types';

export async function fetchChiasms(
  lang: string = 'es',
  book?: string,
): Promise<ChiasmStructure[]> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);
    if (book) params.append('book', book);

    const res = await fetch(`${API_URL}/bible/literary/chiasms?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}

export async function fetchChiasmById(
  id: string,
  lang: string = 'es',
): Promise<ChiasmStructure | null> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/literary/chiasms/${id}?${params.toString()}`);
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}

export async function fetchPaulineDiscourses(
  lang: string = 'es',
  epistle?: string,
): Promise<PaulinePassageDiscourse[]> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);
    if (epistle) params.append('epistle', epistle);

    const res = await fetch(`${API_URL}/bible/literary/pauline?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}

export async function fetchPaulineDiscourseById(
  id: string,
  lang: string = 'es',
): Promise<PaulinePassageDiscourse | null> {
  try {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/literary/pauline/${id}?${params.toString()}`);
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}
