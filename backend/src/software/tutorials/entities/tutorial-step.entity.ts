import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tutorial } from './tutorial.entity';

@Entity('tutorial_steps')
export class TutorialStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  tutorialId: number;

  @Column({ default: 1 })
  stepOrder: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ type: 'text', nullable: true })
  codeSnippet?: string;

  @Column({ default: 'typescript' })
  codeLanguage: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.steps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutorialId' })
  tutorial: Tutorial;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
