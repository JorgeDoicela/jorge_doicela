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

  @Column({ default: 'Full Stack,AI,DevSecOps' })
  technologies: string;

  @Column({ default: 'es' })
  language: string; // 'es' | 'en'

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ nullable: true })
  demoUrl?: string;

  @Column({ default: true })
  featured: boolean;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
