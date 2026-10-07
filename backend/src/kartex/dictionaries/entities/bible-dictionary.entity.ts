import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('bible_dictionaries')
@Index(['slug', 'language'], { unique: true })
export class BibleDictionaryEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @PrimaryColumn({ length: 8, default: 'es' })
  language: string;

  @Column({ length: 64 })
  slug: string;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 128 })
  author: string;

  @Column({ length: 128 })
  era: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'integer', default: 0 })
  entriesCount: number;

  @Column({ length: 256 })
  theologicalFocus: string;

  @Column('text')
  description: string;

  @Column({ length: 128, default: 'Dominio Público Universal' })
  license: string;
}
