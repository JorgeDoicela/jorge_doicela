import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CybersecurityService } from '../services/cybersecurity.service';
import { CreateSecurityPostDto } from '../dto/create-security-post.dto';
import type {
  SecuritySeverity,
  SecurityPostType,
} from '../entities/security-post.entity';

@Controller('software/cybersecurity')
export class CybersecurityController {
  constructor(private readonly securityService: CybersecurityService) {}

  @Get()
  async findAll(
    @Query('severity') severity?: string,
    @Query('postType') postType?: string,
    @Query('search') search?: string,
    @Query('lang') lang?: string,
  ) {
    return this.securityService.findAll(
      severity as SecuritySeverity,
      postType as SecurityPostType,
      search,
      lang,
    );
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.securityService.findOne(idOrSlug, lang);
  }

  @Post()
  async create(@Body() createSecurityPostDto: CreateSecurityPostDto) {
    return this.securityService.create(createSecurityPostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.securityService.remove(+id);
    return { success: true };
  }
}
