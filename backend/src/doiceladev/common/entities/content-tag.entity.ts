import { Entity, PrimaryColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from './tag.entity';

@Entity('content_tags')
@Index('IDX_content_tags_tag', ['tagId'])
@Index('IDX_content_tags_content', ['contentType', 'contentId'])
export class ContentTag {
  @PrimaryColumn({ name: 'content_type', type: 'text' })
  contentType: string;

  @PrimaryColumn({ name: 'content_id', type: 'integer' })
  contentId: number;

  @PrimaryColumn({ name: 'tag_id', type: 'integer' })
  tagId: number;

  @ManyToOne(() => Tag, (tag) => tag.contentTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag?: Tag;
}
