import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type InfrastructureCategory =
  | 'cloud'
  | 'servers'
  | 'containers'
  | 'networking'
  | 'ci_cd'
  | 'hardening'
  | 'zero_ram';

export type InfrastructureEnvironment =
  | 'production'
  | 'edge'
  | 'hybrid'
  | 'vps'
  | 'bare_metal';

export type InfrastructureDifficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

@Entity('infrastructure_posts')
@Index(['slug', 'language'], { unique: true })
@Index(['category'])
@Index(['environment'])
export class InfrastructurePost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ default: 'servers' })
  category: InfrastructureCategory;

  @Column({ default: 'production' })
  environment: InfrastructureEnvironment;

  @Column({ default: 'intermediate' })
  difficulty: InfrastructureDifficulty;

  @Column({ default: 'Debian, Linux, Nginx' })
  techStack: string;

  @Column({ type: 'text', nullable: true })
  architectureOverview?: string;

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

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
