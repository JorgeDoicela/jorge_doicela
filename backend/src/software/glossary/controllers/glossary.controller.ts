import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { GlossaryService } from '../services/glossary.service';
import { GetGlossaryQueryDto } from '../dto/get-glossary-query.dto';

@Controller('software/glossary')
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Get()
  async findAll(@Query() query: GetGlossaryQueryDto) {
    return this.glossaryService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Query('lang') lang?: string) {
    const term = await this.glossaryService.findBySlug(slug, lang || 'es');
    if (!term) {
      throw new NotFoundException(
        `Término del glosario '${slug}' no encontrado.`,
      );
    }
    return term;
  }
}
