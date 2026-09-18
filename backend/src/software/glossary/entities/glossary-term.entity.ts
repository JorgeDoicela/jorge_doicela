import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('glossary_terms')
@Index(['term', 'language'], { unique: true })
@Index(['language', 'orderPriority'])
export class GlossaryTerm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  term: string;

  @Column({ nullable: true })
  aliases: string;

  @Column({ default: 'general' })
  category: string;

  @Column({ type: 'text' })
  shortDefinition: string;

  @Column({ type: 'text', nullable: true })
  keyDifference: string;

  @Column({ default: false })
  caseSensitive: boolean;

  @Column({ length: 5, default: 'es' })
  language: string;

  @Column({ default: 0 })
  orderPriority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
