import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ForumService } from '../services/forum.service';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';
import { GetForumTopicsQueryDto } from '../dto/get-forum-topics-query.dto';

@Controller('software/forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get()
  async findAll(@Query() query: GetForumTopicsQueryDto) {
    return this.forumService.findAllTopics(
      query.category,
      query.search,
      query.lang,
    );
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('lang') lang?: string,
  ) {
    return this.forumService.findTopic(idOrSlug, lang);
  }

  @Post()
  async createTopic(@Body() createTopicDto: CreateForumTopicDto) {
    return this.forumService.createTopic(createTopicDto);
  }

  @Post('replies')
  async createReply(@Body() createReplyDto: CreateForumReplyDto) {
    return this.forumService.createReply(createReplyDto);
  }

  @Get(':id/replies')
  async getReplies(@Param('id') id: string) {
    return this.forumService.findRepliesByTopic(+id);
  }
}
