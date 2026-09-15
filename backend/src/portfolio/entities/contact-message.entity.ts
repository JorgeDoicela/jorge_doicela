import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('contact_messages')
@Index(['createdAt'])
export class ContactMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  serviceType?: string;

  @CreateDateColumn()
  createdAt: Date;
}
