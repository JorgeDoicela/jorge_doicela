import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ForumService } from '../services/forum.service';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';

@Controller('software/forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get()
  async findAll() {
    return this.forumService.findAll();
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.forumService.findOne(idOrSlug);
  }

  @Post()
  async create(@Body() createTopicDto: CreateForumTopicDto) {
    return this.forumService.create(createTopicDto);
  }
}
