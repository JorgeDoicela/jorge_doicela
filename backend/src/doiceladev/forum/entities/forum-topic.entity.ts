import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ForumReply } from './forum-reply.entity';
import { ForumPollOption } from './forum-poll-option.entity';

export type ForumCategory =
  | 'architecture'
  | 'devops'
  | 'ai'
  | 'frontend'
  | 'backend'
  | 'help'
  | 'general';

@Entity('forum_topics')
@Index(['slug', 'language'], { unique: true })
@Index(['language', 'isPinned', 'orderPriority', 'createdAt'])
@Index(['language', 'category', 'isPinned', 'orderPriority', 'createdAt'])
export class ForumTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'general' })
  category: ForumCategory;

  @Column({ default: 'forum,debate' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ default: 'left' })
  metaAlign: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  pollQuestion?: string;

  @Column({ default: false })
  isSolved: boolean;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: 0 })
  orderPriority: number;

  @Column({ default: 0 })
  repliesCount: number;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => ForumReply, (reply) => reply.topic, { cascade: true })
  replies: ForumReply[];

  @OneToMany(() => ForumPollOption, (opt) => opt.topic, { cascade: true })
  pollOptions: ForumPollOption[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
