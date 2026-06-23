import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verses')
export class Verse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  book: string;

  @Column()
  chapter: number;

  @Column()
  verseNumber: number;

  @Column('text')
  text: string;
}
