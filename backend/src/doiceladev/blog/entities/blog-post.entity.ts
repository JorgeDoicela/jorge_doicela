import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type BlogCategory =
  | 'lessons'
  | 'postmortems'
  | 'opinion'
  | 'career'
  | 'journal';

@Entity('blog_posts')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderPriority', 'publishedAt'])
@Index(['language', 'category', 'orderPriority', 'publishedAt'])
@Index(['language', 'series', 'orderPriority', 'publishedAt'])
@Index(['language', 'featured', 'orderPriority', 'publishedAt'])
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'opinion' })
  category: BlogCategory;

  @Column({ default: 'architecture,clean-code' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ default: 'left' })
  metaAlign: string;

  @Column({ nullable: true })
  series?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  orderPriority: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
