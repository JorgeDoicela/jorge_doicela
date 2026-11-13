import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type NewsletterSubscriberStatus = 'active' | 'unsubscribed';

@Entity('newsletter_subscribers')
@Index('IDX_newsletter_subscribers_email', ['email'], { unique: true })
@Index('IDX_newsletter_subscribers_status_created', ['status', 'createdAt'])
@Index('IDX_newsletter_subscribers_unsubscribe_token', ['unsubscribeToken'])
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 32,
    default: 'active',
  })
  status: NewsletterSubscriberStatus;

  @Column({ type: 'varchar', length: 64, nullable: true })
  unsubscribeToken: string | null;

  @Column({ type: 'varchar', length: 64, default: 'general' })
  source: string;

  @Column({ type: 'varchar', length: 5, default: 'es' })
  language: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
