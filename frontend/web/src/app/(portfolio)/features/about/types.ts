export interface ProfilePillar {
  title: string;
  description: string;
}

export interface PortfolioProfileData {
  id: number;
  language: string;
  fullName: string;
  headline: string;
  location: string;
  email: string;
  availability: string;
  bio: string[];
  extendedBio: string[];
  philosophyQuote: string;
  philosophyVerse: string;
  pillars: ProfilePillar[];
  focusAreas: ProfilePillar[];
}
