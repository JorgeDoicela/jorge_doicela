import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type StackCategoryType =
  | 'frontend'
  | 'backend'
  | 'data_devops'
  | 'ai_security'
  | 'tools';

@Entity('portfolio_stack_items')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'category', 'orderIndex'])
export class PortfolioStackItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ default: 'es' })
  language: string; // 'es' | 'en'

  @Column()
  category: StackCategoryType;

  @Column()
  name: string;

  @Column({ nullable: true })
  level?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ default: true })
  featured: boolean;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
