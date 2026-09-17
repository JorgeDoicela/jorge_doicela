import { Controller, Get, Param, Query } from '@nestjs/common';
import { EvangelismService } from '../services/evangelism.service';
import {
  GetPathwaysQueryDto,
  GetObjectionsQueryDto,
  GetTractsQueryDto,
} from '../dto/evangelism-query.dto';
import { EvangelismPathwayEntity } from '../entities/evangelism-pathway.entity';
import { EvangelismObjectionEntity } from '../entities/evangelism-objection.entity';
import { EvangelismTractEntity } from '../entities/evangelism-tract.entity';

@Controller('bible/evangelism')
export class EvangelismController {
  constructor(private readonly evangelismService: EvangelismService) {}

  @Get('pathways')
  async getPathways(
    @Query() query: GetPathwaysQueryDto,
  ): Promise<EvangelismPathwayEntity[]> {
    return this.evangelismService.getPathways(query.lang || 'es');
  }

  @Get('pathways/:slug')
  async getPathwayBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ): Promise<EvangelismPathwayEntity> {
    return this.evangelismService.getPathwayBySlug(slug, lang || 'es');
  }

  @Get('objections')
  async getObjections(
    @Query() query: GetObjectionsQueryDto,
  ): Promise<EvangelismObjectionEntity[]> {
    return this.evangelismService.getObjections(
      query.category,
      query.q,
      query.lang || 'es',
    );
  }

  @Get('tracts')
  async getTracts(
    @Query() query: GetTractsQueryDto,
  ): Promise<EvangelismTractEntity[]> {
    return this.evangelismService.getTracts(query.audience, query.lang || 'es');
  }

  @Get('tracts/:slug')
  async getTractBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
  ): Promise<EvangelismTractEntity> {
    return this.evangelismService.getTractBySlug(slug, lang || 'es');
  }
}
