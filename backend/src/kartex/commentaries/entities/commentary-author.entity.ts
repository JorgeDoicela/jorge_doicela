import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('commentary_authors')
export class CommentaryAuthorEntity {
  @PrimaryColumn({ length: 64 })
  id: string;

  @Index()
  @PrimaryColumn({ length: 8, default: 'es' })
  language: string;

  @Column({ length: 256 })
  name: string;

  @Column({ length: 128 })
  author: string;

  @Column({ length: 128 })
  era: string;

  @Column({ length: 256 })
  theologicalFocus: string;

  @Column('text')
  biography: string;

  @Column({ length: 256 })
  historicalWork: string;

  @Column({ length: 128 })
  license: string;
}
