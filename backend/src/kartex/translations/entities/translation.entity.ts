import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Verse } from '../../verses/entities/verse.entity';

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  abbreviation: string;

  @Column()
  language: string;

  @OneToMany(() => Verse, (verse) => verse.translation)
  verses: Verse[];
}
