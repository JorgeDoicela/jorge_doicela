import { Controller, Get, Param, Query } from '@nestjs/common';
import { CybersecurityService } from '../services/cybersecurity.service';
import { GetSecurityPostsQueryDto } from '../dto/get-security-posts-query.dto';

@Controller('doiceladev/cybersecurity')
export class CybersecurityController {
  constructor(private readonly cybersecurityService: CybersecurityService) {}

  @Get()
  async findAll(@Query() query: GetSecurityPostsQueryDto) {
    return this.cybersecurityService.findAll(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.cybersecurityService.getCategories(lang);
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.cybersecurityService.findOne(idOrSlug, lang);
  }
}
