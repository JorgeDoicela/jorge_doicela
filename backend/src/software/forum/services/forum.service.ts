import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ForumTopic } from '../entities/forum-topic.entity';
import { ForumReply } from '../entities/forum-reply.entity';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';
import { GetForumTopicsQueryDto } from '../dto/get-forum-topics-query.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectDataSource('softwareConnection')
    private readonly dataSource: DataSource,
    @InjectRepository(ForumTopic, 'softwareConnection')
    private readonly topicRepository: Repository<ForumTopic>,
    @InjectRepository(ForumReply, 'softwareConnection')
    private readonly replyRepository: Repository<ForumReply>,
  ) {}

  async findAllTopics(
    query: GetForumTopicsQueryDto = {},
  ): Promise<ForumTopic[]> {
    const { category, search, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

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

    // Algoritmo de Inteligencia Editorial (SmartScore con ponderación Comunitaria)
    qb.addSelect(
      '((topic.isPinned * 1000) + (topic.orderPriority * 20) + (topic.repliesCount * 15) + (topic.views * 1.5))',
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('topic.createdAt', 'DESC');
    qb.addOrderBy('topic.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAllTopics({ ...query, lang: 'es' });
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

    void this.topicRepository.increment({ id: topic.id }, 'views', 1);
    topic.views += 1;
    return topic;
  }

  async createTopic(dto: CreateForumTopicDto): Promise<ForumTopic> {
    const topic = this.topicRepository.create(dto);
    return this.topicRepository.save(topic);
  }

  async createReply(dto: CreateForumReplyDto): Promise<ForumReply> {
    return this.dataSource.transaction(async (manager) => {
      const topic = await manager.findOne(ForumTopic, {
        where: { id: dto.topicId },
      });
      if (!topic) {
        throw new NotFoundException(`Tema #${dto.topicId} no encontrado`);
      }

      const reply = manager.create(ForumReply, dto);
      const savedReply = await manager.save(reply);

      topic.repliesCount += 1;
      await manager.save(topic);

      return savedReply;
    });
  }

  async findRepliesByTopic(topicId: number): Promise<ForumReply[]> {
    return this.replyRepository.find({
      where: { topicId },
      order: { createdAt: 'ASC' },
    });
  }
}
