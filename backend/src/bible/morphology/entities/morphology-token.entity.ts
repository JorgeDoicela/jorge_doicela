import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Verse } from '../../verses/entities/verse.entity';

@Entity('morphology_tokens')
@Index(['verse', 'wordOrder'], { unique: true })
export class MorphologyToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Verse, {
    onDelete: 'CASCADE',
    eager: false,
  })
  verse: Verse;

  @Column()
  wordOrder: number; // Posición de la palabra dentro del versículo (1, 2, 3...)

  @Column({ length: 100 })
  surfaceText: string; // Palabra vocalizada original

  @Column({ length: 100, nullable: true })
  consonantsOnly: string; // Texto solo consonantes (para búsqueda FTS)

  @Column({ length: 100 })
  transliteration: string; // Transliteración fonética

  @Column({ length: 10, nullable: true })
  strongCode: string; // Ej: 'H7225'

  @Column({ length: 50 })
  morphologyCode: string; // Código morfológico Robinson / WLC (ej: 'V-Qal-Perf-3ms')

  @Column({ length: 150 })
  gloss: string; // Traducción literal interlineal al español
}
