import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('commentary_entries')
@Index(['bookId', 'chapter', 'verseStart', 'verseEnd'])
@Index(['authorId', 'language'])
export class CommentaryEntryEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @PrimaryColumn({ length: 8, default: 'es' })
  language: string;

  @Index()
  @Column({ length: 64 })
  authorId: string;

  @Index()
  @Column({ length: 16 })
  bookId: string;

  @Index()
  @Column({ type: 'integer' })
  chapter: number;

  @Column({ type: 'integer' })
  verseStart: number;

  @Column({ type: 'integer', nullable: true })
  verseEnd: number;

  @Column({ length: 256 })
  title: string;

  @Column('text')
  contentMarkdown: string;

  @Column('simple-json', { nullable: true })
  tags: string[];
}
