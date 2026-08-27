import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('historical_places')
export class HistoricalPlaceEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ length: 128 })
  name: string;

  @Column('simple-json', { nullable: true })
  originalName: {
    hebrew?: string;
    greek?: string;
    transliteration?: string;
    meaning?: string;
  };

  @Column('simple-json')
  coordinates: {
    lat: number;
    lng: number;
  };

  @Index()
  @Column({ length: 32 })
  category: string; // city, mountain, water, archaeology_site

  @Column('simple-json', { nullable: true })
  era: string[]; // patriarchs, monarchy, etc.

  @Column({ length: 128, nullable: true })
  modernName: string;

  @Column({ length: 64, nullable: true })
  country: string;

  @Column({ type: 'integer', nullable: true })
  elevationMeters: number;

  @Column('text')
  description: string;

  @Column('simple-json', { nullable: true })
  biblicalReferences: {
    reference: string;
    context: string;
  }[];

  @Column('simple-json', { nullable: true })
  archaeologicalNotes: {
    discoveries?: string[];
    excavationStatus?: string;
    verifiedByBiblicalArchaeology?: boolean;
  };

  @Column({ default: 'es' })
  language: string;
}
