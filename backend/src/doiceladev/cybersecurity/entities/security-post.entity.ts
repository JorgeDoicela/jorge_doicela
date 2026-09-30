import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecurityCategory =
  | 'advisory'
  | 'hardening_guide'
  | 'writeup'
  | 'cve_analysis'
  | 'pentest';

@Entity('security_posts')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderPriority', 'publishedAt'])
@Index(['language', 'severity', 'orderPriority', 'publishedAt'])
@Index(['language', 'category', 'orderPriority', 'publishedAt'])
@Index(['language', 'featured', 'orderPriority', 'publishedAt'])
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
  category: SecurityCategory;

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

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  orderPriority: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
