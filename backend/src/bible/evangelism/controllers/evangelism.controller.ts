import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { EvangelismService } from '../services/evangelism.service';

@Controller('bible/evangelism')
export class EvangelismController {
  constructor(private readonly evangelismService: EvangelismService) {}

  @Get('pathways')
  async getPathways(@Query('lang') lang?: string) {
    return this.evangelismService.getPathways(lang || 'es');
  }

  @Get('pathways/:slug')
  async getPathwayBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ) {
    const pathway = await this.evangelismService.getPathwayBySlug(
      slug,
      lang || 'es',
    );
    if (!pathway) {
      throw new NotFoundException(
        `Ruta evangelística con slug/id "${slug}" no encontrada`,
      );
    }
    return pathway;
  }

  @Get('objections')
  async getObjections(
    @Query('category') category?: string,
    @Query('q') query?: string,
    @Query('lang') lang?: string,
  ) {
    return this.evangelismService.getObjections(category, query, lang || 'es');
  }

  @Get('tracts')
  async getTracts(
    @Query('audience') audience?: string,
    @Query('lang') lang?: string,
  ) {
    return this.evangelismService.getTracts(audience, lang || 'es');
  }

  @Get('tracts/:slug')
  async getTractBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ) {
    const tract = await this.evangelismService.getTractBySlug(
      slug,
      lang || 'es',
    );
    if (!tract) {
      throw new NotFoundException(
        `Tratado con slug/id "${slug}" no encontrado`,
      );
    }
    return tract;
  }
}
