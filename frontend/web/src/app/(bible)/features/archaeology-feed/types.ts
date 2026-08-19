export type ArticleCategory =
  | 'recent_discoveries'
  | 'manuscripts_epigraphy'
  | 'apologetics_reliability';

export type GeographicRegion =
  | 'all'
  | 'jerusalem_judea'
  | 'galilee_samaria'
  | 'jordan_dead_sea'
  | 'egypt_sinai'
  | 'turkey_asia_minor'
  | 'greece_rome';

export interface EpigraphicTranscription {
  originalScript: string;
  language: string; // 'Paleohebreo' | 'Arameo' | 'Griego Koiné' | 'Latín'
  transliteration: string;
  translation: string;
  dateEstimate: string;
}

export interface ArchaeologyArticle {
  id: string;
  title: string;
  slug: string;
  category: ArticleCategory;
  region: GeographicRegion;
  regionLabel: string;
  publishDate: string;
  institutionOrAuthor: string;
  readTimeMinutes: number;
  summary: string;
  contentMarkdown: string;
  biblicalReferences: {
    reference: string;
    context: string;
  }[];
  epigraphy?: EpigraphicTranscription;
  museumOrLocation: string;
  keyArtifact: string;
  tags: string[];
}
