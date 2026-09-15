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
import { CybersecurityService } from '../services/cybersecurity.service';
import { CreateSecurityPostDto } from '../dto/create-security-post.dto';
import { GetSecurityPostsQueryDto } from '../dto/get-security-posts-query.dto';

@Controller('software/cybersecurity')
export class CybersecurityController {
  constructor(private readonly securityService: CybersecurityService) {}

  @Get()
  async findAll(@Query() query: GetSecurityPostsQueryDto) {
    return this.securityService.findAll(query);
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.securityService.remove(id);
    return { success: true };
  }
}
