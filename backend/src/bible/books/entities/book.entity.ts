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

  @Column({ type: 'simple-enum', enum: ['OT', 'NT'] })
  testament: 'OT' | 'NT';

  @OneToMany(() => Verse, (verse) => verse.book)
  verses: Verse[];
}
