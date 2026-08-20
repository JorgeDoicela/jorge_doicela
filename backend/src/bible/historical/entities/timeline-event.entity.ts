import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('timeline_events')
export class TimelineEventEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ length: 128 })
  name: string;

  @Index()
  @Column({ length: 32 })
  type: string; // monarch, prophet, empire, milestone

  @Column('simple-json', { nullable: true })
  originalName: {
    hebrew?: string;
    greek?: string;
    transliteration?: string;
    meaning?: string;
  };

  @Index()
  @Column({ type: 'integer' })
  startYearBC: number;

  @Index()
  @Column({ type: 'integer' })
  endYearBC: number;

  @Column({ length: 32, nullable: true })
  kingdom: string; // united, judah, israel

  @Column({ length: 16, nullable: true })
  evaluation: string; // good, bad, mixed

  @Column({ length: 128, nullable: true })
  dynastyOrOrigin: string;

  @Column('simple-json', { nullable: true })
  contemporaryEntities: string[];

  @Column('simple-json', { nullable: true })
  biblicalReferences: string[];

  @Column('simple-json', { nullable: true })
  keyEvents: string[];

  @Column('text', { nullable: true })
  details: string;
}
