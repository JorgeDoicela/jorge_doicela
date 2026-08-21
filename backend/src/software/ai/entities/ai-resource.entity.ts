import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type AiResourceType =
  | 'llm'
  | 'agent'
  | 'framework'
  | 'mcp_server'
  | 'tool';

@Entity('ai_resources')
export class AiResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ default: 'tool' })
  type: AiResourceType;

  @Column({ default: 'Open Source' })
  provider: string;

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

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
