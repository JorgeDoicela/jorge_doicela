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

@Entity('tutorials')
export class Tutorial {
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
  description: string;

  @Column({ default: 'intermediate' })
  difficulty: TutorialDifficulty;

  @Column({ default: 15 })
  estimatedMinutes: number;

  @Column({ nullable: true })
  prerequisites?: string;

  @Column({ default: 'TypeScript,Node.js' })
  techStack: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'tutorial,guide' })
  tags: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @OneToMany(() => TutorialStep, (step) => step.tutorial, { cascade: true })
  steps: TutorialStep[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
