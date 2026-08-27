import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('blog_posts')
@Index(['slug', 'language'], { unique: true })
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column({ default: 'Jorge Doicela' })
  author: string;

  @Column({ default: 'architecture,clean-code' })
  tags: string;

  @Column({ default: 'es' })
  language: string;

  @Column({ nullable: true })
  series?: string;

  @Column({ nullable: true })
  tableOfContents?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 8 })
  readTimeMinutes: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
