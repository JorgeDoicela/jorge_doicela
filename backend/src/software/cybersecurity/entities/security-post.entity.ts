import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecurityPostType = 'advisory' | 'hardening_guide' | 'writeup';

@Entity('security_posts')
@Index(['slug', 'language'], { unique: true })
export class SecurityPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: 'MEDIUM' })
  severity: SecuritySeverity;

  @Column({ default: 'advisory' })
  postType: SecurityPostType;

  @Column({ nullable: true })
  cveId?: string;

  @Column({ nullable: true })
  affectedSystems?: string;

  @Column({ type: 'text', nullable: true })
  remediation?: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'cybersecurity,devsecops' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
