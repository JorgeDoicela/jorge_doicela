import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial, TutorialDifficulty } from '../entities/tutorial.entity';
import { TutorialStep } from '../entities/tutorial-step.entity';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { CreateTutorialStepDto } from '../dto/create-tutorial-step.dto';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial, 'softwareConnection')
    private readonly tutorialRepository: Repository<Tutorial>,
    @InjectRepository(TutorialStep, 'softwareConnection')
    private readonly stepRepository: Repository<TutorialStep>,
  ) {}

  async findAll(
    difficulty?: TutorialDifficulty,
    search?: string,
  ): Promise<Tutorial[]> {
    const qb = this.tutorialRepository.createQueryBuilder('tut');

    if (difficulty) {
      qb.andWhere('tut.difficulty = :difficulty', { difficulty });
    }

    if (search) {
      qb.andWhere(
        '(tut.title LIKE :search OR tut.excerpt LIKE :search OR tut.tags LIKE :search OR tut.techStack LIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('tut.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(idOrSlug: string): Promise<Tutorial> {
    const isId = !isNaN(Number(idOrSlug));
    const tutorial = isId
      ? await this.tutorialRepository.findOne({
          where: { id: Number(idOrSlug) },
          relations: { steps: true },
        })
      : await this.tutorialRepository.findOne({
          where: { slug: idOrSlug },
          relations: { steps: true },
        });

    if (!tutorial) {
      throw new NotFoundException(`Tutorial "${idOrSlug}" no encontrado`);
    }

    // Ordenar pasos
    if (tutorial.steps) {
      tutorial.steps.sort((a, b) => a.stepOrder - b.stepOrder);
    }

    tutorial.views += 1;
    await this.tutorialRepository.save(tutorial);
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
    await this.tutorialRepository.delete(id);
  }
}
