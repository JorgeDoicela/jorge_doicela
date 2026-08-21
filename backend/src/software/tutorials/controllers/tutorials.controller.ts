import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TutorialsService } from '../services/tutorials.service';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { CreateTutorialStepDto } from '../dto/create-tutorial-step.dto';
import type { TutorialDifficulty } from '../entities/tutorial.entity';

@Controller('software/tutorials')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Get()
  async findAll(
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
  ) {
    return this.tutorialsService.findAll(
      difficulty as TutorialDifficulty,
      search,
    );
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.tutorialsService.findOne(idOrSlug);
  }

  @Post()
  async create(@Body() createTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.create(createTutorialDto);
  }

  @Post('steps')
  async addStep(@Body() createStepDto: CreateTutorialStepDto) {
    return this.tutorialsService.addStep(createStepDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tutorialsService.remove(+id);
    return { success: true };
  }
}
