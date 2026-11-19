import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ForumService } from '../services/forum.service';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';
import { GetForumTopicsQueryDto } from '../dto/get-forum-topics-query.dto';
import { ForumThrottleGuard } from '../guards/forum-throttle.guard';

@Controller('doiceladev/forum')
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

  @Get(':id/replies')
  async getReplies(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.findRepliesByTopic(id);
  }

  @Post('replies')
  @UseGuards(ForumThrottleGuard)
  async createReply(@Body() createReplyDto: CreateForumReplyDto) {
    return this.forumService.createReply(createReplyDto);
  }

  @Post('replies/:id/vote')
  @UseGuards(ForumThrottleGuard)
  async voteReply(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.voteReply(id);
  }

  @Post('replies/:id/unvote')
  @UseGuards(ForumThrottleGuard)
  async unvoteReply(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.unvoteReply(id);
  }

  @Post(':id/poll/:optionId/vote')
  @UseGuards(ForumThrottleGuard)
  async votePollOption(
    @Param('id', ParseIntPipe) id: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body('previousOptionId') previousOptionId?: number,
  ) {
    const prevId =
      typeof previousOptionId === 'number' && !Number.isNaN(previousOptionId)
        ? previousOptionId
        : undefined;
    return this.forumService.votePollOption(id, optionId, prevId);
  }

  @Post(':id/poll/:optionId/unvote')
  @UseGuards(ForumThrottleGuard)
  async unvotePollOption(
    @Param('id', ParseIntPipe) id: number,
    @Param('optionId', ParseIntPipe) optionId: number,
  ) {
    return this.forumService.unvotePollOption(id, optionId);
  }
}
