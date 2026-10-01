import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Translation } from '../../translations/entities/translation.entity';

@Entity('verses')
@Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true })
export class Verse {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Book, (book) => book.verses, {
    onDelete: 'CASCADE',
    eager: false,
  })
  book: Book;

  @Index()
  @ManyToOne(() => Translation, (translation) => translation.verses, {
    onDelete: 'CASCADE',
    eager: false,
  })
  translation: Translation;

  @Column()
  chapter: number;

  @Column()
  verseNumber: number;

  @Column('text')
  text: string;
}
