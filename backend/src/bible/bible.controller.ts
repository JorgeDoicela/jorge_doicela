import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { BibleService } from './bible.service';
import { Verse } from './entities/verse.entity';

@Controller('bible/verses')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get()
  async findAll(): Promise<Verse[]> {
    return this.bibleService.findAll();
  }

  @Get('search')
  async findByBook(@Query('book') book: string): Promise<Verse[]> {
    if (!book) {
      return this.bibleService.findAll();
    }
    return this.bibleService.findByBook(book);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Verse> {
    const verse = await this.bibleService.findOne(id);
    if (!verse) {
      throw new NotFoundException(`Verse with ID ${id} not found`);
    }
    return verse;
  }
}
