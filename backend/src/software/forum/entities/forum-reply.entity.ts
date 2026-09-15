import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_replies')
@Index(['topicId', 'createdAt'])
export class ForumReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  topicId: number;

  @Index()
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

  @ManyToOne(() => ForumReply, (reply) => reply.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent?: ForumReply;

  @OneToMany(() => ForumReply, (reply) => reply.parent)
  children?: ForumReply[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
