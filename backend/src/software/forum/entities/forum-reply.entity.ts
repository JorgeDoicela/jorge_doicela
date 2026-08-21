import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_replies')
export class ForumReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  topicId: number;

  @Column({ nullable: true })
  parentId?: number;

  @Column()
  author: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isAcceptedAnswer: boolean;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => ForumTopic, (topic) => topic.replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topicId' })
  topic: ForumTopic;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
