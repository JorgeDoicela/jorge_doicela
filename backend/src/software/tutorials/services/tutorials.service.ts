import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from '../entities/tutorial.entity';
import { TutorialStep } from '../entities/tutorial-step.entity';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { CreateTutorialStepDto } from '../dto/create-tutorial-step.dto';
import { GetTutorialsQueryDto } from '../dto/get-tutorials-query.dto';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial, 'softwareConnection')
    private readonly tutorialRepository: Repository<Tutorial>,
    @InjectRepository(TutorialStep, 'softwareConnection')
    private readonly stepRepository: Repository<TutorialStep>,
  ) {}

  async findAll(query: GetTutorialsQueryDto = {}): Promise<Tutorial[]> {
    const { difficulty, search, lang } = query;
    const page = Math.max(1, query.page ? Number(query.page) : 1);
    const limit = Math.min(query.limit ? Number(query.limit) : 50, 100);

    const qb = this.tutorialRepository.createQueryBuilder('tut');

    if (lang) {
      qb.andWhere('tut.language = :lang', { lang });
    }

    if (difficulty && difficulty !== 'all') {
      qb.andWhere('tut.difficulty = :difficulty', { difficulty });
    }

    if (search) {
      qb.andWhere(
        '(tut.title LIKE :search OR tut.excerpt LIKE :search OR tut.tags LIKE :search OR tut.techStack LIKE :search)',

        { search: `%${search}%` },
      );
    }

    // Algoritmo de Inteligencia Editorial (SmartScore)
    qb.addSelect(
      '((tut.featured * 1000) + (tut.orderPriority * 20) + (tut.likes * 4) + (tut.views * 1.5))',
      'smart_score',
    );
    qb.orderBy('smart_score', 'DESC');
    qb.addOrderBy('COALESCE(tut.publishedAt, tut.createdAt)', 'DESC');
    qb.addOrderBy('tut.id', 'DESC');

    // Techo de seguridad de memoria para VPS 1 GB RAM
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

    // Ordenar pasos
    if (tutorial.steps) {
      tutorial.steps.sort((a, b) => a.stepOrder - b.stepOrder);
    }

    void this.tutorialRepository.increment({ id: tutorial.id }, 'views', 1);
    tutorial.views += 1;
    return tutorial;
  }

  async create(createTutorialDto: CreateTutorialDto): Promise<Tutorial> {
    const tutorial = this.tutorialRepository.create({
      ...createTutorialDto,
      difficulty: createTutorialDto.difficulty || 'intermediate',
    });
    return this.tutorialRepository.save(tutorial);
  }

  async addStep(dto: CreateTutorialStepDto): Promise<TutorialStep> {
    const tutorial = await this.tutorialRepository.findOne({
      where: { id: dto.tutorialId },
    });
    if (!tutorial) {
      throw new NotFoundException(`Tutorial #${dto.tutorialId} no encontrado`);
    }

    const step = this.stepRepository.create(dto);
    return this.stepRepository.save(step);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tutorialRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Tutorial #${id} no encontrado`);
    }
  }

  async getCategories(
    lang: string = 'es',
  ): Promise<Array<{ id: string; label: string; count: number }>> {
    const qb = this.tutorialRepository.createQueryBuilder('tut');
    if (lang) {
      qb.andWhere('tut.language = :lang', { lang });
    }

    const allTutorials = await qb.select(['tut.difficulty']).getMany();
    const countMap = new Map<string, number>();

    for (const tut of allTutorials) {
      if (tut.difficulty) {
        const diff = tut.difficulty.toLowerCase();
        countMap.set(diff, (countMap.get(diff) || 0) + 1);
      }
    }

    const labelsEs: Record<string, string> = {
      all: 'Todos los niveles',
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      expert: 'Experto',
    };

    const labelsEn: Record<string, string> = {
      all: 'All Levels',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
    };

    const labels = lang === 'en' ? labelsEn : labelsEs;

    const result: Array<{ id: string; label: string; count: number }> = [
      {
        id: 'all',
        label:
          labels.all || (lang === 'en' ? 'All Levels' : 'Todos los niveles'),
        count: allTutorials.length,
      },
    ];

    const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    for (const diff of difficultyOrder) {
      const count = countMap.get(diff) || 0;
      if (count > 0) {
        result.push({
          id: diff,
          label: labels[diff] || diff,
          count,
        });
      }
    }

    return result;
  }
}
