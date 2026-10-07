import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentaryAuthorEntity } from './entities/commentary-author.entity';
import { CommentaryEntryEntity } from './entities/commentary-entry.entity';
import { CommentariesService } from './services/commentaries.service';
import { CommentariesController } from './controllers/commentaries.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [CommentaryAuthorEntity, CommentaryEntryEntity],
      'kartexConnection',
    ),
  ],
  controllers: [CommentariesController],
  providers: [CommentariesService],
  exports: [CommentariesService],
})
export class CommentariesModule {}
