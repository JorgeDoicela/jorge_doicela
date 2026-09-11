import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

export interface TractOutlinePoint {
  heading: string;
  passage: string;
  exposition: string;
  illustration?: string;
}

@Entity('evangelism_tracts')
export class EvangelismTractEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @PrimaryColumn({ length: 10, default: 'es' })
  language: string;

  @Index()
  @Column({ length: 64 })
  slug: string;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 64, nullable: true })
  targetAudience: string;

  @Column('text')
  summary: string;

  @Column('simple-json')
  fullOutline: TractOutlinePoint[];

  @Column('text')
  prayerOfFaith: string;

  @Column('simple-json')
  nextSteps: string[];
}
