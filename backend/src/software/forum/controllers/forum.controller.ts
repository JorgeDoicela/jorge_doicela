import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ForumService } from '../services/forum.service';
import { CreateForumTopicDto } from '../dto/create-forum-topic.dto';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';
import { GetForumTopicsQueryDto } from '../dto/get-forum-topics-query.dto';

@Controller('software/forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get()
  async findAll(@Query() query: GetForumTopicsQueryDto) {
    return this.forumService.findAllTopics(query);
  }

  @Get('categories')
  async getCategories(@Query('lang') lang?: string) {
    return this.forumService.getCategories(lang);
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
  async getReplies(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.findRepliesByTopic(id);
  }
}
