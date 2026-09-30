import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { TutorialStep } from './tutorial-step.entity';

export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TutorialCategory =
  | 'web'
  | 'backend'
  | 'devops'
  | 'mobile'
  | 'ai'
  | 'databases'
  | 'security'
  | 'architecture';

@Entity('tutorials')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderPriority', 'publishedAt'])
@Index(['language', 'category', 'orderPriority', 'publishedAt'])
@Index(['language', 'difficulty', 'orderPriority', 'publishedAt'])
@Index(['language', 'featured', 'orderPriority', 'publishedAt'])
export class Tutorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'intermediate' })
  difficulty: TutorialDifficulty;

  @Column({ default: 'backend' })
  category: TutorialCategory;

  @Column({ nullable: true })
  prerequisites?: string;

  @Column({ default: 'TypeScript,Node.js' })
  techStack: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'tutorial,guide' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

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

  @OneToMany(() => TutorialStep, (step) => step.tutorial, { cascade: true })
  steps: TutorialStep[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
