import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsArticle } from './entities/news-article.entity';
import { NewsController } from './controllers/news.controller';
import { NewsService } from './services/news.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsArticle], 'softwareConnection')],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
