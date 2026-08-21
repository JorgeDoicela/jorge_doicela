import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ForumReply } from './forum-reply.entity';

@Entity('forum_topics')
export class ForumTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'Comunidad Tech' })
  author: string;

  @Column({ default: 'general' })
  category: string;

  @Column({ default: false })
  isSolved: boolean;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: 0 })
  repliesCount: number;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => ForumReply, (reply) => reply.topic, { cascade: true })
  replies: ForumReply[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
