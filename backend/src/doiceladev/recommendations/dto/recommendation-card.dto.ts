export class RecommendationCardDto {
  id: string;
  href: string;
  title: string;
  category: string;
  categoryMeta: string;
  excerpt?: string | null;
  coverImage?: string;
  tag?: string;
  score: number;
}
