import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial, TutorialCategory } from '../entities/tutorial.entity';
import { GetTutorialsQueryDto } from '../dto/get-tutorials-query.dto';
import {
  aggregateModuleCategories,
  CategoryCountOption,
} from '../../common/utils/category-aggregation.util';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial, 'doiceladevConnection')
    private readonly tutorialRepository: Repository<Tutorial>,
  ) {}

  async findAll(query: GetTutorialsQueryDto = {}): Promise<Tutorial[]> {
    const { category, tag, search, lang, sortBy = 'smart' } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.tutorialRepository.createQueryBuilder('tut');

    if (lang) {
      qb.andWhere('tut.language = :lang', { lang });
    }

    if (category && category !== 'all') {
      qb.andWhere('tut.category = :category', { category });
    }

    if (tag && tag !== 'all') {
      qb.andWhere('tut.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (search) {
      qb.andWhere(
        '(tut.title LIKE :search OR tut.excerpt LIKE :search OR tut.tags LIKE :search OR tut.techStack LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy === 'recent') {
      qb.orderBy('tut.publishedAt', 'DESC');
      qb.addOrderBy('tut.id', 'DESC');
    } else if (sortBy === 'popular') {
      qb.orderBy('tut.views', 'DESC');
      qb.addOrderBy('tut.likes', 'DESC');
      qb.addOrderBy('tut.id', 'DESC');
    } else {
      qb.addSelect(
        '((tut.featured * 1000) + (tut.orderPriority * 20) + (tut.likes * 4) + (tut.views * 1.5))',
        'smart_score',
      );
      qb.orderBy('smart_score', 'DESC');
      qb.addOrderBy('tut.publishedAt', 'DESC');
      qb.addOrderBy('tut.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    if (results.length === 0 && lang && lang !== 'es') {
      return this.findAll({ ...query, lang: 'es' });
    }

    return results;
  }

  async findOne(idOrSlug: string, lang?: string): Promise<Tutorial> {
    const isId = !isNaN(Number(idOrSlug));
    let tutorial: Tutorial | null = null;

    if (isId) {
      tutorial = await this.tutorialRepository.findOne({
        where: { id: Number(idOrSlug) },
        relations: { steps: true },
      });
    } else {
      if (lang) {
        tutorial = await this.tutorialRepository.findOne({
          where: { slug: idOrSlug, language: lang },
          relations: { steps: true },
        });
      }
      if (!tutorial) {
        tutorial = await this.tutorialRepository.findOne({
          where: { slug: idOrSlug },
          relations: { steps: true },
        });
      }
    }

    if (!tutorial) {
      throw new NotFoundException(`Tutorial "${idOrSlug}" no encontrado`);
    }

    if (tutorial.steps) {
      tutorial.steps.sort((a, b) => a.stepOrder - b.stepOrder);
    }

    void this.tutorialRepository.increment({ id: tutorial.id }, 'views', 1);
    tutorial.views += 1;
    return tutorial;
  }

  async getCategories(lang: string = 'es'): Promise<CategoryCountOption[]> {
    const categoryOrder: TutorialCategory[] = [
      'web',
      'backend',
      'devops',
      'security',
      'architecture',
      'databases',
      'ai',
      'mobile',
    ];
    return aggregateModuleCategories(
      this.tutorialRepository.createQueryBuilder('tut'),
      'tut',
      lang,
      categoryOrder,
    );
  }
}
