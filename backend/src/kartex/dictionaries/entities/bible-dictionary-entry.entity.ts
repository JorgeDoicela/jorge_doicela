import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

export interface BiblicalReferenceItem {
  reference: string;
  context: string;
}

@Entity('bible_dictionary_entries')
@Index(['normalizedTerm', 'language'])
@Index(['dictionaryId', 'letter', 'language'])
@Index(['category', 'language'])
export class BibleDictionaryEntryEntity {
  @PrimaryColumn({ length: 128 })
  id: string;

  @PrimaryColumn({ length: 8, default: 'es' })
  language: string;

  @Index()
  @Column({ length: 64 })
  dictionaryId: string;

  @Column({ length: 256 })
  term: string;

  @Index()
  @Column({ length: 256 })
  normalizedTerm: string;

  @Index()
  @Column({ length: 4 })
  letter: string;

  @Index()
  @Column({ length: 64 })
  category: string;

  @Column({ type: 'text', nullable: true })
  etymology: string | null;

  @Column('text')
  definitionMarkdown: string;

  @Column('simple-json', { nullable: true })
  biblicalReferences: BiblicalReferenceItem[];

  @Column('simple-json', { nullable: true })
  relatedTerms: string[];

  @CreateDateColumn()
  createdAt: Date;
}
