import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ForumTopic, ForumCategory } from '../entities/forum-topic.entity';
import { ForumReply } from '../entities/forum-reply.entity';
import { ForumPollOption } from '../entities/forum-poll-option.entity';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';
import { GetForumTopicsQueryDto } from '../dto/get-forum-topics-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class ForumService {
  constructor(
    @InjectDataSource('doiceladevConnection')
    private readonly dataSource: DataSource,
    @InjectRepository(ForumTopic, 'doiceladevConnection')
    private readonly topicRepository: Repository<ForumTopic>,
    @InjectRepository(ForumReply, 'doiceladevConnection')
    private readonly replyRepository: Repository<ForumReply>,
    @InjectRepository(ForumPollOption, 'doiceladevConnection')
    private readonly pollOptionRepository: Repository<ForumPollOption>,
  ) {}

  async findAllTopics(
    query: GetForumTopicsQueryDto = {},
  ): Promise<ForumTopic[]> {
    const { category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.topicRepository.createQueryBuilder('topic');

    if (lang) {
      qb.andWhere('topic.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('topic.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('topic.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(topic.title LIKE :search OR topic.excerpt LIKE :search OR topic.content LIKE :search OR topic.tags LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('topic.createdAt', 'DESC');
      qb.addOrderBy('topic.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('topic.repliesCount', 'DESC');
      qb.addOrderBy('topic.views', 'DESC');
      qb.addOrderBy('topic.id', 'DESC');
    } else {
      qb.addSelect(
        '((topic.isPinned * 1000) + (topic.orderPriority * 20) + (topic.repliesCount * 15) + (topic.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('topic.createdAt', 'DESC');
      qb.addOrderBy('topic.id', 'DESC');
    }

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
        relations: { replies: true, pollOptions: true },
      });
    } else {
      if (lang) {
        topic = await this.topicRepository.findOne({
          where: { slug: idOrSlug, language: lang },
          relations: { replies: true, pollOptions: true },
        });
      }
      if (!topic) {
        topic = await this.topicRepository.findOne({
          where: { slug: idOrSlug },
          relations: { replies: true, pollOptions: true },
        });
      }
    }

    if (!topic) {
      throw new NotFoundException(`Tema del foro "${idOrSlug}" no encontrado`);
    }

    if (topic.replies) {
      topic.replies.sort(
        (a, b) =>
          Number(b.isAcceptedAnswer) - Number(a.isAcceptedAnswer) ||
          b.likes - a.likes ||
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    if (topic.pollOptions) {
      topic.pollOptions.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    void this.topicRepository.increment({ id: topic.id }, 'views', 1);
    topic.views += 1;
    return topic;
  }

  async createReply(dto: CreateForumReplyDto): Promise<ForumReply> {
    return this.dataSource.transaction(async (manager) => {
      const topic = await manager.findOne(ForumTopic, {
        where: { id: dto.topicId },
      });
      if (!topic) {
        throw new NotFoundException(`Tema #${dto.topicId} no encontrado`);
      }

      if (topic.isClosed) {
        throw new BadRequestException(
          'Este debate está cerrado y ya no admite nuevas respuestas.',
        );
      }

      if (dto.parentId) {
        const parentReply = await manager.findOne(ForumReply, {
          where: { id: dto.parentId, topicId: dto.topicId },
        });
        if (!parentReply) {
          throw new BadRequestException(
            'La respuesta padre indicada no pertenece a este debate.',
          );
        }
      }

      const reply = manager.create(ForumReply, {
        topicId: dto.topicId,
        parentId: dto.parentId,
        content: dto.content.trim(),
        author: dto.author?.trim() || 'Comunidad Tech',
      });
      const savedReply = await manager.save(reply);

      await manager.increment(ForumTopic, { id: topic.id }, 'repliesCount', 1);

      return savedReply;
    });
  }

  async voteReply(replyId: number): Promise<ForumReply> {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: { topic: true },
    });
    if (!reply) {
      throw new NotFoundException(`Respuesta #${replyId} no encontrada`);
    }

    if (reply.topic?.isClosed) {
      throw new BadRequestException('El debate está cerrado.');
    }

    await this.replyRepository.increment({ id: replyId }, 'likes', 1);
    reply.likes += 1;
    return reply;
  }

  async unvoteReply(replyId: number): Promise<ForumReply> {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: { topic: true },
    });
    if (!reply) {
      throw new NotFoundException(`Respuesta #${replyId} no encontrada`);
    }

    if (reply.topic?.isClosed) {
      throw new BadRequestException('El debate está cerrado.');
    }

    await this.replyRepository
      .createQueryBuilder()
      .update(ForumReply)
      .set({ likes: () => 'MAX(0, likes - 1)' })
      .where('id = :replyId', { replyId })
      .execute();

    const updated = await this.replyRepository.findOne({
      where: { id: replyId },
    });
    if (!updated) {
      throw new NotFoundException(`Respuesta #${replyId} no encontrada`);
    }

    return updated;
  }

  async deleteReply(
    replyId: number,
  ): Promise<{ success: boolean; deletedCount: number }> {
    return this.dataSource.transaction(async (manager) => {
      const reply = await manager.findOne(ForumReply, {
        where: { id: replyId },
      });
      if (!reply) {
        throw new NotFoundException(`Respuesta #${replyId} no encontrada`);
      }

      // Conteo recursivo de hijos y subhijos para decrementar exactamente repliesCount
      const allTopicReplies = await manager.find(ForumReply, {
        where: { topicId: reply.topicId },
        select: { id: true, parentId: true },
      });

      const idsToDelete = new Set<number>([replyId]);
      let added = true;
      while (added) {
        added = false;
        for (const r of allTopicReplies) {
          if (
            r.parentId &&
            idsToDelete.has(r.parentId) &&
            !idsToDelete.has(r.id)
          ) {
            idsToDelete.add(r.id);
            added = true;
          }
        }
      }

      const totalDeleted = idsToDelete.size;

      // TypeORM con CASCADE elimina reply y sus dependientes
      await manager.delete(ForumReply, Array.from(idsToDelete));

      await manager
        .createQueryBuilder()
        .update(ForumTopic)
        .set({
          repliesCount: () => `MAX(0, repliesCount - ${totalDeleted})`,
        })
        .where('id = :topicId', { topicId: reply.topicId })
        .execute();

      return { success: true, deletedCount: totalDeleted };
    });
  }

  async votePollOption(
    topicId: number,
    optionId: number,
    previousOptionId?: number,
  ): Promise<ForumPollOption[]> {
    return this.dataSource.transaction(async (manager) => {
      const topic = await manager.findOne(ForumTopic, {
        where: { id: topicId },
      });
      if (!topic) {
        throw new NotFoundException(`Debate #${topicId} no encontrado`);
      }
      if (topic.isClosed) {
        throw new BadRequestException(
          'La encuesta de este debate está cerrada.',
        );
      }

      const option = await manager.findOne(ForumPollOption, {
        where: { id: optionId, topicId },
      });
      if (!option) {
        throw new NotFoundException(
          `Opción de encuesta #${optionId} no encontrada en el debate #${topicId}`,
        );
      }

      if (previousOptionId && previousOptionId !== optionId) {
        await manager
          .createQueryBuilder()
          .update(ForumPollOption)
          .set({ votes: () => 'MAX(0, votes - 1)' })
          .where('id = :prevId AND topicId = :topicId', {
            prevId: previousOptionId,
            topicId,
          })
          .execute();
      }

      await manager.increment(ForumPollOption, { id: optionId }, 'votes', 1);

      return manager.find(ForumPollOption, {
        where: { topicId },
        order: { displayOrder: 'ASC' },
      });
    });
  }

  async unvotePollOption(
    topicId: number,
    optionId: number,
  ): Promise<ForumPollOption[]> {
    const topic = await this.topicRepository.findOne({
      where: { id: topicId },
    });
    if (!topic) {
      throw new NotFoundException(`Debate #${topicId} no encontrado`);
    }
    if (topic.isClosed) {
      throw new BadRequestException('La encuesta de este debate está cerrada.');
    }

    const option = await this.pollOptionRepository.findOne({
      where: { id: optionId, topicId },
    });
    if (!option) {
      throw new NotFoundException(
        `Opción de encuesta #${optionId} no encontrada en el debate #${topicId}`,
      );
    }

    await this.pollOptionRepository
      .createQueryBuilder()
      .update(ForumPollOption)
      .set({ votes: () => 'MAX(0, votes - 1)' })
      .where('id = :optionId AND topicId = :topicId', { optionId, topicId })
      .execute();

    return this.pollOptionRepository.find({
      where: { topicId },
      order: { displayOrder: 'ASC' },
    });
  }

  async findRepliesByTopic(topicId: number): Promise<ForumReply[]> {
    return this.replyRepository.find({
      where: { topicId },
      order: { isAcceptedAnswer: 'DESC', likes: 'DESC', createdAt: 'ASC' },
    });
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: ForumCategory[] = [
      'architecture',
      'devops',
      'ai',
      'backend',
      'frontend',
      'help',
      'general',
    ];
    return aggregateModuleCategories(
      this.topicRepository.createQueryBuilder('topic'),
      'topic',
      lang,
      categoryOrder,
    );
  }
}
