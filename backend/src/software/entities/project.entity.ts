import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  techStack: string;

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ nullable: true })
  liveUrl?: string;
}
