export type LabCategoryType = 'ctf' | 'linux' | 'security' | 'networking';
export type LabDifficultyType = 'easy' | 'medium' | 'hard';
export type LabTargetModeType = 'simulated' | 'sandbox';

export interface PortfolioLabChallenge {
  id: number;
  slug: string;
  language: string;
  category: LabCategoryType;
  difficulty: LabDifficultyType;
  title: string;
  briefing: string;
  hint: string;
  points: number;
  targetMode: LabTargetModeType;
  active: boolean;
  orderIndex: number;
}

export interface VerifyFlagResponse {
  slug: string;
  valid: boolean;
  pointsAwarded: number;
}
