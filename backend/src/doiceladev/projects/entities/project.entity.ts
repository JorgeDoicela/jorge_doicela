import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type ProjectStatus = 'active' | 'archived' | 'wip';
export type ProjectCategory =
  | 'web'
  | 'backend'
  | 'mobile'
  | 'devops'
  | 'ai'
  | 'open_source'
  | 'tool';

@Entity('projects')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderPriority', 'publishedAt'])
@Index(['language', 'category', 'orderPriority', 'publishedAt'])
@Index(['language', 'status', 'orderPriority', 'publishedAt'])
@Index(['language', 'featured', 'orderPriority', 'publishedAt'])
export class Project {
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

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'web' })
  category: ProjectCategory;

  @Column()
  techStack: string;

  @Column({ default: 'project,open-source' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ nullable: true })
  liveUrl?: string;

  @Column({ default: 'active' })
  status: ProjectStatus;

  @Column({ default: 'left' })
  metaAlign: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  orderPriority: number;

  @Column({ default: 0 })
  stars: number;

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
