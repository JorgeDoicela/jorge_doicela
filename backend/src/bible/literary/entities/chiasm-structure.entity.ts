import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('chiasm_structures')
export class ChiasmStructureEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @PrimaryColumn({ length: 8, default: 'es' })
  language: string;

  @Index()
  @Column({ length: 16 })
  bookAbbreviation: string;

  @Column({ length: 64 })
  bookName: string;

  @Column({ length: 64 })
  passageRef: string;

  @Column({ length: 256 })
  title: string;

  @Column('text')
  description: string;

  @Index()
  @Column({ length: 64 })
  literaryCategory: string;

  @Column('text')
  focalMessage: string;

  @Column('simple-json')
  cola: {
    id: string;
    label: string;
    matchingPairId?: string;
    verseRef: string;
    text: string;
    textSpanish?: string;
    textHebrew?: string;
    isFocalCenter?: boolean;
    parallelismType?: string;
    theologicalNote?: string;
  }[];
}
