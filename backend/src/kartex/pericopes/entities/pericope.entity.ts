import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('pericopes')
@Index(['book', 'chapter', 'startVerse'], { unique: true })
export class Pericope {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Book, {
    onDelete: 'CASCADE',
    eager: false,
  })
  book: Book;

  @Column()
  chapter: number;

  @Column()
  startVerse: number;

  @Column({ nullable: true })
  endVerse?: number;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  titleEn?: string;

  @Column({ default: 0 })
  orderIndex: number;
}
