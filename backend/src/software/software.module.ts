import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Article } from './entities/article.entity';
import { ForumTopic } from './entities/forum-topic.entity';
import { SoftwareService } from './services/software.service';
import { SoftwareController } from './controllers/software.controller';
import { ArticlesService } from './services/articles.service';
import { ArticlesController } from './controllers/articles.controller';
import { ForumService } from './services/forum.service';
import { ForumController } from './controllers/forum.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'softwareConnection',
      type: 'better-sqlite3',
      database: process.env.DATABASE_SOFTWARE_PATH || 'software.sqlite',
      entities: [Project, Article, ForumTopic],
      synchronize: true,
    }),
    TypeOrmModule.forFeature(
      [Project, Article, ForumTopic],
      'softwareConnection',
    ),
  ],
  controllers: [SoftwareController, ArticlesController, ForumController],
  providers: [SoftwareService, ArticlesService, ForumService],
  exports: [SoftwareService, ArticlesService, ForumService],
})
export class SoftwareModule {}
