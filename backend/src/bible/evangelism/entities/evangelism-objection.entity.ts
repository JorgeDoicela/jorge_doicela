import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

export interface KeyVerseItem {
  ref: string;
  text: string;
}

@Entity('evangelism_objections')
export class EvangelismObjectionEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @PrimaryColumn({ length: 10, default: 'es' })
  language: string;

  @Index()
  @Column({ length: 64 })
  category: string;

  @Column({ length: 256 })
  question: string;

  @Column('text')
  summary: string;

  @Column('text')
  biblicalAnswer: string;

  @Column('simple-json')
  keyVerses: KeyVerseItem[];

  @Column('text')
  practicalAdvice: string;
}
