import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('portfolio_experiences')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'type', 'orderIndex'])
export class PortfolioExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ default: 'es' })
  language: string; // 'es' | 'en'

  @Column({ default: 'work' })
  type: 'work' | 'education' | 'certification';

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column({ nullable: true })
  period?: string;

  @Column({ nullable: true })
  companyUrl?: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  highlights?: string[];

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
