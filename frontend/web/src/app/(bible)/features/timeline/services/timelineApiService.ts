import { API_URL } from '../../../../config';

export interface ApiTimelineEvent {
  id: string;
  name: string;
  type: string;
  originalName?: {
    hebrew?: string;
    greek?: string;
    transliteration?: string;
    meaning?: string;
  };
  startYearBC: number;
  endYearBC: number;
  kingdom?: string;
  evaluation?: string;
  dynastyOrOrigin?: string;
  contemporaryEntities?: string[];
  biblicalReferences?: string[];
  keyEvents?: string[];
  details?: string;
}

export async function fetchTimelineEvents(
  type?: string,
  fromYearBC?: number,
  toYearBC?: number,
): Promise<ApiTimelineEvent[]> {
  try {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (fromYearBC !== undefined) params.append('from', fromYearBC.toString());
    if (toYearBC !== undefined) params.append('to', toYearBC.toString());

    const res = await fetch(`${API_URL}/bible/historical/timeline?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}
