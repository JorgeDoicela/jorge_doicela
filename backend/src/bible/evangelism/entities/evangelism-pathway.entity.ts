import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

export interface EvangelismStepData {
  order: number;
  title: string;
  reference: string;
  verseText: string;
  exposition: string;
  reflectionQuestion?: string;
  actionCall?: string;
}

@Entity('evangelism_pathways')
export class EvangelismPathwayEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @PrimaryColumn({ length: 10, default: 'es' })
  language: string;

  @Index()
  @Column({ length: 64 })
  slug: string;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 256, nullable: true })
  subtitle: string;

  @Column('text')
  description: string;

  @Column({ length: 128, nullable: true })
  theologicalFocus: string;

  @Column('simple-json')
  steps: EvangelismStepData[];
}
