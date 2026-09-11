import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('pauline_discourses')
export class PaulineDiscourseEntity {
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
  theologicalTheme: string;

  @Column('text')
  centralProposition: string;

  @Column('simple-json')
  clauses: {
    id: string;
    verseRef: string;
    indentationLevel: number;
    clauseType: string;
    conjunction?: {
      greek: string;
      transliteration: string;
      gloss: string;
      category: string;
      syntacticRole: string;
    };
    text: string;
    textSpanish?: string;
    textGreek?: string;
    grammaticalAnalysis: string;
    theologicalFlow: string;
  }[];
}
