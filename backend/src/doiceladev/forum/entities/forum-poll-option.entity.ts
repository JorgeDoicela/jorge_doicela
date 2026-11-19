import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_poll_options')
@Index(['topicId', 'displayOrder'])
export class ForumPollOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  topicId: number;

  @Column()
  label: string;

  @Column({ default: 0 })
  votes: number;

  @Column({ default: 1 })
  displayOrder: number;

  @ManyToOne(() => ForumTopic, (topic) => topic.pollOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topicId' })
  topic: ForumTopic;

  @CreateDateColumn()
  createdAt: Date;
}
