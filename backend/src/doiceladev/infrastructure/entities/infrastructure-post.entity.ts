import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type InfrastructureCategory =
  | 'cloud'
  | 'servers'
  | 'containers'
  | 'networking'
  | 'ci_cd'
  | 'hardening'
  | 'zero_ram'
  | 'monitoring'
  | 'security';

@Entity('infrastructure_posts')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderPriority', 'publishedAt'])
@Index(['language', 'category', 'orderPriority', 'publishedAt'])
@Index(['language', 'featured', 'orderPriority', 'publishedAt'])
export class InfrastructurePost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ default: 'servers' })
  category: InfrastructureCategory;

  @Column({ default: 'Debian, Linux, Nginx' })
  techStack: string;

  @Column({ type: 'text', nullable: true })
  specs?: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'infrastructure,cloud,sysadmin' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ default: 'left' })
  metaAlign: string;

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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
