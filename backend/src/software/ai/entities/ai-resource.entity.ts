import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type AiCategory =
  | 'llm'
  | 'agent'
  | 'framework'
  | 'mcp_server'
  | 'tool'
  | 'dataset'
  | 'platform';

@Entity('ai_resources')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'orderPriority', 'createdAt'])
@Index(['language', 'category', 'orderPriority', 'createdAt'])
@Index(['language', 'featured', 'orderPriority', 'createdAt'])
export class AiResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  name: string;

  @Column({ default: 'tool' })
  category: AiCategory;

  @Column({ default: 'Open Source' })
  provider: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ default: 'MIT' })
  license: string;

  @Column({ nullable: true })
  documentationUrl?: string;

  @Column({ nullable: true })
  paperUrl?: string;

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({ default: 'ai,llm' })
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
