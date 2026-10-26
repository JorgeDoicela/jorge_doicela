import { Controller, Get, Query } from '@nestjs/common';
import { PericopesService } from '../services/pericopes.service';
import { GetPericopesFilterDto } from '../dto/get-pericopes-filter.dto';
import { Pericope } from '../entities/pericope.entity';

@Controller('kartex/pericopes')
export class PericopesController {
  constructor(private readonly pericopesService: PericopesService) {}

  @Get()
  async findAll(
    @Query() filterDto: GetPericopesFilterDto,
  ): Promise<Pericope[]> {
    return this.pericopesService.findFiltered(filterDto);
  }
}
