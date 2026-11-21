import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Headers,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ForumService } from '../services/forum.service';
import { CreateForumReplyDto } from '../dto/create-forum-reply.dto';
import { GetForumTopicsQueryDto } from '../dto/get-forum-topics-query.dto';
import { VotePollOptionDto } from '../dto/vote-poll-option.dto';
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

  @Delete('replies/:id')
  @UseGuards(ForumThrottleGuard)
  async deleteReply(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-reply-delete-token') deleteToken?: string,
  ) {
    return this.forumService.deleteReply(id, deleteToken);
  }

  @Post(':id/poll/:optionId/vote')
  @UseGuards(ForumThrottleGuard)
  async votePollOption(
    @Param('id', ParseIntPipe) id: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() body?: VotePollOptionDto,
  ) {
    return this.forumService.votePollOption(
      id,
      optionId,
      body?.previousOptionId,
    );
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
