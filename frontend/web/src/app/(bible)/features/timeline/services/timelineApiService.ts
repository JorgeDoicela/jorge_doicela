import { API_URL } from '../../../../config';
import {
  MonarchData,
  ProphetData,
  WorldEmpireData,
  ArchaeologicalMilestone,
  KingdomType,
  MoralEvaluation,
  ProphetAudience,
  EmpireType,
} from '../types';

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
  language?: string;
}

export interface TimelineDataState {
  monarchs: MonarchData[];
  prophets: ProphetData[];
  empires: WorldEmpireData[];
  milestones: ArchaeologicalMilestone[];
}

export function mapApiEventsToTimelineData(events: ApiTimelineEvent[]): TimelineDataState {
  const monarchs: MonarchData[] = [];
  const prophets: ProphetData[] = [];
  const empires: WorldEmpireData[] = [];
  const milestones: ArchaeologicalMilestone[] = [];

  for (const item of events) {
    if (item.type === 'monarch') {
      monarchs.push({
        id: item.id,
        name: item.name,
        originalName: {
          hebrew: item.originalName?.hebrew || '',
          transliteration: item.originalName?.transliteration || '',
          meaning: item.originalName?.meaning || '',
        },
        kingdom: (item.kingdom as KingdomType) || 'judah',
        startYearBC: item.startYearBC,
        endYearBC: item.endYearBC,
        reignDurationYears: Math.abs(item.startYearBC - item.endYearBC),
        evaluation: (item.evaluation as MoralEvaluation) || 'mixed',
        dynasty: item.dynastyOrOrigin || undefined,
        prophetsContemporary: item.contemporaryEntities || [],
        foreignRulersContemporary: [],
        biblicalReferences: item.biblicalReferences || [],
        keyEvents: item.keyEvents || [],
        archaeologicalCorroboration: item.details || undefined,
      });
    } else if (item.type === 'prophet') {
      const isIsrael = item.kingdom === 'israel';
      prophets.push({
        id: item.id,
        name: item.name,
        originalName: {
          hebrew: item.originalName?.hebrew || '',
          transliteration: item.originalName?.transliteration || '',
          meaning: item.originalName?.meaning || '',
        },
        startYearBC: item.startYearBC,
        endYearBC: item.endYearBC,
        audience: (item.kingdom as ProphetAudience) || 'judah',
        kingsContemporaryJudah: isIsrael ? [] : (item.contemporaryEntities || []),
        kingsContemporaryIsrael: isIsrael ? (item.contemporaryEntities || []) : [],
        biblicalBook: item.biblicalReferences?.[0],
        keyMessage: item.details || '',
        keyPassages: item.biblicalReferences || [],
      });
    } else if (item.type === 'empire') {
      let empireType: EmpireType = 'assyria';
      const idLower = item.id.toLowerCase();
      if (idLower.includes('nebuchadnezzar') || idLower.includes('babylon')) {
        empireType = 'babylon';
      } else if (idLower.includes('cyrus') || idLower.includes('persia')) {
        empireType = 'persia';
      } else if (idLower.includes('egypt') || idLower.includes('shishak')) {
        empireType = 'egypt';
      } else if (idLower.includes('rome') || idLower.includes('tiberius') || idLower.includes('caesar')) {
        empireType = 'rome';
      } else if (idLower.includes('greece') || idLower.includes('alexander')) {
        empireType = 'greece';
      }

      const rulerMatch = item.name.match(/\(([^)]+)\)/);
      const rulerName = rulerMatch ? rulerMatch[1] : item.name;

      empires.push({
        id: item.id,
        name: item.name,
        rulerName,
        empire: empireType,
        startYearBC: item.startYearBC,
        endYearBC: item.endYearBC,
        interactionWithBiblicalHistory: item.details || '',
        biblicalReferences: item.biblicalReferences || [],
        archaeologicalArtifacts: item.keyEvents || [],
      });
    } else if (item.type === 'milestone') {
      milestones.push({
        id: item.id,
        yearBC: item.startYearBC,
        isAD: item.startYearBC < 0,
        title: item.name,
        location: item.dynastyOrOrigin || '',
        biblicalReference: item.biblicalReferences?.[0] || '',
        artifactFound: item.name,
        museumLocation: item.dynastyOrOrigin || '',
        significance: item.details || '',
        historicalEra: item.keyEvents?.[0] || '',
      });
    }
  }

  return { monarchs, prophets, empires, milestones };
}

export async function fetchTimelineEvents(
  type?: string,
  fromYearBC?: number,
  toYearBC?: number,
  lang: string = 'es',
): Promise<ApiTimelineEvent[]> {
  try {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (fromYearBC !== undefined) params.append('from', fromYearBC.toString());
    if (toYearBC !== undefined) params.append('to', toYearBC.toString());
    if (lang) params.append('lang', lang);

    const res = await fetch(`${API_URL}/bible/historical/timeline?${params.toString()}`);
    if (!res.ok) return [];

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return data;
  } catch {
    return [];
  }
}

