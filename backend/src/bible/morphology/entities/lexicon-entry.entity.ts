import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('lexicon_entries')
export class LexiconEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 10 })
  strongCode: string; // Ej: 'H7225', 'G3056'

  @Column({ length: 20 })
  language: 'Hebrew' | 'Aramaic' | 'Greek';

  @Column({ length: 100 })
  lemma: string; // Ej: 'בְּרֵאשִׁית', 'λόγος'

  @Column({ length: 100 })
  transliteration: string; // Ej: 'bərē’šîṯ', 'logos'

  @Column({ length: 50, nullable: true })
  ipa: string; // Pronunciación fonética IPA

  @Column({ length: 100 })
  partOfSpeech: string; // Sustantivo, Verbo, etc.

  @Column('text')
  shortDefinition: string;

  @Column('text', { nullable: true })
  extendedDefinition: string; // Referencias BDB, Gesenius, Thayer
}
