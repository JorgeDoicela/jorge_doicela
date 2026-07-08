import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VersesService } from '../services/verses.service';
import { Verse } from '../entities/verse.entity';
import { CreateVerseDto } from '../dto/create-verse.dto';
import { UpdateVerseDto } from '../dto/update-verse.dto';
import { GetVersesFilterDto } from '../dto/get-verses-filter.dto';

@Controller('bible/verses')
export class VersesController {
  constructor(private readonly versesService: VersesService) {}

  @Get()
  async findAll(@Query() filterDto: GetVersesFilterDto): Promise<Verse[]> {
    return this.versesService.findFiltered(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Verse> {
    return this.versesService.findOne(id);
  }

  @Post()
  async create(@Body() createVerseDto: CreateVerseDto): Promise<Verse> {
    return this.versesService.create(createVerseDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVerseDto: UpdateVerseDto,
  ): Promise<Verse> {
    return this.versesService.update(id, updateVerseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.versesService.remove(id);
  }
}
