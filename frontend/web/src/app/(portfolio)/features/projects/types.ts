export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  language: string;
  repoUrl?: string;
  demoUrl?: string;
  featured: boolean;
  overview?: string;
  challenge?: string;
  architectureHighlights?: string[];
  metrics?: ProjectMetric[];
  media?: ProjectMedia[];
}

export type ProjectSlideKind =
  | 'overview'
  | 'challenge'
  | 'architecture'
  | 'stack-telemetry'
  | 'media';

interface ProjectSlideBase {
  id: string;
  kind: ProjectSlideKind;
  shortLabelKey: string;
  titleKey: string;
}

export interface OverviewSlide extends ProjectSlideBase {
  kind: 'overview';
  role: string;
  content: string;
  summary: string;
}

export interface ChallengeSlide extends ProjectSlideBase {
  kind: 'challenge';
  content: string;
}

export interface ArchitectureSlide extends ProjectSlideBase {
  kind: 'architecture';
  highlights: string[];
}

export interface StackTelemetrySlide extends ProjectSlideBase {
  kind: 'stack-telemetry';
  technologies: string[];
  metrics: ProjectMetric[];
}

export interface MediaSlide extends ProjectSlideBase {
  kind: 'media';
  media: ProjectMedia;
  mediaIndex: number;
  mediaTotal: number;
}

export type ProjectSlide =
  | OverviewSlide
  | ChallengeSlide
  | ArchitectureSlide
  | StackTelemetrySlide
  | MediaSlide;
