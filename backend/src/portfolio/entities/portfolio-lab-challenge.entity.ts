import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type LabCategoryType = 'ctf' | 'linux' | 'security' | 'networking';
export type LabDifficultyType = 'easy' | 'medium' | 'hard';
export type LabTargetModeType = 'simulated' | 'sandbox';

@Entity('portfolio_lab_challenges')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderIndex'])
export class PortfolioLabChallenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ default: 'es' })
  language: string; // 'es' | 'en'

  @Column({ default: 'ctf' })
  category: LabCategoryType;

  @Column({ default: 'easy' })
  difficulty: LabDifficultyType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  briefing: string;

  @Column({ type: 'text' })
  hint: string;

  @Column({ default: 100 })
  points: number;

  @Column({ default: 'simulated' })
  targetMode: LabTargetModeType;

  /**
   * Hash SHA-256 de la flag esperada. Nunca se expone en consultas GET públicas (select: false).
   */
  @Column({ select: false })
  flagHash: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
