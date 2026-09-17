import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TutorialsService } from '../services/tutorials.service';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { CreateTutorialStepDto } from '../dto/create-tutorial-step.dto';
import { GetTutorialsQueryDto } from '../dto/get-tutorials-query.dto';

@Controller('software/tutorials')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Get()
  async findAll(@Query() query: GetTutorialsQueryDto) {
    return this.tutorialsService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.tutorialsService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.tutorialsService.findOne(idOrSlug, lang);
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tutorialsService.remove(id);
    return { success: true };
  }
}
