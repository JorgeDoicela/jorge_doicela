import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('archaeology_articles')
@Index(['slug', 'language'], { unique: true })
export class ArchaeologyArticleEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 256 })
  slug: string;

  @Index()
  @Column({ length: 64 })
  category: string; // recent_discoveries, manuscripts, apologetics

  @Column({ length: 64 })
  region: string;

  @Column({ length: 128 })
  regionLabel: string;

  @Column({ length: 32 })
  publishDate: string;

  @Column({ length: 256 })
  institutionOrAuthor: string;

  @Column({ type: 'integer' })
  readTimeMinutes: number;

  @Column('text')
  summary: string;

  @Column('text')
  contentMarkdown: string;

  @Column('simple-json', { nullable: true })
  biblicalReferences: {
    reference: string;
    context: string;
  }[];

  @Column('simple-json', { nullable: true })
  epigraphy: {
    originalScript?: string;
    language?: string;
    transliteration?: string;
    translation?: string;
    dateEstimate?: string;
  };

  @Column({ length: 256, nullable: true })
  museumOrLocation: string;

  @Column({ length: 256, nullable: true })
  keyArtifact: string;

  @Column('simple-json', { nullable: true })
  tags: string[];

  @Column({ default: 'es' })
  language: string;
}
