import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('portfolio_profiles')
@Index(['language'], { unique: true })
export class PortfolioProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  language: string; // 'es' | 'en'

  @Column()
  fullName: string;

  @Column()
  headline: string;

  @Column()
  location: string;

  @Column()
  email: string;

  @Column()
  availability: string;

  @Column({ type: 'simple-json' })
  bio: string[];

  @Column({ type: 'simple-json' })
  extendedBio: string[];

  @Column({ type: 'text' })
  philosophyQuote: string;

  @Column()
  philosophyVerse: string;

  @Column({ type: 'simple-json' })
  pillars: { title: string; description: string }[];

  @Column({ type: 'simple-json' })
  focusAreas: { title: string; description: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
