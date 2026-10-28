import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../common/entities/tag.entity';
import { ContentTag } from '../common/entities/content-tag.entity';
import { RecommendationsController } from './controllers/recommendations.controller';
import { RecommendationsService } from './services/recommendations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, ContentTag], 'doiceladevConnection'),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
