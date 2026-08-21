import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('news_articles')
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
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

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'news,tech' })
  tags: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 4 })
  readTimeMinutes: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
