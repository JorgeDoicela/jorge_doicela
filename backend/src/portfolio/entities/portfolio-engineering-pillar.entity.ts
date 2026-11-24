import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type EngineeringDomainType = 'cloud' | 'security' | 'systems' | 'ai';

@Entity('portfolio_engineering_pillars')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'domain', 'orderIndex'])
export class PortfolioEngineeringPillar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ default: 'es' })
  language: string; // 'es' | 'en'

  @Column()
  domain: EngineeringDomainType;

  @Column()
  title: string;

  @Column({ nullable: true })
  badge?: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'simple-json', nullable: true })
  details?: string[];

  @Column({ type: 'simple-json', nullable: true })
  metrics?: { label: string; value: string }[];

  @Column({ type: 'simple-json', nullable: true })
  technologies?: string[];

  @Column({ default: true })
  featured: boolean;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
