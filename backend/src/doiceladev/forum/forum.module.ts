import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumTopic } from './entities/forum-topic.entity';
import { ForumReply } from './entities/forum-reply.entity';
import { ForumPollOption } from './entities/forum-poll-option.entity';
import { ForumController } from './controllers/forum.controller';
import { ForumService } from './services/forum.service';
import { ForumThrottleGuard } from './guards/forum-throttle.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ForumTopic, ForumReply, ForumPollOption],
      'doiceladevConnection',
    ),
  ],
  controllers: [ForumController],
  providers: [ForumService, ForumThrottleGuard],
  exports: [ForumService],
})
export class ForumModule {}
