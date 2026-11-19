import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type NewsCategory =
  | 'frameworks'
  | 'cloud'
  | 'ai'
  | 'devops'
  | 'security'
  | 'web'
  | 'tools'
  | 'databases';

@Entity('news_articles')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'category', 'orderPriority', 'publishedAt'])
@Index(['language', 'orderPriority', 'publishedAt'])
@Index(['language', 'featured', 'orderPriority', 'publishedAt'])
@Index(['language', 'isBreaking', 'orderPriority', 'publishedAt'])
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ nullable: true })
  sourceUrl?: string;

  @Column({ default: false })
  isBreaking: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  orderPriority: number;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'frameworks' })
  category: NewsCategory;

  @Column({ default: 'news,tech' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ default: 'left' })
  metaAlign: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
