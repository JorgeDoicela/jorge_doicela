import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumTopic } from '../entities/forum-topic.entity';
import { ForumReply } from '../entities/forum-reply.entity';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumTopic, 'softwareConnection')
    private readonly topicRepository: Repository<ForumTopic>,
    @InjectRepository(ForumReply, 'softwareConnection')
    private readonly replyRepository: Repository<ForumReply>,
  ) {}

  async findAllTopics(
    category?: string,
    search?: string,
    lang?: string,
  ): Promise<ForumTopic[]> {
    const qb = this.topicRepository.createQueryBuilder('topic');

    if (lang) {
      qb.andWhere('topic.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('topic.category = :category', { category });
    }

    if (search) {
      qb.andWhere('(topic.title LIKE :search OR topic.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    qb.orderBy('topic.isPinned', 'DESC').addOrderBy('topic.createdAt', 'DESC');
    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAllTopics(category, search, 'es');
    }

    return results;
  }

  async findTopic(idOrSlug: string, lang?: string): Promise<ForumTopic> {
    const isId = !isNaN(Number(idOrSlug));
    let topic: ForumTopic | null = null;

    if (isId) {
      topic = await this.topicRepository.findOne({
        where: { id: Number(idOrSlug) },
        relations: { replies: true },
      });
    } else {
      if (lang) {
        topic = await this.topicRepository.findOne({
          where: { slug: idOrSlug, language: lang },
          relations: { replies: true },
        });
      }
      if (!topic) {
        topic = await this.topicRepository.findOne({
          where: { slug: idOrSlug },
          relations: { replies: true },
        });
      }
    }

    if (!topic) {
      throw new NotFoundException(`Tema del foro "${idOrSlug}" no encontrado`);
    }

    topic.views += 1;
    await this.topicRepository.save(topic);
    return topic;
  }

  async createTopic(dto: CreateForumTopicDto): Promise<ForumTopic> {
    const topic = this.topicRepository.create(dto);
    return this.topicRepository.save(topic);
  }

  async createReply(dto: CreateForumReplyDto): Promise<ForumReply> {
    const topic = await this.topicRepository.findOne({
      where: { id: dto.topicId },
    });
    if (!topic) {
      throw new NotFoundException(`Tema #${dto.topicId} no encontrado`);
    }

    const reply = this.replyRepository.create(dto);
    const savedReply = await this.replyRepository.save(reply);

    topic.repliesCount += 1;
    await this.topicRepository.save(topic);

    return savedReply;
  }

  async findRepliesByTopic(topicId: number): Promise<ForumReply[]> {
    return this.replyRepository.find({
      where: { topicId },
      order: { createdAt: 'ASC' },
    });
  }
}
