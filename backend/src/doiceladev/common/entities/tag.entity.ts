import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { ContentTag } from './content-tag.entity';

@Entity('tags')
@Index(['slug'], { unique: true })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  label: string;

  @OneToMany(() => ContentTag, (contentTag) => contentTag.tag)
  contentTags?: ContentTag[];
}
