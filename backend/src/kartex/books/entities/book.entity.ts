import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Verse } from '../../verses/entities/verse.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  abbreviation: string;

  @Column({ type: 'integer', default: 1 })
  @Index({ unique: true })
  order: number; // Número canónico 1–66 (Génesis=1, Apocalipsis=66)

  @Index()
  @Column({ type: 'simple-enum', enum: ['OT', 'NT'] })
  testament: 'OT' | 'NT';

  @OneToMany(() => Verse, (verse) => verse.book)
  verses: Verse[];
}
