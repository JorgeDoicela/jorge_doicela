import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ProjectStatus = 'active' | 'archived' | 'wip';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  techStack: string;

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ nullable: true })
  liveUrl?: string;

  @Column({ default: 'active' })
  status: ProjectStatus;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  stars: number;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  architectureDiagramUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
