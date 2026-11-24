import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PortfolioLabsService } from '../services/portfolio-labs.service';
import type { VerifyFlagResult } from '../services/portfolio-labs.service';
import { PortfolioLabChallenge } from '../entities/portfolio-lab-challenge.entity';
import { VerifyLabFlagDto } from '../dto/verify-lab-flag.dto';
import { LabsThrottleGuard } from '../guards/labs-throttle.guard';

@Controller('portfolio/labs')
export class PortfolioLabsController {
  constructor(private readonly labsService: PortfolioLabsService) {}

  @Get()
  async getAllLabs(
    @Query('lang') lang?: string,
  ): Promise<PortfolioLabChallenge[]> {
    return this.labsService.findAll(lang);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LabsThrottleGuard)
  async verifyFlag(@Body() dto: VerifyLabFlagDto): Promise<VerifyFlagResult> {
    return this.labsService.verifyFlag(dto.slug, dto.flag);
  }
}
