import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from '../entities/translation.entity';
import { CreateTranslationDto } from '../dto/create-translation.dto';
import {
  EntityNotFoundError,
  EntityConflictError,
} from '../../../common/domain/domain-errors';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation, 'bibleConnection')
    private readonly translationRepository: Repository<Translation>,
  ) {}

  async findAll(): Promise<Translation[]> {
    return this.translationRepository.find();
  }

  async findOne(id: number): Promise<Translation> {
    const translation = await this.translationRepository.findOneBy({ id });
    if (!translation) {
      throw new EntityNotFoundError('Translation', id);
    }
    return translation;
  }

  async create(
    createTranslationDto: CreateTranslationDto,
  ): Promise<Translation> {
    const existing = await this.translationRepository.findOneBy({
      abbreviation: createTranslationDto.abbreviation.toUpperCase(),
    });

    if (existing) {
      throw new EntityConflictError(
        `Ya existe una traducción registrada con la abreviación ${createTranslationDto.abbreviation}.`,
      );
    }

    const translation = this.translationRepository.create({
      ...createTranslationDto,
      abbreviation: createTranslationDto.abbreviation.toUpperCase(),
    });
    return this.translationRepository.save(translation);
  }

  async remove(id: number): Promise<void> {
    const translation = await this.findOne(id);
    await this.translationRepository.remove(translation);
  }
}
