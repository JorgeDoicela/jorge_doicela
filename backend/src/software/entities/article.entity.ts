import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ArticleCategory =
  | 'news'
  | 'blog'
  | 'ai'
  | 'cybersecurity'
  | 'tutorial';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'news' })
  category: ArticleCategory;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'software,tech' })
  tags: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 5 })
  readTimeMinutes: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
