import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumTopic } from './entities/forum-topic.entity';
import { ForumReply } from './entities/forum-reply.entity';
import { ForumController } from './controllers/forum.controller';
import { ForumService } from './services/forum.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForumTopic, ForumReply], 'softwareConnection'),
  ],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
})
export class ForumModule {}
