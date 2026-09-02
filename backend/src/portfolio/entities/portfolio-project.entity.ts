import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('portfolio_projects')
@Index(['slug', 'language'], { unique: true })
export class PortfolioProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  role: string;

  @Column({ type: 'simple-json', default: '[]' })
  technologies: string[];

  @Column({ default: 'es' })
  language: string; // 'es' | 'en'

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ nullable: true })
  demoUrl?: string;

  @Column({ default: true })
  featured: boolean;

  @Column({ type: 'text', nullable: true })
  overview?: string;

  @Column({ type: 'text', nullable: true })
  challenge?: string;

  @Column({ type: 'simple-json', nullable: true })
  architectureHighlights?: string[];

  @Column({ type: 'simple-json', nullable: true })
  metrics?: { label: string; value: string }[];

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
