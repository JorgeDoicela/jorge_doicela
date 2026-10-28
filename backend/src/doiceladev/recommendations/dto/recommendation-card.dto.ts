export class RecommendationCardDto {
  id: string;
  href: string;
  title: string;
  category: string;
  categoryMeta: string;
  coverImage?: string;
  tag?: string;
  score: number;
}
