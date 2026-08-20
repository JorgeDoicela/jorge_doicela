import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumTopic } from '../entities/forum-topic.entity';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumTopic, 'softwareConnection')
    private readonly forumRepository: Repository<ForumTopic>,
  ) {}

  async findAll(): Promise<ForumTopic[]> {
    return this.forumRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(idOrSlug: string): Promise<ForumTopic> {
    const isId = !isNaN(Number(idOrSlug));
    const topic = isId
      ? await this.forumRepository.findOne({ where: { id: Number(idOrSlug) } })
      : await this.forumRepository.findOne({ where: { slug: idOrSlug } });

    if (!topic) {
      throw new NotFoundException(
        `Tema de foro "${idOrSlug}" no fue encontrado`,
      );
    }

    topic.views += 1;
    await this.forumRepository.save(topic);
    return topic;
  }

  async create(createTopicDto: CreateForumTopicDto): Promise<ForumTopic> {
    const topic = this.forumRepository.create(createTopicDto);
    return this.forumRepository.save(topic);
  }
}
