import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TranslationsService } from '../services/translations.service';
import { Translation } from '../entities/translation.entity';
import { CreateTranslationDto } from '../dto/create-translation.dto';

@Controller('bible/translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  async findAll(): Promise<Translation[]> {
    return this.translationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Translation> {
    return this.translationsService.findOne(id);
  }

  @Post()
  async create(
    @Body() createTranslationDto: CreateTranslationDto,
  ): Promise<Translation> {
    return this.translationsService.create(createTranslationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.translationsService.remove(id);
  }
}
