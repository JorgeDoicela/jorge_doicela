export type KingdomType = 'united' | 'judah' | 'israel';

export type MoralEvaluation = 'good' | 'bad' | 'mixed';

export type ProphetAudience = 'judah' | 'israel' | 'nineveh' | 'babylon' | 'post_exile';

export type EmpireType = 'egypt' | 'assyria' | 'babylon' | 'persia' | 'greece' | 'rome';

export type TimelineTrackId = 'kings_judah' | 'kings_israel' | 'prophets' | 'empires' | 'milestones';

export interface MonarchData {
  id: string;
  name: string;
  originalName: {
    hebrew: string;
    transliteration: string;
    meaning: string;
  };
  kingdom: KingdomType;
  startYearBC: number; // Años a.C. expresados como número positivo (ej. 930)
  endYearBC: number;
  reignDurationYears: number;
  evaluation: MoralEvaluation;
  dynasty?: string;
  prophetsContemporary: string[];
  foreignRulersContemporary: string[];
  biblicalReferences: string[];
  keyEvents: string[];
  archaeologicalCorroboration?: string;
}

export interface ProphetData {
  id: string;
  name: string;
  originalName: {
    hebrew: string;
    transliteration: string;
    meaning: string;
  };
  startYearBC: number;
  endYearBC: number;
  audience: ProphetAudience;
  kingsContemporaryJudah: string[];
  kingsContemporaryIsrael: string[];
  biblicalBook?: string;
  keyMessage: string;
  keyPassages: string[];
}

export interface WorldEmpireData {
  id: string;
  name: string;
  rulerName: string;
  empire: EmpireType;
  startYearBC: number;
  endYearBC: number;
  interactionWithBiblicalHistory: string;
  biblicalReferences: string[];
  archaeologicalArtifacts: string[];
}

export interface ArchaeologicalMilestone {
  id: string;
  yearBC: number; // o negativo para d.C.
  isAD?: boolean;
  title: string;
  location: string;
  biblicalReference: string;
  artifactFound: string;
  museumLocation: string;
  significance: string;
  historicalEra: string;
}

export type TimelineSelectedItem =
  | { type: 'monarch'; data: MonarchData }
  | { type: 'prophet'; data: ProphetData }
  | { type: 'empire'; data: WorldEmpireData }
  | { type: 'milestone'; data: ArchaeologicalMilestone };
