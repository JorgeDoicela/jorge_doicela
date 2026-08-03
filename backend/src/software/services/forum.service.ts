import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumTopic } from '../entities/forum-topic.entity';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';

@Injectable()
export class ForumService implements OnModuleInit {
  constructor(
    @InjectRepository(ForumTopic, 'softwareConnection')
    private readonly forumRepository: Repository<ForumTopic>,
  ) {}

  async onModuleInit() {
    await this.seedInitialTopics();
  }

  private async seedInitialTopics() {
    const count = await this.forumRepository.count();
    if (count > 0) return;

    const initialTopics: Partial<ForumTopic>[] = [
      {
        title:
          '¿Cuál es la mejor estrategia para gestionar el estado global en aplicaciones Next.js App Router?',
        slug: 'estrategia-estado-global-nextjs-app-router',
        content:
          'Debate abierto sobre el uso de React Context vs Zustand vs React Query / Server Actions para aplicaciones de mediano y gran tamaño.',
        author: 'Alex Dev',
        category: 'frontend',
        repliesCount: 14,
        views: 185,
      },
      {
        title:
          'Buenas prácticas de optimización de RAM en servidores VPS de 1GB para proyectos Node.js',
        slug: 'optimizacion-ram-vps-1gb-nodejs',
        content:
          'En entornos de producción limitados, reducir la huella de memoria de Node.js es vital. ¿Qué técnicas han utilizado con mejores resultados?',
        author: 'Jorge Doicela',
        category: 'devops',
        repliesCount: 22,
        views: 340,
      },
      {
        title:
          'Impacto de la Inteligencia Artificial Generativa en la Ciberseguridad Defensiva',
        slug: 'impacto-ia-generativa-ciberseguridad-defensiva',
        content:
          'Analicemos cómo la IA está cambiando la detección de anomalías y el análisis de logs en tiempo real.',
        author: 'SecResearcher',
        category: 'cybersecurity',
        repliesCount: 9,
        views: 210,
      },
    ];

    for (const topicData of initialTopics) {
      await this.forumRepository.save(this.forumRepository.create(topicData));
    }
  }

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
