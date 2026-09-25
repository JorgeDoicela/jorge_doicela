import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
@Index(['language', 'orderPriority', 'stars'])
@Index(['language', 'category', 'orderPriority', 'stars'])
@Index(['language', 'status', 'orderPriority', 'stars'])
@Index(['language', 'featured', 'orderPriority', 'stars'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'web' })
  category: ProjectCategory;

  @Column()
  techStack: string;

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

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  orderPriority: number;

  @Column({ default: 0 })
  stars: number;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  architectureDiagramUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
